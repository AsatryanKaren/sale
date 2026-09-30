import { expect, test } from '@playwright/test';

import { signUp } from './support/auth';
import { followStore } from './support/following';

test.describe('SaleRadar e2e', () => {
  test.beforeEach(async ({ page }) => {
    await signUp(page);
  });

  test('follow store from discover to following', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.getByRole('heading', { name: 'Discover' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Search stores' }).fill('Mango');
    await expect(page.getByRole('link', { name: 'Open Mango' })).toBeVisible();

    const mangoCard = page.locator('article').filter({ hasText: 'Mango' }).first();
    await mangoCard.getByRole('button', { name: 'Follow Mango' }).click();
    await expect(mangoCard.getByRole('button', { name: 'Unfollow Mango' })).toBeVisible();

    await page.goto('/following');
    await expect(page.getByRole('heading', { name: 'Following' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open Mango' })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('threshold persists after refresh', async ({ page }) => {
    await followStore(page, 'Zara');
    await page.goto('/following');
    await expect(page.getByRole('heading', { name: 'Following' })).toBeVisible();

    const zaraCard = page.locator('article').filter({ hasText: 'Zara' }).first();
    await expect(zaraCard).toBeVisible({ timeout: 10_000 });

    await zaraCard.locator('.ant-select-selector').click();
    await expect(page.locator('.ant-select-dropdown')).toBeVisible();
    await page.locator('.ant-select-item-option-content', { hasText: '30%+' }).click();
    await expect(zaraCard.getByText('30%+', { exact: true }).first()).toBeVisible();

    await page.reload();
    await expect(
      page
        .locator('article')
        .filter({ hasText: 'Zara' })
        .getByText('30%+', { exact: true })
        .first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('discover fashion filter survives reload', async ({ page }) => {
    await page.goto('/discover');
    const categories = page.getByRole('group', { name: 'Category' });
    await categories.getByRole('button', { name: 'Fashion' }).click();

    await expect(page).toHaveURL(/category=fashion/);
    await page.reload();
    await expect(page).toHaveURL(/category=fashion/);
    await expect(categories.getByRole('button', { name: 'Fashion' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('link', { name: 'Open Adidas' })).toHaveCount(0);
  });

  test('mark notification as read', async ({ page }) => {
    // Following a store that is already on sale sends an alert right away.
    await followStore(page, 'Zara');
    await page.goto('/notifications');
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();

    const unread = page
      .getByRole('article', { name: /^Zara:/ })
      .filter({ has: page.getByRole('button', { name: 'Mark as read' }) })
      .first();
    await expect(unread).toBeVisible({ timeout: 10_000 });
    const name = (await unread.getAttribute('aria-label')) ?? '';
    const card = page.getByRole('article', { name, exact: true });
    await card.getByRole('button', { name: 'Mark as read' }).click();
    await expect(card.getByText('Read', { exact: true })).toBeVisible();
  });
});
