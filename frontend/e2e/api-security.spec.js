const { test, expect } = require('@playwright/test');

const API = process.env.E2E_API_URL || 'https://localhost:5000';

test.describe('Backend API security checks (integration)', () => {
  test('the API root responds and sends Helmet security headers', async ({ request }) => {
    const response = await request.get(`${API}/`);
    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('an unknown route returns a controlled 404 without a stack trace', async ({ request }) => {
    const response = await request.get(`${API}/api/does-not-exist`);
    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).not.toContain('node_modules');
    expect(body).not.toContain('at Object');
  });

  test('a protected endpoint rejects a request with no token', async ({ request }) => {
    const response = await request.get(`${API}/api/transactions`);
    expect(response.status()).toBe(401);
  });

  test('a protected endpoint rejects a forged token', async ({ request }) => {
    const response = await request.get(`${API}/api/transactions`, {
      headers: { Authorization: 'Bearer not.a.real.token' },
    });
    expect(response.status()).toBe(401);
  });
});