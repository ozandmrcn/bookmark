import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDTO, LoginDTO } from './dto/auth.dto.js';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { hashToken } from './token.util.js';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Registers a new user.
   * - Hashes the password with argon2 before persisting.
   * - Signs and returns an access/refresh token pair for the new account.
   */
  async signup(dto: SignupDTO) {
    try {
      // Never store the raw password - only its argon2 hash.
      const hashedPassword = await argon.hash(dto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash: hashedPassword,
        },
      });

      // The new user is logged in immediately.
      const accessToken = await this.signAccessToken(user.id, user.email);
      const refreshToken = await this.signRefreshToken(user.id, user.email);

      // Persist the refresh token so it can be revoked later (e.g. logout).
      await this.storeRefreshToken(user.id, refreshToken);

      // Strip the hash before sending the user object over the wire.
      const { hash: _hash, ...rest } = user;

      return {
        message: 'User Signed Up',
        user: rest,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // P2002 = unique constraint violation (email already in use).
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('This email is already used');
        }
      }
      throw error;
    }
  }

  /**
   * Authenticates an existing user by email + password.
   * Throws a generic "Wrong credentials" for both missing users and
   * incorrect passwords to avoid leaking which emails exist.
   */
  async login(dto: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Wrong credentials');
    }

    // Compare the supplied password against the stored argon2 hash.
    const isPasswordValid = await argon.verify(user.hash, dto.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong credentials');
    }

    const accessToken = await this.signAccessToken(user.id, user.email);
    const refreshToken = await this.signRefreshToken(user.id, user.email);

    // Rotate: replace the previously stored refresh token with the new one.
    await this.storeRefreshToken(user.id, refreshToken);

    // Strip the hash before sending the user object over the wire.
    const { hash: _hash, ...rest } = user;

    return {
      message: 'User Logged In',
      user: rest,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs the user out by revoking every server-side credential:
   * - deletes all stored refresh tokens for the user, and
   * - adds the presented access token to the denylist.
   * After this call no previously issued token can be used anymore.
   */
  async logout(userId: number, rawAccessToken: string) {
    await this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });

    if (rawAccessToken) {
      const payload = this.jwtService.decode(rawAccessToken) as {
        exp?: number;
      } | null;

      await this.prismaService.blacklistedToken.create({
        data: {
          userId,
          tokenHash: hashToken(rawAccessToken),
          expiresAt: payload?.exp
            ? new Date(payload.exp * 1000)
            : new Date(),
        },
      });
    }

    return { message: 'User Logged Out' };
  }

  /**
   * Issues a fresh token pair for a user whose refresh token is valid.
   * The presented refresh token must still be stored server-side, otherwise
   * it has been revoked (logout) or already rotated. Refreshing rotates
   * the refresh token, so a stolen token dies after a single use.
   */
  async refresh(
    rawRefreshToken: string,
    id: number,
    email: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const stored = await this.prismaService.refreshToken.findUnique({
      where: { tokenHash: hashToken(rawRefreshToken) },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const accessToken = await this.signAccessToken(id, email);
    const refreshToken = await this.signRefreshToken(id, email);

    // Rotate: the old refresh token is replaced by the fresh one.
    await this.storeRefreshToken(id, refreshToken);

    return { message: 'Token Refreshed', accessToken, refreshToken };
  }

  /** Signs a short-lived access token (15 minutes). */
  async signAccessToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
      // Unique id per token so every issued token is distinct.
      jwtid: randomUUID(),
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  /** Signs a long-lived refresh token (7 days). */
  async signRefreshToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
      // Uniqueness is mandatory for rotation: each new refresh token must
      // produce a different string, otherwise the old one would stay valid.
      jwtid: randomUUID(),
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Persists a refresh token (hashed) for the user, replacing any previous
   * one. Only one active refresh token per user is kept at a time.
   */
  private async storeRefreshToken(userId: number, refreshToken: string) {
    const payload = this.jwtService.decode(refreshToken) as {
      exp?: number;
    } | null;

    await this.prismaService.refreshToken.deleteMany({ where: { userId } });

    await this.prismaService.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(refreshToken),
        expiresAt: payload?.exp ? new Date(payload.exp * 1000) : new Date(),
      },
    });
  }
}
