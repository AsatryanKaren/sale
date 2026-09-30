import type { ComponentType } from 'react';
import { useState } from 'react';
import type { Sale, Store } from '@saleradar/contracts';

import { DiscountBadge, SaleStatus } from '@/entities/sale';
import { StoreAvatar } from '@/entities/store';
import { StoreCard } from '@/widgets/store-card';
import { AlertThresholdSelect, type AlertThresholdValue } from '@/entities/watch';
import { FollowButton } from '@/features/follow-store';

const demoStore = {
  id: 'store_zara',
  slug: 'zara',
  name: 'Zara',
  websiteUrl: 'https://www.zara.com',
  countryCode: 'AM',
  category: 'fashion',
  isActive: true,
} as const satisfies Store;

const demoSale = {
  id: 'sale_zara_summer',
  storeId: 'store_zara',
  title: 'Mid-season sale',
  kind: 'seasonal_sale',
  status: 'active',
  minDiscountPercent: 20,
  maxDiscountPercent: 50,
  startedAt: '2026-06-03T09:00:00.000Z',
  endsAt: '2026-06-30T21:00:00.000Z',
  sourceUrl: 'https://www.zara.com/sale',
  updatedAt: '2026-06-15T10:00:00.000Z',
} as const satisfies Sale;

function SaleStatusStory() {
  return <SaleStatus sale={demoSale} />;
}

function DiscountBadgeStory(props: { value?: number | null }) {
  return <DiscountBadge value={props.value ?? 40} />;
}

function AlertThresholdSelectStory(props: { value?: number | null }) {
  const [value, setValue] = useState<AlertThresholdValue>(
    (props.value ?? 30) as AlertThresholdValue,
  );

  return (
    <div>
      <AlertThresholdSelect value={value} onChange={setValue} />
      <input
        type="hidden"
        data-testid="threshold-value"
        value={value === null ? 'any' : String(value)}
        readOnly
      />
    </div>
  );
}

function FollowButtonStory(props: { isFollowing?: boolean }) {
  return (
    <FollowButton
      storeId={demoStore.id}
      storeName={demoStore.name}
      isFollowing={Boolean(props.isFollowing)}
    />
  );
}

function StoreCardStory(props: { following?: boolean }) {
  return (
    <StoreCard
      store={demoStore}
      sale={demoSale}
      watch={
        props.following
          ? {
              id: 'watch_zara',
              storeId: demoStore.id,
              minimumDiscountPercent: 40,
              notifyOnSaleStart: true,
              notifyOnDiscountIncrease: true,
              notifyOnNewSaleItems: false,
              createdAt: '2026-05-20T12:00:00.000Z',
            }
          : null
      }
    />
  );
}

function StoreAvatarStory() {
  return <StoreAvatar store={demoStore} />;
}

export const stories: Record<string, ComponentType<Record<string, unknown>>> = {
  'sale/SaleStatus': SaleStatusStory as ComponentType<Record<string, unknown>>,
  'sale/DiscountBadge': DiscountBadgeStory as ComponentType<Record<string, unknown>>,
  'watch/AlertThresholdSelect': AlertThresholdSelectStory as ComponentType<Record<string, unknown>>,
  'follow/FollowButton': FollowButtonStory as ComponentType<Record<string, unknown>>,
  'store/StoreCard': StoreCardStory as ComponentType<Record<string, unknown>>,
  'store/StoreAvatar': StoreAvatarStory as ComponentType<Record<string, unknown>>,
};
