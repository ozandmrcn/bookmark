import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { BookmarkModule } from './bookmark/bookmark.module.js';

@Module({
  imports: [
    // Load and expose .env variables globally across the whole application.
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Feature modules that compose the application.
    AuthModule, // authentication: signup / login / refresh / logout
    PrismaModule, // global database access through the Prisma client
    UserModule, // authenticated user profile operations
    BookmarkModule, // bookmark CRUD operations
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
