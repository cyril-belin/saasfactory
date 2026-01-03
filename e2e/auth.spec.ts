import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SaaS Factory/);
});

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: /Se connecter/i })).toBeVisible();
});

test('redirects to login when accessing protected dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*login/);
});
