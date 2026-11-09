// Checks for the CORS rule, the body size limit and the safe error answers.
// Uses only Node's built-in test runner, so no extra packages are needed.
// Run with: npm run test:checks
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'check-secret';
process.env.CORS_ORIGIN = 'http://localhost:3000,http://127.0.0.1:3000';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');

let server;
let base;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

const jsonHeaders = { 'Content-Type': 'application/json' };

test('CORS: an allowed frontend origin gets the CORS header', async () => {
  const res = await fetch(`${base}/`, { headers: { Origin: 'http://localhost:3000' } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3000');
});

test('CORS: the second allowed origin from CORS_ORIGIN also works', async () => {
  const res = await fetch(`${base}/`, { headers: { Origin: 'http://127.0.0.1:3000' } });
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://127.0.0.1:3000');
});

test('CORS: an unknown website gets no CORS header, so the browser blocks it', async () => {
  const res = await fetch(`${base}/`, { headers: { Origin: 'https://evil.example.com' } });
  assert.equal(res.headers.get('access-control-allow-origin'), null);
});

test('CORS: the answer is never a wildcard', async () => {
  const res = await fetch(`${base}/`, { headers: { Origin: 'http://localhost:3000' } });
  assert.notEqual(res.headers.get('access-control-allow-origin'), '*');
});

test('CORS: the preflight for an allowed origin lists only the allowed methods and headers', async () => {
  const res = await fetch(`${base}/api/gigs`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'authorization,content-type'
    }
  });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3000');
  assert.match(res.headers.get('access-control-allow-methods'), /POST/);
  assert.match(res.headers.get('access-control-allow-headers'), /Authorization/i);
});

test('CORS: the preflight for an unknown origin gets no CORS header', async () => {
  const res = await fetch(`${base}/api/gigs`, {
    method: 'OPTIONS',
    headers: { Origin: 'https://evil.example.com', 'Access-Control-Request-Method': 'POST' }
  });
  assert.equal(res.headers.get('access-control-allow-origin'), null);
});

test('CORS: tools without an Origin header (Postman, curl, Newman) still work', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
});

test('Body limit: a small body is accepted and reaches validation (400, not 413)', async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: 'a@example.com' })
  });
  assert.equal(res.status, 400);
});

test('Body limit: a body of about 20 kb is refused with 413 and a safe message', async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email: 'a@example.com', password: 'x'.repeat(20000) })
  });
  assert.equal(res.status, 413);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.message, 'Request body is too large');
  assert.ok(!JSON.stringify(body).includes('stack'));
});

test('Body limit: a body just under 10 kb is not refused for its size (validation answers instead)', async () => {
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ name: 'x'.repeat(9000), email: 'bad', password: 'weak' })
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).message, 'Validation failed');
});

test('Errors: broken JSON gives a clean 400 with no internal details', async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: '{"email": "oops"'
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).message, 'Invalid JSON in request body');
});

test('Errors: an unknown route gives a controlled 404', async () => {
  const res = await fetch(`${base}/api/nothing-here`);
  assert.equal(res.status, 404);
});

test('Headers: Helmet and the Content Security Policy are present', async () => {
  const res = await fetch(`${base}/`);
  assert.match(res.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-powered-by'), null);
});

test('Protected routes refuse requests without a token (401)', async () => {
  for (const path of ['/api/gigs/mine', '/api/bookings', '/api/transactions', '/api/income']) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 401, `${path} should need a token`);
  }
});
