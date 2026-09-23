import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { JWTAccessStrategy } from './strategy/jwt-access.strategy.js';
import { JWTRefreshStrategy } from './strategy/jwt-refresh.strategy.js';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({})],
  providers: [AuthService, JWTAccessStrategy, JWTRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
