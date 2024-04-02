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

import { ISBN, Book } from '.';
import { pool } from '../db';

export class BookService {
  public async getAll(author?: string): Promise<Book[]> {
    let select =
      `SELECT data || jsonb_build_object('isbn', isbn) AS book FROM book`;
    if (author) {
      select += ` WHERE data->>'author' ~* $1`;
    }
    const query = {
      text: select,
      values: author ? [`${author}`] : [],
    };
    const { rows } = await pool.query(query);
    const books = [];
    for (const row of rows) {
      books.push(row.book);
    }
    return books;
  }

  public async get(isbn: ISBN): Promise<Book | undefined> {
    const select =
      `SELECT data || jsonb_build_object('isbn', isbn)` +
      ` AS book FROM book` +
      ` WHERE isbn = $1`;
    const query = {
      text: select,
      values: [isbn],
    };
    const { rows } = await pool.query(query);
    return rows.length == 1 ? rows[0].book : undefined;
  }

  public async create(book: Book): Promise<Book> {
    const insert = `INSERT INTO book(isbn, data) VALUES ($1, $2)`;
    const query = {
      text: insert,
      values: [book.isbn, JSON.stringify(book)],
    };
    await pool.query(query);
    return book;
  }
}
