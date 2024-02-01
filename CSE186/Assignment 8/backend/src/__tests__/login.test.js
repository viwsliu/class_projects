
const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('GET URL', async () => {
  await request.post('/v0/login/');
});


test('GET login URL', async () => {
  const user1 = {
    'email': 'molly@books.com',
    'password': 'mollymember',
  };
  const response = await request.post('/v0/login/').send(user1);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET login URL', async () => {
  const user1 = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };
  const response = await request.post('/v0/login/').send(user1);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('wrong username', async () => {
  const user1 = {
    'email': 'anna',
    'password': 'annaadmin',
  };
  const response = await request.post('/v0/login/').send(user1);
  expect(response.status).toBe(404);
  expect(response.body).toBeDefined();
});

test('wrong password', async () => {
  const user1 = {
    'email': 'anna@books.com',
    'password': 'abcd',
  };
  const response = await request.post('/v0/login/').send(user1);
  expect(response.status).toBe(404);
  expect(response.body).toBeDefined();
});

test('wrong everything', async () => {
  const user1 = {
    'email': 'asdf',
    'password': 'abcd',
  };
  const response = await request.post('/v0/login/').send(user1);
  expect(response.status).toBe(404);
  expect(response.body).toBeDefined();
});
