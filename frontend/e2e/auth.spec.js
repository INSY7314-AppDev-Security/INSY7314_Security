const { test, expect } = require('@playwright/test');

const isAuthPost = (response) =>
  response.url().includes('/api/auth') && response.request().method() === 'POST';

async function submitLogin(page, email, password) {
  await page.goto('/');
  await page.getByPlaceholder('Email address').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  const [response] = await Promise.all([
    page.waitForResponse(isAuthPost),
    page.getByRole('button', { name: 'Log In', exact: true }).click(),
  ]);
  return response;
}

test.describe('Login through the real browser and real API', () => {
  test('a wrong password is rejected and no token is stored', async ({ page }) => {
    const response = await submitLogin(page, 'nobody@example.com', 'WrongPassword123!');

    // 400/401 = rejected by validation or credentials; 429 = rate limiter kicked in.
    expect([400, 401, 429]).toContain(response.status());

    // The user is still on the login screen.
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();

    // No JWT (they start with "eyJ") was saved in browser storage.
    const stored = await page.evaluate(() =>
      JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } })
    );
    expect(stored).not.toContain('eyJ');
  });

  test('valid credentials receive a successful API response', async ({ page }) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    test.skip(!email || !password, 'ADMIN_EMAIL and ADMIN_PASSWORD are not set');

    const response = await submitLogin(page, email, password);
    expect(response.status()).toBe(200);
  });
});