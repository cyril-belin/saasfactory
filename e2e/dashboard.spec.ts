import { test, expect } from '@playwright/test';

// Note: Testing actual dashboard access requires mocking Supabase Auth.
// For this starter kit, we'll verify that protected routes enforce authentication
// by checking the redirection behavior, which confirms the middleware is working.

test('dashboard/settings redirects to login', async ({ page }) => {
  await page.goto('/dashboard/settings');
  await expect(page).toHaveURL(/.*login/);
});

test('admin route redirects to login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/.*login/);
});
