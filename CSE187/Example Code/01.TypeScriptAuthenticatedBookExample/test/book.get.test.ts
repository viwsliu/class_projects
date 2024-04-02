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
  accessToken = await login.asMolly(supertest(server));
});

afterAll((done) => {
  server.close(done);
});

test('GET Invalid URL', async () => {
  await supertest(server).get('/api/v0/bookie-wookie')
    .expect(404);
});

test('GET API Docs', async () => {
  await supertest(server).get('/api/v0/docs/')
    .expect(200);
});

test('GET All', async () => {
  await supertest(server).get('/api/v0/book')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(254);
    });
});

test('GET One', async () => {
  await supertest(server).get('/api/v0/book/4987331179')
    .set('Authorization', 'Bearer ' + accessToken)
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

test('GET By Author', async () => {
  await supertest(server).get('/api/v0/book?author=Oswald%20Rennox')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body[0]).toBeDefined();
      expect(res.body[0].title).toEqual('Heart Condition');
    });
});

test('GET Missing', async () => {
  await supertest(server).get('/api/v0/book/4987331166')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(404);
});

test('GET Invalid ISBN ', async () => {
  await supertest(server).get('/api/v0/book/4987331178-1')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(400);
});

test('GET Unauthorised', async () => {
  accessToken = await login.asNobby(supertest(server));
  await supertest(server).get('/api/v0/book')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(401);
});
