import { expect, test } from '@playwright/test';

test.describe('SaleRadar e2e', () => {
  test('follow store from discover to following', async ({ page }) => {
    await page.goto('/discover');
    await expect(page.getByRole('heading', { name: 'Discover' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Search stores' }).fill('Zara');
    await expect(page.getByRole('link', { name: 'Open Zara' })).toBeVisible();

    const zaraCard = page.locator('article').filter({ hasText: 'Zara' }).first();
    const followButton = zaraCard.getByRole('button', { name: 'Follow Zara' });

    if (await followButton.isVisible()) {
      await followButton.click();
      await expect(zaraCard.getByRole('button', { name: 'Unfollow Zara' })).toBeVisible();
    }

    await page.getByRole('link', { name: 'Following' }).first().click();
    await expect(page.getByRole('heading', { name: 'Following' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open Zara' })).toBeVisible();
  });

  test('threshold persists after refresh', async ({ page }) => {
    await page.goto('/following');
    await expect(page.getByRole('heading', { name: 'Following' })).toBeVisible();

    const zaraCard = page.locator('article').filter({ hasText: 'Zara' }).first();
    await expect(zaraCard).toBeVisible();

    await zaraCard.getByRole('combobox', { name: /alert threshold/i }).click();
    await page.getByRole('option', { name: '40%+' }).click();
    await expect(zaraCard.getByText('40%+').first()).toBeVisible();

    await page.reload();
    await expect(page.locator('article').filter({ hasText: 'Zara' }).getByText('40%+').first()).toBeVisible();
  });

  test('discover fashion filter survives reload', async ({ page }) => {
    await page.goto('/discover');
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Fashion' }).click();

    await expect(page).toHaveURL(/category=fashion/);
    await page.reload();
    await expect(page).toHaveURL(/category=fashion/);
    await expect(page.getByRole('combobox', { name: 'Category' })).toContainText('Fashion');
  });

  test('mark notification as read', async ({ page }) => {
    await page.goto('/notifications');
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();

    const unreadCard = page.locator('article').filter({ hasText: 'Unread' }).first();
    await expect(unreadCard).toBeVisible();
    await unreadCard.getByRole('button', { name: 'Mark as read' }).click();
    await expect(unreadCard.getByText('Read')).toBeVisible();
  });
});
