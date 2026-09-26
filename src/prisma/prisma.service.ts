import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * Wraps the generated PrismaClient as an injectable NestJS service.
 * - Reads the connection string from the DATABASE_URL environment variable.
 * - Handles the database connection lifecycle with the application.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  // Opens the database connection when the application starts.
  async onModuleInit() {
    await this.$connect();
  }

  // Closes the database connection when the application shuts down.
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Removes all data in a single transaction (test helper).
  // Deletion order respects the foreign-key constraints.
  cleanDb() {
    return this.$transaction([
      this.blacklistedToken.deleteMany(),
      this.refreshToken.deleteMany(),
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
