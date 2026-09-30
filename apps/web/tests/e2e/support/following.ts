import { expect, type Page } from '@playwright/test';

/** Follows a store from Discover; a no-op when the account already follows it. */
export async function followStore(page: Page, name: string) {
  await page.goto(`/discover?search=${encodeURIComponent(name)}`);
  const card = page.locator('article').filter({ hasText: name }).first();
  const follow = card.getByRole('button', { name: `Follow ${name}` });
  const unfollow = card.getByRole('button', { name: `Unfollow ${name}` });

  await expect(follow.or(unfollow)).toBeVisible({ timeout: 10_000 });
  if (await follow.isVisible()) {
    await follow.click();
  }
  await expect(unfollow).toBeVisible();
}
