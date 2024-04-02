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

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
});

afterAll((done) => {
  server.close(done);
});

const bad = {
  email: 'molly@books.com',
  password: 'notmollyspassword',
};

test('OK', async () => {
  await supertest(server).post('/api/v0/login')
    .send(login.molly)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.name).toBeDefined();
      expect(res.body.name).toEqual('Molly Member');
      expect(res.body.accessToken).toBeDefined();
    });
});

test('Bad Credentials', async () => {
  await supertest(server).post('/api/v0/login')
    .send(bad)
    .expect(401);
});

test('Corrupt JWT', async () => {
  const accessToken = await login.asMolly(supertest(server));
  await supertest(server).get('/api/v0/book')
    .set('Authorization', 'Bearer ' + accessToken + 'garbage')
    .expect(401);
});

test('No roles', async () => {
  const accessToken = await login.asNobby(supertest(server));
  await supertest(server).get('/api/v0/book')
    .set('Authorization', 'Bearer ' + accessToken)
    .expect(401)
});

test('No auth header', async () => {
  await supertest(server).get('/api/v0/book')
    .expect(401)
});
