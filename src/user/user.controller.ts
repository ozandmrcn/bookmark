import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from '../auth/decorator/user.decorator.js';
import type { User as UserType } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /** GET /user/profile -> return the authenticated user (fetched by the JWT strategy). */
  @UseGuards(AuthGuard('jwt-access'))
  @Get('profile')
  getProfile(@User() user: UserType) {
    return user;
  }

  /** PATCH /user/update -> partially update the authenticated user's profile. */
  @UseGuards(AuthGuard('jwt-access'))
  @Patch('update')
  async updateUser(@User('id') id: number, @Body() body: EditUserDto) {
    return await this.userService.updateUser(id, body);
  }
}
