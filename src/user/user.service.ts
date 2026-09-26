import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EditUserDto } from './dto/edit-user.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Updates the user's editable fields (firstName, lastName, email).
   * The password 'hash' column is stripped before returning the user.
   */
  async updateUser(id: number, body: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: body,
    });

    // Never expose the password hash.
    const { hash, ...rest } = user;

    return rest;
  }
}
