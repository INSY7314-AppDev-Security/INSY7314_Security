const { test, expect } = require('@playwright/test');

test.describe('HustleHub+ frontend smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page shows the title and the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'HustleHub+' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email address')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('all navigation buttons are visible', async ({ page }) => {
    for (const label of ['Login', 'Register', 'Browse Gigs', 'Create Gig', 'Book a Gig']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('the password field masks its input', async ({ page }) => {
    await expect(page.getByPlaceholder('Password')).toHaveAttribute('type', 'password');
  });

  test('clicking Register leaves the login view', async ({ page }) => {
    await page.getByRole('button', { name: 'Register', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeHidden();
  });

  test('clicking Login returns to the login view', async ({ page }) => {
    await page.getByRole('button', { name: 'Register', exact: true }).click();
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
  });
});