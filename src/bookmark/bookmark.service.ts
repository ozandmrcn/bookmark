import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
    });

    if (!bookmarks || bookmarks.length === 0) {
      throw new NotFoundException('No Bookmarks Found');
    }

    return bookmarks;
  }

  async getBookmarkById(bookmarkId: number) {}

  async createBookmark(userId: number) {}

  async updateBookmark(bookmarkId: number) {}

  async deleteBookmark(bookmarkId: number) {}
}
