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
  await request.post('/v0/mail/');
});

test('no login, post mail', async () => {
  const response = await request.post('/v0/mail/');
  expect(response.status).toBe(401);
  expect(response.body).toBeDefined();
});


test('login, post mail', async () => {
  const user1 = {
    'email': 'molly@books.com',
    'password': 'mollymember',
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
});
