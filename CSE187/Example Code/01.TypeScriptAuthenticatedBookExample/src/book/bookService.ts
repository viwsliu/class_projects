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

import {ISBN, Book} from '.';
import books from "../../data/books.json";

export class BookService {
  public async getAll(author?: string): Promise<Book[]>  {
    return author ? books.filter(book => book.author == author) : books;
  }

  public async get(isbn: ISBN): Promise<Book|undefined>  {
    return books.find(book => book.isbn == isbn);
  }

  public async create(book: Book): Promise<Book> {
    books.push(book);
    return book;
  }
}
