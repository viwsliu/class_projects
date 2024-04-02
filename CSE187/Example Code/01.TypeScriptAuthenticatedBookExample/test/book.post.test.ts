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

import app from '../src/app';
import * as login from './login';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let accessToken: string|undefined;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  accessToken = await login.asAnna(supertest(server));
});

afterAll((done) => {
  server.close(done);
});

const book = {
  isbn: '4987331178',
  author: 'Bob Dylan',
  title: 'Mumble Mumble',
  publisher: 'McDermit Smith Wilson',
};

test('POST New', async () => {
  await supertest(server).post('/api/v0/book/')
    .set('Authorization', 'Bearer ' + accessToken)
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

test('GET After POST', async () => {
  await supertest(server).get('/api/v0/book/' + book.isbn)
    .set('Authorization', 'Bearer ' + accessToken)
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

test('POST Invalid ISBN', async () => {
  book.isbn = 'some-old-guff';
  await supertest(server).post('/api/v0/book/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(book)
    .expect(400);
});

test('POST Exisiting ISBN', async () => {
  book.isbn = '4987331179';
  await supertest(server).post('/api/v0/book/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(book)
    .expect(409);
});

test('POST Bad Request', async () => {
  book.isbn = 'AAAAAAAA';
  await supertest(server).post('/api/v0/book/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(book)
    .expect(400);
});

test('POST Anauthorised', async () => {
  accessToken = await login.asMolly(supertest(server));
  await supertest(server).post('/api/v0/book/')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(book)
    .expect(401)
});
