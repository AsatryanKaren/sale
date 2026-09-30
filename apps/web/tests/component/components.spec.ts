import { expect, test } from '@playwright/test';

test('SaleStatus renders active discount', async ({ mount }) => {
  const component = await mount('sale/SaleStatus');
  await expect(component.getByText('Up to 50%')).toBeVisible();
  await expect(component.getByText('Seasonal sale')).toBeVisible();
});

test('DiscountBadge renders value', async ({ mount }) => {
  const component = await mount('sale/DiscountBadge', { value: 30 });
  await expect(component.getByText('Up to 30%')).toBeVisible();
});

test('AlertThresholdSelect updates value', async ({ mount, page }) => {
  const component = await mount('watch/AlertThresholdSelect', { value: 20 });
  await expect(component.getByTestId('threshold-value')).toHaveValue('20');
  await component.locator('.ant-select-selector').click();
  await expect(page.locator('.ant-select-dropdown')).toBeVisible();
  await page.locator('.ant-select-item-option-content', { hasText: '40%+' }).click();
  await expect(component.getByTestId('threshold-value')).toHaveValue('40');
});

test('FollowButton shows follow affordance', async ({ mount }) => {
  const component = await mount('follow/FollowButton', { isFollowing: false });
  await expect(component.getByRole('button', { name: 'Follow Zara' })).toBeVisible();
});

test('StoreCard shows follow controls and sale', async ({ mount }) => {
  const component = await mount('store/StoreCard', { following: false });
  await expect(component.getByRole('link', { name: 'Open Zara' })).toBeVisible();
  await expect(component.getByText('Up to 50%')).toBeVisible();
  await expect(component.getByRole('button', { name: 'Follow Zara' })).toBeVisible();
});

const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#000"/></svg>';

test('StoreAvatar shows the store logo when a source loads', async ({ mount, page }) => {
  await page.route('https://www.google.com/s2/favicons**', (route) =>
    route.fulfill({ status: 200, contentType: 'image/svg+xml', body: LOGO_SVG }),
  );
  const component = await mount('store/StoreAvatar');
  await expect(component.locator('img')).toHaveAttribute(
    'src',
    /google\.com\/s2\/favicons\?domain=zara\.com/,
  );
  await expect(component.getByText('ZA')).toHaveCount(0);
});

test('StoreAvatar falls back to a monogram when logos fail', async ({ mount, page }) => {
  await page.route('https://www.google.com/s2/favicons**', (route) => route.abort());
  await page.route('https://icons.duckduckgo.com/**', (route) => route.abort());
  const component = await mount('store/StoreAvatar');
  await expect(component.getByText('ZA')).toBeVisible();
});
