import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service.js';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorator/user.decorator.js';
import { CreateBookmarkDto } from './dto/create-bookmark.dto.js';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto.js';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  /** GET /bookmark -> list all bookmarks owned by the authenticated user. */
  @UseGuards(AuthGuard('jwt-access'))
  @Get()
  async getBookmarks(@User('id') id: number) {
    return await this.bookmarkService.getBookmarks(id);
  }

  /** GET /bookmark/:id -> fetch a single bookmark (must belong to the user). */
  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  async getBookmarkById(
    @User('id') id: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.bookmarkService.getBookmarkById(id, bookmarkId);
  }

  /** POST /bookmark -> create a bookmark (responds with 201 Created). */
  @HttpCode(HttpStatus.CREATED) // 201
  @UseGuards(AuthGuard('jwt-access'))
  @Post()
  async createBookmark(@User('id') id: number, @Body() dto: CreateBookmarkDto) {
    return await this.bookmarkService.createBookmark(id, dto);
  }

  /** PATCH /bookmark/:id -> partially update a bookmark the user owns. */
  @UseGuards(AuthGuard('jwt-access'))
  @Patch(':id')
  async updateBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return await this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
  }

  /** DELETE /bookmark/:id -> delete a bookmark (responds with 204 No Content). */
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  @UseGuards(AuthGuard('jwt-access'))
  @Delete(':id')
  async deleteBookmark(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
