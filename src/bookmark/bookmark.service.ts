import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookmarkDto } from './dto/create-bookmark.dto.js';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto.js';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lists all bookmarks owned by the given user.
   * Throws 404 when the user has no bookmarks yet.
   */
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
    });

    if (!bookmarks || bookmarks.length === 0) {
      throw new NotFoundException('No Bookmarks Found');
    }

    return bookmarks;
  }

  /**
   * Fetches a single bookmark, scoped to the authenticated user
   * (a bookmark owned by someone else is treated as "not found").
   */
  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { userId, id: bookmarkId },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark Not Found');
    }

    return bookmark;
  }

  /** Creates a new bookmark and assigns it to the authenticated user. */
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  /** Partially updates a bookmark, scoped to the authenticated user. */
  async updateBookmark(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.update({
      where: {
        userId,
        id: bookmarkId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark Not Found');
    }

    return bookmark;
  }

  /** Deletes a bookmark owned by the user; P2025 = record was not found. */
  async deleteBookmark(userId: number, bookmarkId: number) {
    try {
      await this.prisma.bookmark.delete({
        where: {
          userId,
          id: bookmarkId,
        },
      });

      return { message: 'Bookmark Deleted Successfully' };
    } catch (error: any) {
      // P2025 is Prisma's "operation failed because record was not found".
      if (error.code === 'P2025') {
        throw new NotFoundException('Bookmark Not Found');
      }

      throw error;
    }
  }
}
