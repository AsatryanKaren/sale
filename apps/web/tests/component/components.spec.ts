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

test('AlertThresholdSelect updates value', async ({ mount }) => {
  const component = await mount('watch/AlertThresholdSelect', { value: 20 });
  await expect(component.getByTestId('threshold-value')).toHaveValue('20');
  await component.getByRole('combobox', { name: 'Alert threshold' }).click();
  await component.page().getByRole('option', { name: '40%+' }).click();
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
