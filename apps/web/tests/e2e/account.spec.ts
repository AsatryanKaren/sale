import { expect, test } from '@playwright/test';

import { TEST_PASSWORD, signUp } from './support/auth';

test.describe('accounts and subscriptions', () => {
  test('visitors are sent to sign in and returned afterwards', async ({ page }) => {
    const email = await signUp(page);
    await page.goto('/settings');
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

    await page.goto('/notifications');
    await expect(page).toHaveURL(/\/login\?next=%2Fnotifications/);

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Email or password is incorrect.')).toBeVisible();

    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });

  test('new accounts start on a one-day trial', async ({ page }) => {
    await signUp(page);
    await expect(page.getByText('Free trial', { exact: true })).toBeVisible();
    await expect(page.getByText(/23h 5\dm left|24h 0m left/).first()).toBeVisible();
  });

  test('an ended trial hits the paywall until a plan is bought', async ({ page }) => {
    await signUp(page);
    await page.goto('/settings');
    await page.getByRole('button', { name: 'End trial' }).click();

    await page.goto('/discover');
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByText('Your free trial has ended.')).toBeVisible();

    const monthly = page.getByRole('article', { name: 'Monthly plan' });
    await expect(monthly.getByText('1,200 ֏')).toBeVisible();
    await expect(monthly.getByText('$3 / month')).toBeVisible();
    const annual = page.getByRole('article', { name: 'Annual plan' });
    await expect(annual.getByText('11,500 ֏')).toBeVisible();
    await expect(annual.getByText('$29 / year')).toBeVisible();

    await annual.getByRole('button', { name: 'Choose annual' }).click();
    await page.getByRole('button', { name: 'Pay 11,500 ֏' }).click();
    await expect(page.getByRole('heading', { name: 'Discover' })).toBeVisible();

    await page.goto('/settings');
    await expect(page.getByText(/Annual plan · 11,500 ֏ \(\$29\) \/ year/)).toBeVisible();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();
  });
});
