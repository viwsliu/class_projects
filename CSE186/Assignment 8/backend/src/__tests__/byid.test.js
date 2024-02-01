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
  await request.post('/v0/mail/{id}');
});

test('no login, get mail by id', async () => {
  const response = await request.get(
    `/v0/mail/${'3fa85f64-5717-4562-b3fc-2c963f66afa6'}`,
  );
  expect(response.status).toBe(401);
  expect(response.body).toBeDefined();
});


test('login, get mail by id', async () => {
  const user1 = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };
  const response1 = await request.post('/v0/login/').send(user1);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;
  const input = {
    'subject': 'testsubject',
    'content': 'testcontent',
    'to': {
      'name': 'username',
      'email': 'user@example.com',
    },
  };

  const login = await request
    .post('/v0/mail/')
    .set('Authorization', `Bearer ${authToken}`)
    .send(input);
  expect(login.status).toBe(200);
  expect(login).toBeDefined();

  const login2 = await request
    .get(`/v0/mail/${login.body.id}`)
    .set('Authorization', `Bearer ${authToken}`);
  expect(login2.status).toBe(200);
  expect(login2).toBeDefined();


  const login3 = await request
    .get(`/v0/mail/${'16396151-bef3-4101-a6b8-dd33e21e9dd2'}`)
    .set('Authorization', `Bearer ${authToken}`);
  expect(login3.status).toBe(404);
  expect(login3).toBeDefined();
});
