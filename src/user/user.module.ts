import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

// Offers the authenticated user's profile endpoints (requires jwt-access guard).
@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
