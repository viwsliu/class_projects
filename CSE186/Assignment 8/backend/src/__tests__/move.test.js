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
  await request.put('/v0/mail/{id}');
});

test('no login, move mail by id', async () => {
  const response = await request.get(
    `/v0/mail/${'3fa85f64-5717-4562-b3fc-2c963f66afa6'}?mailbox=${'trash'}`,
  );
  expect(response.status).toBe(401);
  expect(response.body).toBeDefined();
});


test('login, move mail by id to trash', async () => {
  const user1 = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };
  const response1 = await request.post('/v0/login/').send(user1);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;
  const input = {
    'subject': 'testsubject111',
    'content': 'testcontent111',
    'to': {
      'name': 'username111',
      'email': 'user111@example.com',
    },
  };

  const login = await request
    .post('/v0/mail/')
    .set('Authorization', `Bearer ${authToken}`)
    .send(input);
  expect(login.status).toBe(200);
  expect(login).toBeDefined();

  const login2 = await request
    .put(`/v0/mail/${login.body.id}`)
    .query({mailbox: 'trash'})
    .set('Authorization', `Bearer ${authToken}`);
  expect(login2.status).toBe(204);
  expect(login2).toBeDefined();

  const login3 = await request
    .put(`/v0/mail/${login.body.id}`)
    .query({mailbox: 'sent'})
    .set('Authorization', `Bearer ${authToken}`);
  expect(login3.status).toBe(409);
  expect(login3).toBeDefined();

  const login4 = await request
    .put(`/v0/mail/${login.body.id}`)
    .query({mailbox: 'newMailbox'})
    .set('Authorization', `Bearer ${authToken}`);
  expect(login4.status).toBe(204);
  expect(login4).toBeDefined();

  const login5 = await request
    .put(`/v0/mail/${login.body.id}`)
    .query({mailbox: 'random'})
    .set('Authorization', `Bearer ${authToken}`);
  expect(login5.status).toBe(204);
  expect(login5).toBeDefined();

  const login6 = await request
    .put(`/v0/mail/${login.body.id+'a'}`)
    .query({mailbox: 'random'})
    .set('Authorization', `Bearer ${authToken}`);
  expect(login6.status).toBe(404);
  expect(login6).toBeDefined();

  const response2 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'newMailbox'});
  expect(response2.status).toBe(404);
  expect(response2.body).toBeDefined();
});
