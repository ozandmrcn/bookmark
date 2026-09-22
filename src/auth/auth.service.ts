import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDTO, LoginDTO } from './dto/auth.dto.js';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  async signup(dto: SignupDTO) {
    try {
      const hashedPassword = await argon.hash(dto.password);

      return { message: 'User Singed Up' };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async login(dto: LoginDTO) {
    try {
      return { message: 'User Logged In' };
    } catch (error) {}
  }

  async logout() {
    try {
      return { message: 'User Logged Out' };
    } catch (error) {}
  }

  async refresh() {
    try {
      return { message: 'Token Refreshed' };
    } catch (error) {}
  }
}
