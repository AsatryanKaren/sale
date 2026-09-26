import { expect, test } from '@playwright/test';

test.describe('SaleRadar e2e', () => {
  test('follow store from discover to following', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.getByText('SaleRadar').first()).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Never miss a sale from the stores you actually care about.',
      }),
    ).toBeVisible();

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
      page.locator('article').filter({ hasText: 'Zara' }).getByText('30%+', { exact: true }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('discover fashion filter survives reload', async ({ page }) => {
    await page.goto('/discover');
    const categorySelect = page.locator('.ant-select').filter({ hasText: 'All categories' });
    await categorySelect.locator('.ant-select-selector').click();
    await expect(page.locator('.ant-select-dropdown')).toBeVisible();
    await page.locator('.ant-select-item-option-content', { hasText: 'Fashion' }).click();

    await expect(page).toHaveURL(/category=fashion/);
    await page.reload();
    await expect(page).toHaveURL(/category=fashion/);
    await expect(page.locator('.ant-select').filter({ hasText: 'Fashion' })).toBeVisible();
  });

  test('mark notification as read', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();

    const card = page.getByRole('article', { name: /Zara sale increased/i });
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Mark as read' }).click();
    await expect(card.getByText('Read', { exact: true })).toBeVisible();
  });
});
