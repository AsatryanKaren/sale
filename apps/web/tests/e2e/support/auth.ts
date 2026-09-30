import { expect, type Page } from '@playwright/test';

export const TEST_PASSWORD = 'radar-pass-123';

/** Signs up a fresh account (each test gets its own browser storage). */
export async function signUp(page: Page, email = `shopper-${Date.now()}@example.com`) {
  await page.goto('/signup');
  await page.getByLabel('Name').fill('Test Shopper');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(TEST_PASSWORD);
  await page.getByRole('button', { name: 'Start free trial' }).click();
  await expect(page.getByRole('heading', { name: 'Discover' })).toBeVisible();
  return email;
}
