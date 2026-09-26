import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDTO, SignupDTO } from './dto/auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { extractBearerToken } from './token.util.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/signup -> create a new user account and issue a token pair. */
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignupDTO) {
    return this.authService.signup(dto);
  }

  /** POST /auth/login -> authenticate with email + password. */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/logout -> sign the authenticated user out.
   * Guarded with the "jwt-access" strategy like the other protected routes.
   * Revokes the refresh tokens and blacklists the current access token.
   */
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: express.Request) {
    // The strategy's validate() attaches the full user record to request.user.
    const user = req.user as { id: number };
    const rawAccessToken =
      extractBearerToken(req.headers.authorization) ?? '';

    return await this.authService.logout(user.id, rawAccessToken);
  }

  /**
   * POST /auth/refresh -> issue a fresh token pair.
   * Guarded by the "jwt-refresh" Passport strategy, which expects the
   * refresh token as a Bearer token in the Authorization header. The raw
   * token is required to rotate the stored refresh token.
   */
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: express.Request) {
    // The strategy's validate() attaches { id, email } to request.user.
    const user = req.user as { id: number; email: string };

    if (!user.id || !user.email) {
      throw new UnauthorizedException('User not found');
    }

    const rawRefreshToken =
      extractBearerToken(req.headers.authorization) ?? '';

    return await this.authService.refresh(rawRefreshToken, user.id, user.email);
  }
}
