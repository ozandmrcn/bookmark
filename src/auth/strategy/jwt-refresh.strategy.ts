import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service.js';
import { extractBearerToken, hashToken } from '../token.util.js';

/**
 * "jwt-refresh" Passport strategy.
 * Verifies the refresh token sent as a Bearer token in the Authorization
 * header, and rejects tokens that were revoked (logout / rotation) — i.e.
 * tokens no longer stored in the database. Guards the /auth/refresh route.
 */
@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      // Extract the JWT from the "Authorization: Bearer <token>" header.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Verify the token signature against the refresh-token secret.
      secretOrKey: configService.get('JWT_REFRESH_SECRET') || 'example-secret',
      // Give validate() access to the raw request so we can check storage.
      passReqToCallback: true,
    });
  }

  /**
   * Runs after signature verification: only tokens that are still stored
   * server-side are accepted. Logged-out or rotated tokens are rejected.
   * Returns the identity object attached to request.user.
   */
  async validate(req: Request, payload: any) {
    const rawToken = extractBearerToken(req.headers.authorization);

    if (!rawToken) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const stored = await this.prismaService.refreshToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    return { id: payload.sub, email: payload.email };
  }
}
