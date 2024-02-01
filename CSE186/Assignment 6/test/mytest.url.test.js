const supertest = require('supertest');
const http = require('http');

const app = require('../src/app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
});

test('GET URL', async () => {
  await request.get('/v0/mail/');
  await request.get('/v0/mail/:id');
  await request.post('/v0/mail');
  await request.put('/v0/mail/:id');
});

// get all of mailboxes
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
test('get by id', async () => {
  const id = '53b006f2-0357-41dc-9674-f06352ef1d51';
  const response = await request.get(`/v0/mail/${id}`);
  expect(response.status).toBe(200);
});
test('get by id broken id', async () => {
  const id = '53b006f2-0357-41dc-9674-f06352ef1d61';
  const response = await request.get(`/v0/mail/${id}`);
  expect(response.status).toBe(404);
});

// make new email in sent
test('POST a new mail', async () => {
  const newMail = {
    'subject': 'testSubject',
    'content': 'testContent',
    'to-name': 'testName',
    'to-email': 'user1234@example.com',
  };

  const response = await request.post('/v0/mail').send(newMail);
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
});
test('POST a new mail with invalid data', async () => {
  const invalidData = {
    'content': 'This is the content of the email',
    'recipient': 'example@example.com',
  };

  const response = await request.post('/v0/mail').send(invalidData);
  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
});

// put -----------------------------------------------------------------

test('should move email to the named mailbox', async () => {
  const id = 'b50fb70c-3c56-4044-8b8d-f0170b29bd6c';
  const response = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'inbox'});
  expect(response.status).toBe(204);
});

test('something to sent', async () => {
  const id = 'b50fb70c-3c56-4044-8b8d-f0170b29bd6c';
  const response = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'sent'});
  expect(response.status).toBe(409);
});

test('wrong id', async () => {
  const id = 'b50fb70c-3c56-4044-8b8d-f0170b29bd6d';
  const response = await request
    .put(`/v0/mail/${id}`)
    .query({mailbox: 'sent'});
  expect(response.status).toBe(404);
});


afterAll((done) => {
  server.close(done);
});


