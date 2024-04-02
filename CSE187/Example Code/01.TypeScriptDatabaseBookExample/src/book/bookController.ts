/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
} from 'tsoa';

import { ISBN, Book } from '.';
import { BookService } from './bookService';

@Route('book')
export class BookController extends Controller {
  @Get('')
  public async getAll(@Query() author?: string): Promise<Book[]> {
    return new BookService().getAll(author);
  }

  @Get('{isbn}')
  @Response('404', 'Book not found')
  public async getBook(@Path() isbn: ISBN): Promise<Book | undefined> {
    return new BookService()
      .get(isbn)
      .then((book: Book | undefined): Book | undefined => {
        if (!book) {
          this.setStatus(404);
        }
        return book;
      });
  }

  @Post()
  @Response('409', 'Book with supplied ISBN exists')
  @SuccessResponse('201', 'Book created')
  public async createBook(@Body() book: Book): Promise<Book | undefined> {
    return new BookService()
      .get(book.isbn)
      .then(async (found: Book | undefined): Promise<Book | undefined> => {
        if (found) {
          this.setStatus(409);
        } else {
          return await new BookService().create(book);
        }
      });
  }
}
