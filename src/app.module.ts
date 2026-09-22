import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Enable ConfigModule globally (for using .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Import AuthModule
    AuthModule,
    // Import PrismaModule
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
