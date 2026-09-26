import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service.js';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorator/user.decorator.js';
import { CreateBookmarkDto } from './dto/create-bookmark.dto.js';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard('jwt-access'))
  @Get()
  getBookmarks(@User('id') id: number) {
    return this.bookmarkService.getBookmarks(id);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  getBookmarkById() {}

  @UseGuards(AuthGuard('jwt-access'))
  @Post()
  createBookmark(@User('id') id: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(id);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Patch(':id')
  updateBookmark() {}

  @UseGuards(AuthGuard('jwt-access'))
  @Delete(':id')
  deleteBookmark() {}
}
