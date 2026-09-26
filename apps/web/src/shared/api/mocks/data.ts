import type {
  Notification,
  Sale,
  SaleHistoryEvent,
  Store,
  Watch,
} from '@saleradar/contracts';

export const mockStores: Store[] = [
  {
    id: 'store_zara',
    slug: 'zara',
    name: 'Zara',
    websiteUrl: 'https://www.zara.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_mango',
    slug: 'mango',
    name: 'Mango',
    websiteUrl: 'https://shop.mango.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_massimo_dutti',
    slug: 'massimo-dutti',
    name: 'Massimo Dutti',
    websiteUrl: 'https://www.massimodutti.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_bershka',
    slug: 'bershka',
    name: 'Bershka',
    websiteUrl: 'https://www.bershka.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_pull_and_bear',
    slug: 'pull-and-bear',
    name: 'Pull&Bear',
    websiteUrl: 'https://www.pullandbear.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_stradivarius',
    slug: 'stradivarius',
    name: 'Stradivarius',
    websiteUrl: 'https://www.stradivarius.com',
    countryCode: 'AM',
    category: 'fashion',
    isActive: true,
  },
  {
    id: 'store_adidas',
    slug: 'adidas',
    name: 'Adidas',
    websiteUrl: 'https://www.adidas.com',
    countryCode: 'AM',
    category: 'sports',
    isActive: true,
  },
  {
    id: 'store_nike',
    slug: 'nike',
    name: 'Nike',
    websiteUrl: 'https://www.nike.com',
    countryCode: 'AM',
    category: 'sports',
    isActive: true,
  },
  {
    id: 'store_new_balance',
    slug: 'new-balance',
    name: 'New Balance',
    websiteUrl: 'https://www.newbalance.com',
    countryCode: 'AM',
    category: 'sports',
    isActive: true,
  },
  {
    id: 'store_ispace',
    slug: 'ispace',
    name: 'iSpace',
    websiteUrl: 'https://www.ispace.am',
    countryCode: 'AM',
    category: 'electronics',
    isActive: true,
  },
  {
    id: 'store_zigzag',
    slug: 'zigzag',
    name: 'Zigzag',
    websiteUrl: 'https://www.zigzag.am',
    countryCode: 'AM',
    category: 'electronics',
    isActive: true,
  },
  {
    id: 'store_vega',
    slug: 'vega',
    name: 'Vega',
    websiteUrl: 'https://www.vega.am',
    countryCode: 'AM',
    category: 'electronics',
    isActive: true,
  },
  {
    id: 'store_mobile_centre',
    slug: 'mobile-centre',
    name: 'Mobile Centre',
    websiteUrl: 'https://www.mobilecentre.am',
    countryCode: 'AM',
    category: 'electronics',
    isActive: true,
  },
  {
    id: 'store_loreal',
    slug: 'loreal',
    name: "L'Oréal Paris",
    websiteUrl: 'https://www.lorealparis.com',
    countryCode: 'AM',
    category: 'beauty',
    isActive: true,
  },
];

export const mockSales: Sale[] = [
  {
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
  },
  {
    id: 'sale_mango_seasonal',
    storeId: 'store_mango',
    title: 'Seasonal sale',
    kind: 'seasonal_sale',
    status: 'active',
    minDiscountPercent: 30,
    maxDiscountPercent: 40,
    startedAt: '2026-06-10T08:00:00.000Z',
    endsAt: '2026-06-28T20:00:00.000Z',
    sourceUrl: 'https://shop.mango.com/sale',
    updatedAt: '2026-06-10T08:00:00.000Z',
  },
  {
    id: 'sale_adidas_promo',
    storeId: 'store_adidas',
    title: 'Member promotion',
    kind: 'promotion',
    status: 'active',
    minDiscountPercent: 20,
    maxDiscountPercent: 30,
    startedAt: '2026-06-12T11:00:00.000Z',
    endsAt: null,
    sourceUrl: 'https://www.adidas.com/outlet',
    updatedAt: '2026-06-12T11:00:00.000Z',
  },
  {
    id: 'sale_ispace_promo',
    storeId: 'store_ispace',
    title: 'Accessories promotion',
    kind: 'promotion',
    status: 'active',
    minDiscountPercent: null,
    maxDiscountPercent: 25,
    startedAt: '2026-06-14T07:30:00.000Z',
    endsAt: '2026-06-25T18:00:00.000Z',
    sourceUrl: 'https://www.ispace.am/promotions',
    updatedAt: '2026-06-14T07:30:00.000Z',
  },
  {
    id: 'sale_nike_clearance',
    storeId: 'store_nike',
    title: 'Clearance picks',
    kind: 'clearance',
    status: 'active',
    minDiscountPercent: 40,
    maxDiscountPercent: 50,
    startedAt: '2026-06-01T10:00:00.000Z',
    endsAt: null,
    sourceUrl: 'https://www.nike.com/w/sale',
    updatedAt: '2026-06-08T12:00:00.000Z',
  },
  {
    id: 'sale_bershka_special',
    storeId: 'store_bershka',
    title: 'Weekend special',
    kind: 'special_offer',
    status: 'upcoming',
    minDiscountPercent: 20,
    maxDiscountPercent: 30,
    startedAt: '2026-06-27T09:00:00.000Z',
    endsAt: '2026-06-29T21:00:00.000Z',
    sourceUrl: null,
    updatedAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'sale_massimo_expired',
    storeId: 'store_massimo_dutti',
    title: 'Spring clearance',
    kind: 'clearance',
    status: 'expired',
    minDiscountPercent: 30,
    maxDiscountPercent: 50,
    startedAt: '2026-04-01T09:00:00.000Z',
    endsAt: '2026-05-15T21:00:00.000Z',
    sourceUrl: null,
    updatedAt: '2026-05-15T21:00:00.000Z',
  },
];

export const mockSaleHistory: SaleHistoryEvent[] = [
  {
    id: 'history_zara_1',
    storeId: 'store_zara',
    saleId: 'sale_zara_summer',
    type: 'sale_started',
    maxDiscountPercent: 20,
    occurredAt: '2026-06-03T09:00:00.000Z',
    label: 'Sale started',
  },
  {
    id: 'history_zara_2',
    storeId: 'store_zara',
    saleId: 'sale_zara_summer',
    type: 'discount_increased',
    maxDiscountPercent: 30,
    occurredAt: '2026-06-08T10:00:00.000Z',
    label: 'Discount increased',
  },
  {
    id: 'history_zara_3',
    storeId: 'store_zara',
    saleId: 'sale_zara_summer',
    type: 'discount_increased',
    maxDiscountPercent: 50,
    occurredAt: '2026-06-15T10:00:00.000Z',
    label: 'Discount increased',
  },
  {
    id: 'history_mango_1',
    storeId: 'store_mango',
    saleId: 'sale_mango_seasonal',
    type: 'sale_started',
    maxDiscountPercent: 40,
    occurredAt: '2026-06-10T08:00:00.000Z',
    label: 'Sale started',
  },
  {
    id: 'history_nike_1',
    storeId: 'store_nike',
    saleId: 'sale_nike_clearance',
    type: 'sale_started',
    maxDiscountPercent: 40,
    occurredAt: '2026-06-01T10:00:00.000Z',
    label: 'Sale started',
  },
  {
    id: 'history_nike_2',
    storeId: 'store_nike',
    saleId: 'sale_nike_clearance',
    type: 'discount_increased',
    maxDiscountPercent: 50,
    occurredAt: '2026-06-08T12:00:00.000Z',
    label: 'Discount increased',
  },
  {
    id: 'history_adidas_1',
    storeId: 'store_adidas',
    saleId: 'sale_adidas_promo',
    type: 'sale_started',
    maxDiscountPercent: 30,
    occurredAt: '2026-06-12T11:00:00.000Z',
    label: 'Sale started',
  },
  {
    id: 'history_ispace_1',
    storeId: 'store_ispace',
    saleId: 'sale_ispace_promo',
    type: 'sale_started',
    maxDiscountPercent: 25,
    occurredAt: '2026-06-14T07:30:00.000Z',
    label: 'Sale started',
  },
];

function createInitialWatches(): Watch[] {
  return [
    {
      id: 'watch_zara',
      storeId: 'store_zara',
      minimumDiscountPercent: 40,
      notifyOnSaleStart: true,
      notifyOnDiscountIncrease: true,
      notifyOnNewSaleItems: false,
      createdAt: '2026-05-20T12:00:00.000Z',
    },
    {
      id: 'watch_ispace',
      storeId: 'store_ispace',
      minimumDiscountPercent: null,
      notifyOnSaleStart: true,
      notifyOnDiscountIncrease: true,
      notifyOnNewSaleItems: false,
      createdAt: '2026-06-01T09:00:00.000Z',
    },
  ];
}

function createInitialNotifications(): Notification[] {
  return [
    {
      id: 'notif_1',
      storeId: 'store_zara',
      type: 'discount_increased',
      title: 'Zara sale increased',
      body: 'Yesterday: up to 30%\nToday: up to 50%',
      createdAt: '2026-06-15T10:05:00.000Z',
      readAt: null,
    },
    {
      id: 'notif_2',
      storeId: 'store_mango',
      type: 'sale_started',
      title: 'Mango seasonal sale started',
      body: 'Up to 40% off',
      createdAt: '2026-06-10T08:05:00.000Z',
      readAt: null,
    },
    {
      id: 'notif_3',
      storeId: 'store_ispace',
      type: 'sale_started',
      title: 'iSpace promotion started',
      body: 'Accessories promotion is live — up to 25% off',
      createdAt: '2026-06-14T07:35:00.000Z',
      readAt: '2026-06-14T12:00:00.000Z',
    },
    {
      id: 'notif_4',
      storeId: 'store_nike',
      type: 'discount_increased',
      title: 'Nike clearance improved',
      body: 'Clearance picks now reach up to 50%',
      createdAt: '2026-06-08T12:10:00.000Z',
      readAt: '2026-06-09T08:00:00.000Z',
    },
  ];
}

const MOCK_DB_STORAGE_KEY = 'saleradar.mock-db';

type MockDbState = {
  watches: Watch[];
  notifications: Notification[];
};

function readPersistedMockDb(): MockDbState | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }

  const raw = sessionStorage.getItem(MOCK_DB_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'watches' in parsed &&
      'notifications' in parsed &&
      Array.isArray(parsed.watches) &&
      Array.isArray(parsed.notifications)
    ) {
      return parsed as MockDbState;
    }
  } catch {
    return null;
  }

  return null;
}

function createMockDb(): MockDbState {
  return readPersistedMockDb() ?? {
    watches: createInitialWatches(),
    notifications: createInitialNotifications(),
  };
}

export const mockDb = createMockDb();

export function persistMockDb(): void {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  sessionStorage.setItem(
    MOCK_DB_STORAGE_KEY,
    JSON.stringify({
      watches: mockDb.watches,
      notifications: mockDb.notifications,
    }),
  );
}

export function resetMockState(): void {
  mockDb.watches = createInitialWatches();
  mockDb.notifications = createInitialNotifications();
  persistMockDb();
}

export function getActiveSaleForStore(storeId: string): Sale | null {
  return mockSales.find((sale) => sale.storeId === storeId && sale.status === 'active') ?? null;
}

export function getStoreBySlug(slug: string): Store | undefined {
  return mockStores.find((store) => store.slug === slug);
}

export function getStoreById(storeId: string): Store | undefined {
  return mockStores.find((store) => store.id === storeId);
}
