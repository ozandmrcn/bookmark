import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import { extractBearerToken, hashToken } from '../token.util.js';

/**
 * "jwt-access" Passport strategy.
 * Verifies the access token sent as a Bearer token in the Authorization
 * header, rejects tokens that were revoked on logout, and confirms the
 * user still exists. Guards routes protected with AuthGuard('jwt-access').
 */
@Injectable()
export class JWTAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      // Extract the JWT from the "Authorization: Bearer <token>" header.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Verify the token signature against the access-token secret.
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'example-secret',
      // Give validate() access to the raw request so we can check denylist.
      passReqToCallback: true,
    });
  }

  /**
   * Runs after signature verification:
   * - rejects blacklisted (revoked on logout) tokens, and
   * - ensures the user still exists.
   * Returns the full user record as request.user.
   */
  async validate(req: Request, payload: any) {
    const rawToken = extractBearerToken(req.headers.authorization);

    if (!rawToken) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const blacklisted = await this.prismaService.blacklistedToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
    });

    if (blacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Attach the full user record to request.user.
    return user;
  }
}
