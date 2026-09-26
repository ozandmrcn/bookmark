import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// @Global() makes PrismaService available to every module without re-importing.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
