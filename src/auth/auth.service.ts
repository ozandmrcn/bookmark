import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignupDTO, LoginDTO } from './dto/auth.dto.js';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDTO) {
    try {
      const hashedPassword = await argon.hash(dto.password);

      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash: hashedPassword,
        },
      });

      const accessToken = await this.signAccessToken(user.id, user.email);
      const refreshToken = await this.signRefreshToken(user.id, user.email);

      const { hash: _hash, ...rest } = user;

      return {
        message: 'User Signed Up',
        user: rest,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('This email is already used');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Wrong credentials');
    }

    const isPasswordValid = await argon.verify(user.hash, dto.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong credentials');
    }

    const accessToken = await this.signAccessToken(user.id, user.email);
    const refreshToken = await this.signRefreshToken(user.id, user.email);

    const { hash: _hash, ...rest } = user;

    return {
      message: 'User Logged In',
      user: rest,
      accessToken,
      refreshToken,
    };
  }

  async logout() {
    return { message: 'User Logged Out' };
  }

  async refresh() {
    return { message: 'Token Refreshed' };
  }

  async signAccessToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async signRefreshToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
