import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EditUserDto } from './dto/edit-user.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(id: number, body: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: body,
    });

    const { hash, ...rest } = user;

    return rest;
  }
}
