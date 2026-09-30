import {
  createWatchRequestSchema,
  followingListResponseSchema,
  notificationListResponseSchema,
  notificationResponseSchema,
  storeDetailResponseSchema,
  storeListResponseSchema,
  storeSalesResponseSchema,
  updateWatchRequestSchema,
  watchResponseSchema,
} from '@saleradar/contracts';
import { HttpResponse, delay, http } from 'msw';

import { appConfig } from '@/shared/config';

import { authHandlers, requireAccess } from './auth';

import {
  getActiveSaleForStore,
  getStoreById,
  getStoreBySlug,
  mockDb,
  mockSaleHistory,
  mockStores,
  persistMockDb,
} from './data';
async function mockLatency(): Promise<void> {
  const span = appConfig.mockApi.maxLatencyMs - appConfig.mockApi.minLatencyMs;
  const wait = appConfig.mockApi.minLatencyMs + Math.floor(Math.random() * (span + 1));
  await delay(wait);
}

function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === null || value === '') {
    return undefined;
  }

  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return undefined;
}

export const mockHandlers = [
  ...authHandlers,
  http.get('/api/stores', async ({ request }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim().toLowerCase() ?? '';
    const category = url.searchParams.get('category');
    const hasActiveSale = parseBooleanParam(url.searchParams.get('hasActiveSale'));
    const sort = url.searchParams.get('sort') ?? 'name';

    let items = [...mockStores];

    if (search.length > 0) {
      items = items.filter(
        (store) =>
          store.name.toLowerCase().includes(search) || store.slug.toLowerCase().includes(search),
      );
    }

    if (category && category !== 'all') {
      items = items.filter((store) => store.category === category);
    }

    if (hasActiveSale === true) {
      items = items.filter((store) => getActiveSaleForStore(store.id) !== null);
    }

    if (sort === 'sale') {
      items.sort((left, right) => {
        const leftSale = getActiveSaleForStore(left.id)?.maxDiscountPercent ?? -1;
        const rightSale = getActiveSaleForStore(right.id)?.maxDiscountPercent ?? -1;
        return rightSale - leftSale;
      });
    } else if (sort === 'recent') {
      items.sort((left, right) => right.name.localeCompare(left.name));
    } else {
      items.sort((left, right) => left.name.localeCompare(right.name));
    }

    return HttpResponse.json(
      storeListResponseSchema.parse({
        items: items.map((store) => ({
          store,
          activeSale: getActiveSaleForStore(store.id),
        })),
      }),
    );
  }),

  http.get('/api/stores/:slug', async ({ params }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const slug = String(params.slug);
    const store = getStoreBySlug(slug);

    if (!store) {
      return HttpResponse.json({ message: 'Store not found.' }, { status: 404 });
    }

    return HttpResponse.json(storeDetailResponseSchema.parse({ store }));
  }),

  http.get('/api/stores/:slug/sales', async ({ params }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const slug = String(params.slug);
    const store = getStoreBySlug(slug);

    if (!store) {
      return HttpResponse.json({ message: 'Store not found.' }, { status: 404 });
    }

    const activeSale = getActiveSaleForStore(store.id);
    const history = mockSaleHistory
      .filter((event) => event.storeId === store.id)
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

    return HttpResponse.json(
      storeSalesResponseSchema.parse({
        activeSale,
        history,
      }),
    );
  }),

  http.get('/api/following', async () => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }
    return HttpResponse.json(followingListResponseSchema.parse({ items: mockDb.watches }));
  }),

  http.post('/api/following', async ({ request }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const body = createWatchRequestSchema.parse(await request.json());
    const store = getStoreById(body.storeId);

    if (!store) {
      return HttpResponse.json({ message: 'Store not found.' }, { status: 404 });
    }

    const existing = mockDb.watches.find((watch) => watch.storeId === body.storeId);
    if (existing) {
      return HttpResponse.json({ message: 'Store is already followed.' }, { status: 409 });
    }

    const watch = {
      id: `watch_${store.slug}`,
      storeId: body.storeId,
      minimumDiscountPercent: body.minimumDiscountPercent ?? null,
      notifyOnSaleStart: body.notifyOnSaleStart ?? true,
      notifyOnDiscountIncrease: body.notifyOnDiscountIncrease ?? true,
      notifyOnNewSaleItems: body.notifyOnNewSaleItems ?? false,
      createdAt: new Date().toISOString(),
    };

    mockDb.watches = [...mockDb.watches, watch];

    // Mirrors the API: following a store that is already on sale alerts right away.
    const sale = getActiveSaleForStore(store.id);
    const discount = sale?.maxDiscountPercent ?? null;
    const meetsMinimum =
      watch.minimumDiscountPercent === null ||
      (discount !== null && discount >= watch.minimumDiscountPercent);
    if (sale && watch.notifyOnSaleStart && meetsMinimum) {
      mockDb.notifications = [
        ...mockDb.notifications,
        {
          id: `notif_${crypto.randomUUID()}`,
          storeId: store.id,
          type: 'sale_started',
          title: `${store.name} ${sale.title.toLowerCase()} is on`,
          body: discount === null ? 'Sale is live now' : `Up to ${discount}% off`,
          createdAt: new Date().toISOString(),
          readAt: null,
        },
      ];
    }
    persistMockDb();

    return HttpResponse.json(watchResponseSchema.parse({ watch }), { status: 201 });
  }),

  http.patch('/api/following/:storeId', async ({ params, request }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const storeId = String(params.storeId);
    const body = updateWatchRequestSchema.parse(await request.json());
    const index = mockDb.watches.findIndex((watch) => watch.storeId === storeId);

    if (index < 0) {
      return HttpResponse.json({ message: 'Watch not found.' }, { status: 404 });
    }

    const current = mockDb.watches[index];
    if (!current) {
      return HttpResponse.json({ message: 'Watch not found.' }, { status: 404 });
    }

    const updated = {
      ...current,
      ...(body.minimumDiscountPercent !== undefined
        ? { minimumDiscountPercent: body.minimumDiscountPercent }
        : {}),
      ...(body.notifyOnSaleStart !== undefined
        ? { notifyOnSaleStart: body.notifyOnSaleStart }
        : {}),
      ...(body.notifyOnDiscountIncrease !== undefined
        ? { notifyOnDiscountIncrease: body.notifyOnDiscountIncrease }
        : {}),
      ...(body.notifyOnNewSaleItems !== undefined
        ? { notifyOnNewSaleItems: body.notifyOnNewSaleItems }
        : {}),
    };

    mockDb.watches = mockDb.watches.map((watch, watchIndex) =>
      watchIndex === index ? updated : watch,
    );
    persistMockDb();

    return HttpResponse.json(watchResponseSchema.parse({ watch: updated }));
  }),

  http.delete('/api/following/:storeId', async ({ params }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const storeId = String(params.storeId);
    const exists = mockDb.watches.some((watch) => watch.storeId === storeId);

    if (!exists) {
      return HttpResponse.json({ message: 'Watch not found.' }, { status: 404 });
    }

    mockDb.watches = mockDb.watches.filter((watch) => watch.storeId !== storeId);
    persistMockDb();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/notifications', async () => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const items = [...mockDb.notifications].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );

    return HttpResponse.json(notificationListResponseSchema.parse({ items }));
  }),

  http.patch('/api/notifications/:notificationId/read', async ({ params }) => {
    await mockLatency();
    const denied = requireAccess();
    if (denied) {
      return denied;
    }

    const notificationId = String(params.notificationId);
    const index = mockDb.notifications.findIndex(
      (notification) => notification.id === notificationId,
    );

    if (index < 0) {
      return HttpResponse.json({ message: 'Notification not found.' }, { status: 404 });
    }

    const current = mockDb.notifications[index];
    if (!current) {
      return HttpResponse.json({ message: 'Notification not found.' }, { status: 404 });
    }

    const updated = {
      ...current,
      readAt: current.readAt ?? new Date().toISOString(),
    };

    mockDb.notifications = mockDb.notifications.map((notification, notificationIndex) =>
      notificationIndex === index ? updated : notification,
    );
    persistMockDb();

    return HttpResponse.json(notificationResponseSchema.parse({ notification: updated }));
  }),
];
