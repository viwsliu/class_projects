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

import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

beforeEach(() => {
  return db.reset();
});

it('Rejects Invalid URL', async () => {
  await supertest(server).get('/api/v0/bookie-wookie').expect(404);
});

it('Serves API Docs', async () => {
  await supertest(server).get('/api/v0/docs/').expect(200);
});

it('GETs All', async () => {
  await supertest(server)
    .get('/api/v0/book')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(256);
    });
});

it('GETs One', async () => {
  await supertest(server)
    .get('/api/v0/book/4987331179')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual('4987331179');
      expect(res.body.author).toEqual('Zelig Nizet');
      expect(res.body.title).toEqual('Across the Bridge');
      expect(res.body.publisher).toEqual('HarrisMcDermott');
    });
});

it('GETs By Author', async () => {
  await supertest(server)
    .get('/api/v0/book?author=Oswald%20Rennox')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body[0]).toBeDefined();
      expect(res.body[0].title).toEqual('Heart Condition');
    });
});

it('Rejects Unknown ISBN', async () => {
  await supertest(server).get('/api/v0/book/4987331166').expect(404);
});

it('Rejects Badly Formed ISBN ', async () => {
  await supertest(server).get('/api/v0/book/4987331178-1').expect(400);
});

it('POSTs New', async () => {
  const book = {
    isbn: '4987331178',
    author: 'Bob Dylan',
    title: 'Mumble Mumble',
    publisher: 'McDermit Smith Wilson',
  };
  await supertest(server)
    .post('/api/v0/book/')
    .send(book)
    .expect(201)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual(book.isbn);
      expect(res.body.author).toEqual(book.author);
      expect(res.body.title).toEqual(book.title);
      expect(res.body.publisher).toEqual(book.publisher);
    });
});

it('GETs After POST', async () => {
  const book = {
    isbn: '4987331178',
    author: 'Bob Dylan',
    title: 'Mumble Mumble',
    publisher: 'McDermit Smith Wilson',
  };
  await supertest(server).post('/api/v0/book/').send(book);
  await supertest(server)
    .get('/api/v0/book/' + book.isbn)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.isbn).toBeDefined();
      expect(res.body.isbn).toEqual(book.isbn);
      expect(res.body.author).toEqual(book.author);
      expect(res.body.title).toEqual(book.title);
      expect(res.body.publisher).toEqual(book.publisher);
    });
});

it('Rejects Invalid ISBN', async () => {
  const book = {
    isbn: 'not-an-isbn',
    author: 'whatever',
    title: 'whatever',
    publisher: 'whatever',
  };
  await supertest(server).post('/api/v0/book/').send(book).expect(400);
});

it('Rejects Badly formed Book', async () => {
  const book = {
    isbn: '4987331178',
    // author is missing
    title: 'whatever',
    publisher: 'whatever',
  };
  await supertest(server).post('/api/v0/book/').send(book).expect(400);
});

it('Rejects Exisiting ISBN', async () => {
  const book = {
    isbn: '4987331179',
    author: 'whatever',
    title: 'whatever',
    publisher: 'whatever',
  };
  await supertest(server).post('/api/v0/book/').send(book).expect(409);
});
