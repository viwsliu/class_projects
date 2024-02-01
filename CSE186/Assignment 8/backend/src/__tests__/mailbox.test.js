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
  await request.get('/v0/mailbox/');
});

test('no login, get mailboxes', async () => {
  const response = await request.get('/v0/mailbox/');
  expect(response.status).toBe(401);
  expect(response.body).toBeDefined();
});


test('login, get inbox', async () => {
  const user1 = {
    'email': 'molly@books.com',
    'password': 'mollymember',
  };
  const response1 = await request.post('/v0/login/').send(user1);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;
  const wrongauthToken = 'somewrongthing';

  const response2 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${wrongauthToken}`);
  expect(response2.status).toBe(403);
  expect(response2.body).toBeDefined();

  const response3 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer `);
  expect(response3.status).toBe(403);
  expect(response3.body).toBeDefined();


  const response4 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`);
  expect(response4.status).toBe(200);
  expect(response4.body).toBeDefined();
});

test('login, get sent', async () => {
  const user1 = {
    'email': 'molly@books.com',
    'password': 'mollymember',
  };
  const response1 = await request.post('/v0/login/').send(user1);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;

  const response2 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'sent'});
  expect(response2.status).toBe(200);
  expect(response2.body).toBeDefined();
});

test('login, inbox, search', async () => {
  const user2 = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };
  const response1 = await request.post('/v0/login/').send(user2);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;

  const response2 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'trash'});
  expect(response2.status).toBe(200);
  expect(response2.body).toBeDefined();
});

test('login, get sent', async () => {
  const user2 = {
    'email': 'anna@books.com',
    'password': 'annaadmin',
  };
  const response1 = await request.post('/v0/login/').send(user2);
  expect(response1.status).toBe(200);
  expect(response1.body).toBeDefined();

  const authToken = response1.body.accessToken;

  const response2 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'inbox', from: 'Wandie Milson'});
    // console.log(response2.body[0].mail[0])
  expect(response2.body[0].name).toBe('inbox');
  expect(response2.body[0].mail[0].subject)
    .toBe('Fundamental bottom-line migration');
  expect(response2.status).toBe(200);
  expect(response2.body).toBeDefined();


  const response3 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'sent', from: 'nmaccaig2d@xing.com'});
    // console.log(response3.body[0].mail[0])
  expect(response3.body[0].name).toBe('sent');
  expect(response3.body[0].mail[0].to.name).toBe('Nicolis MacCaig');
  expect(response3.body[0].mail[0].subject)
    .toBe('Grass-roots grid-enabled archive');
  expect(response3.status).toBe(200);
  expect(response3.body).toBeDefined();

  const response4 = await request
    .get('/v0/mailbox/')
    .set('Authorization', `Bearer ${authToken}`)
    .query({mailbox: 'abcdefg'});
  // console.log('resp 4', response4.body)
  expect(response4.status).toBe(404);
});
