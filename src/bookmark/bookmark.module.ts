import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller.js';
import { BookmarkService } from './bookmark.service.js';

// Offers the authenticated user's bookmark CRUD endpoints (requires jwt-access guard).
@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
