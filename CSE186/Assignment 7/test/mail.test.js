const supertest = require('supertest');
/*
#######################################################################
#
# Copyright (C) 2020-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
// Referenced Prof's example
const http = require('http');

const db = require('./db');
const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

// ----------------------------------------------

test('GET all mails', async () => {
  const response = await request.get('/v0/mail/');
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET trash mails', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'trash'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET inbox mails', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'inbox'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET sent mails', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'sent'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});
test('GET randomthing mails', async () => {
  const response = await request
    .get('/v0/mail/')
    .query({mailbox: 'randomthing'});
  expect(response.status).toBe(404);
});

// get by id
test('GET by id', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'inbox'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  const id = response.body[1].mail[2].id;
  const response2 = await request.get(`/v0/mail/${id}`);
  expect(response2.status).toBe(200);
});

test('GET by id broken id', async () => {
  const id = '53b006f2-0357-41dc-9674-f06352ef1d61';
  const response = await request.get(`/v0/mail/${id}`);
  expect(response.status).toBe(404);
});

// POST ---------------------------------------------
test('POST valid data', async () => {
  const newMail = {
    'subject': 'testSubject',
    'content': 'testContent',
    'to': {'name': 'testName', 'email': 'user1234@example.com'},
  };
  const response = await request.post('/v0/mail').send(newMail);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});


test('POST invalid data', async () => {
  const invalidData = {
    'content': 'This is the content of the email',
    'recipient': 'example@example.com',
    'to': {
      'name': 'testName',
      'email': 'user1234@example.com',
      'randomthing': 'afrdshahrsf',
    },
  };
  const response = await request.post('/v0/mail').send(invalidData);
  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
});

test('POST missing subject', async () => {
  const newMail = {
    'content': 'testContent',
    'to': {'name': 'testName', 'email': 'user1234@example.com'},
  };
  const response = await request.post('/v0/mail').send(newMail);
  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
});

// put -----------------------------------------------------------------

test('PUT from inbox to trash', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'inbox'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  const id = response.body[1].mail[5].id;
  const response2 = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'trash'});
  expect(response2.status).toBe(204);
});

test('PUT from trash to sent', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'trash'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  const id = response.body[1].mail[2].id;
  const response2 = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'sent'});
  expect(response2.status).toBe(409);
});

test('PUT from sent to newmailbox', async () => {
  const response = await request.get('/v0/mail/').query({mailbox: 'trash'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  const id = response.body[1].mail[2].id;
  const response2 = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'newmailbox'});
  expect(response2.status).toBe(204);
});

test('PUT wrong id', async () => {
  const id = 'b50fb70c-3c56-4044-8b8d-f0170b29bd6';
  const response = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'sent'});
  expect(response.status).toBe(404);
});

test('GET newmailbox mails', async () => {
  const response = await request.get('/v0/mail/')
    .query({mailbox: 'newmailbox'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

// stretch tests

test('GET trash mails with from name a', async () => {
  const response = await request.get('/v0/mail/')
    .query({mailbox: 'trash', from: 'a'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET from = a', async () => {
  const response = await request.get('/v0/mail/')
    .query({from: 'a'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});

test('GET from = a', async () => {
  const response = await request.get('/v0/mail/')
    .query({from: 'katter1p@cargocollective.com'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});


test('GET from = abcd', async () => {
  const response = await request.get('/v0/mail/')
    .query({from: 'abcd'});
  expect(response.status).toBe(404);
  expect(response.body).toBeDefined();
});


test('PUT inbox to abc => check if exists in mailbox', async () => {
  const response = await request.get('/v0/mail/')
    .query({mailbox: 'inbox'});
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();

  const id = response.body[1].mail[6].id;
  const response2 = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'testcase'});
  expect(response2.status).toBe(204);

  const response3 = await request.get('/v0/mail/')
    .query({mailbox: 'testcase'});
  expect(response3.status).toBe(200);
  expect(response3.body).toBeDefined();
});
