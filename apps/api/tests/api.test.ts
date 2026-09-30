import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';

import {
  followingListResponseSchema,
  planListResponseSchema,
  notificationListResponseSchema,
  sessionResponseSchema,
  storeListResponseSchema,
  storeSalesResponseSchema,
} from '@saleradar/contracts';

import { createApp } from '../src/app';
import { closeDb, openDb, query, seedCatalog } from '../src/db';
import { seedStores } from '../src/db/catalog';

const app = createApp({ demoTools: true });
const password = 'correct-horse-1';

/** A tiny cookie-keeping client, like a browser tab. */
function client() {
  let cookie = '';
  return async (path: string, init: { method?: string; body?: unknown } = {}) => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (cookie) headers.Cookie = cookie;
    if (init.body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await app.request(path, {
      method: init.method ?? 'GET',
      headers,
      ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
    });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0] ?? '';
    const text = await response.text();
    return { status: response.status, body: text ? (JSON.parse(text) as unknown) : null };
  };
}

async function signUp(email = 'ani@example.com') {
  const api = client();
  const response = await api('/api/auth/signup', {
    method: 'POST',
    body: { name: 'Ani', email, password },
  });
  assert.equal(response.status, 201);
  return api;
}

before(async () => {
  await openDb({});
  await seedCatalog();
});

beforeEach(async () => {
  await query('DELETE FROM users');
});

after(async () => {
  await closeDb();
});

describe('auth', () => {
  it('signs up into a 24-hour trial and keeps the session', async () => {
    const api = await signUp();
    const session = sessionResponseSchema.parse((await api('/api/auth/session')).body);
    assert.equal(session.user.email, 'ani@example.com');
    assert.equal(session.subscription.status, 'trialing');
    const hours = (Date.parse(session.subscription.trialEndsAt) - Date.now()) / 3_600_000;
    assert.ok(hours > 23.9 && hours <= 24);
  });

  it('rejects a duplicate email and a wrong password', async () => {
    await signUp();
    const again = await client()('/api/auth/signup', {
      method: 'POST',
      body: { name: 'Ani', email: 'ANI@example.com', password },
    });
    assert.equal(again.status, 409);

    const wrong = await client()('/api/auth/login', {
      method: 'POST',
      body: { email: 'ani@example.com', password: 'nope-nope-nope' },
    });
    assert.equal(wrong.status, 401);
    assert.deepEqual(wrong.body, { message: 'Email or password is incorrect.' });
  });

  it('logs in and out', async () => {
    await signUp();
    const api = client();
    assert.equal((await api('/api/auth/session')).status, 401);
    const login = await api('/api/auth/login', {
      method: 'POST',
      body: { email: 'ani@example.com', password },
    });
    assert.equal(login.status, 200);
    assert.equal((await api('/api/auth/session')).status, 200);
    assert.equal((await api('/api/auth/logout', { method: 'POST' })).status, 204);
    assert.equal((await api('/api/auth/session')).status, 401);
  });

  it('blocks cross-site writes', async () => {
    const response = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ani@example.com', password }),
    });
    assert.equal(response.status, 403);
  });
});

describe('plans', () => {
  it('lists plans with prices in both currencies, without signing in', async () => {
    const response = await client()('/api/plans');
    assert.equal(response.status, 200);
    const plans = planListResponseSchema.parse(response.body).items;
    assert.deepEqual(
      plans.map((plan) => [plan.id, plan.interval, plan.prices.AMD, plan.prices.USD]),
      [
        ['monthly', 'month', 1200, 3],
        ['annual', 'year', 11500, 29],
      ],
    );
  });

  it('charges the price in the database and hides retired plans', async () => {
    await query(`UPDATE plans SET price_amd = 990, price_usd_cents = 249 WHERE id = 'monthly'`);
    await query(`UPDATE plans SET is_active = false WHERE id = 'annual'`);
    try {
      const plans = planListResponseSchema.parse((await client()('/api/plans')).body).items;
      assert.deepEqual(
        plans.map((plan) => [plan.id, plan.prices.AMD, plan.prices.USD]),
        [['monthly', 990, 2.49]],
      );

      const api = await signUp();
      const retired = await api('/api/billing/checkout', {
        method: 'POST',
        body: { plan: 'annual' },
      });
      assert.equal(retired.status, 400);
    } finally {
      await query(`UPDATE plans SET price_amd = 1200, price_usd_cents = 300, is_active = true`);
      await query(`UPDATE plans SET price_amd = 11500, price_usd_cents = 2900 WHERE id = 'annual'`);
    }
  });
});

describe('access', () => {
  it('needs a session, then an active trial or plan', async () => {
    assert.equal((await client()('/api/stores')).status, 401);

    const api = await signUp();
    assert.equal((await api('/api/stores')).status, 200);

    await api('/api/dev/expire-trial', { method: 'POST' });
    const blocked = await api('/api/stores');
    assert.equal(blocked.status, 402);

    const paid = sessionResponseSchema.parse(
      (await api('/api/billing/checkout', { method: 'POST', body: { plan: 'annual' } })).body,
    );
    assert.equal(paid.subscription.status, 'active');
    assert.equal(paid.subscription.plan, 'annual');
    assert.equal((await api('/api/stores')).status, 200);

    const cancelled = sessionResponseSchema.parse(
      (await api('/api/billing/cancel', { method: 'POST' })).body,
    );
    assert.equal(cancelled.subscription.cancelAtPeriodEnd, true);
  });

  it('expires a trial once its end time passes', async () => {
    const api = await signUp();
    await query(`UPDATE subscriptions SET trial_ends_at = now() - interval '1 minute'`);
    assert.equal((await api('/api/stores')).status, 402);
    const session = sessionResponseSchema.parse((await api('/api/auth/session')).body);
    assert.equal(session.subscription.status, 'expired');
  });
});

describe('catalog', () => {
  it('lists, filters and sorts stores', async () => {
    const api = await signUp();
    const all = storeListResponseSchema.parse((await api('/api/stores')).body);
    assert.equal(all.items.length, seedStores.filter((store) => store.isActive).length);
    assert.equal(all.items[0]?.store.name, 'Adidas');

    const onSale = storeListResponseSchema.parse(
      (await api('/api/stores?hasActiveSale=true&sort=sale')).body,
    );
    assert.ok(onSale.items.every((item) => item.activeSale !== null));
    assert.equal(onSale.items[0]?.activeSale?.maxDiscountPercent, 50);

    const search = storeListResponseSchema.parse(
      (await api('/api/stores?search=pull&category=fashion')).body,
    );
    assert.deepEqual(
      search.items.map((item) => item.store.slug),
      ['pull-and-bear'],
    );
  });

  it('treats a sale past its end date as over, and a started upcoming sale as live', async () => {
    const api = await signUp();
    await query(
      `UPDATE sales SET ends_at = now() - interval '1 hour' WHERE id = 'sale_zara_summer'`,
    );
    await query(
      `UPDATE sales SET started_at = now() - interval '1 hour' WHERE id = 'sale_bershka_special'`,
    );
    try {
      const zara = storeSalesResponseSchema.parse((await api('/api/stores/zara/sales')).body);
      assert.equal(zara.activeSale, null);
      const bershka = storeSalesResponseSchema.parse((await api('/api/stores/bershka/sales')).body);
      assert.equal(bershka.activeSale?.status, 'active');
      const onSale = storeListResponseSchema.parse(
        (await api('/api/stores?hasActiveSale=true')).body,
      );
      assert.ok(!onSale.items.some((item) => item.store.slug === 'zara'));
    } finally {
      await seedCatalog();
    }
  });

  it('sorts by most recently changed sale', async () => {
    const api = await signUp();
    const recent = storeListResponseSchema.parse((await api('/api/stores?sort=recent')).body);
    const withSale = recent.items.filter((item) => item.activeSale !== null);
    const dates = withSale.map((item) => item.activeSale?.updatedAt ?? '');
    assert.deepEqual(dates, [...dates].sort().reverse());
    // Every store with a live sale comes before every store without one.
    assert.ok(recent.items.slice(0, withSale.length).every((item) => item.activeSale !== null));
  });

  it('can run without the sample sales', async () => {
    const api = await signUp();
    await seedCatalog({ sampleSales: false });
    try {
      const stores = storeListResponseSchema.parse((await api('/api/stores')).body);
      assert.ok(stores.items.length > 0);
      assert.ok(stores.items.every((item) => item.activeSale === null));
      const sales = storeSalesResponseSchema.parse((await api('/api/stores/zara/sales')).body);
      assert.equal(sales.history.length, 0);
    } finally {
      await seedCatalog();
    }
  });

  it('keeps the sample sales live relative to today', async () => {
    const api = await signUp();
    const sales = storeSalesResponseSchema.parse((await api('/api/stores/zara/sales')).body);
    const endsAt = Date.parse(sales.activeSale?.endsAt ?? '');
    assert.ok(endsAt > Date.now());
  });

  it('returns a store with its sale history', async () => {
    const api = await signUp();
    const store = await api('/api/stores/zara');
    assert.equal(store.status, 200);
    const sales = storeSalesResponseSchema.parse((await api('/api/stores/zara/sales')).body);
    assert.equal(sales.activeSale?.id, 'sale_zara_summer');
    assert.equal(sales.history.length, 3);
    assert.equal((await api('/api/stores/nope')).status, 404);
  });
});

describe('following and notifications', () => {
  it('follows a store per account and alerts when it is already on sale', async () => {
    const api = await signUp();
    const other = await signUp('bob@example.com');

    const created = await api('/api/following', {
      method: 'POST',
      body: { storeId: 'store_zara', minimumDiscountPercent: 30 },
    });
    assert.equal(created.status, 201);
    assert.equal(
      (await api('/api/following', { method: 'POST', body: { storeId: 'store_zara' } })).status,
      409,
    );

    const mine = followingListResponseSchema.parse((await api('/api/following')).body);
    const theirs = followingListResponseSchema.parse((await other('/api/following')).body);
    assert.equal(mine.items.length, 1);
    assert.equal(theirs.items.length, 0);

    const updated = await api('/api/following/store_zara', {
      method: 'PATCH',
      body: { minimumDiscountPercent: null, notifyOnNewSaleItems: true },
    });
    assert.equal(updated.status, 200);
    const watch = followingListResponseSchema.parse((await api('/api/following')).body).items[0];
    assert.equal(watch?.minimumDiscountPercent, null);
    assert.equal(watch.notifyOnNewSaleItems, true);
    assert.equal(watch.notifyOnSaleStart, true);

    const notifications = notificationListResponseSchema.parse(
      (await api('/api/notifications')).body,
    );
    assert.equal(notifications.items.length, 1);
    assert.equal(notifications.items[0]?.body, 'Up to 50% off');

    const id = notifications.items[0].id;
    assert.equal((await other(`/api/notifications/${id}/read`, { method: 'PATCH' })).status, 404);
    const read = await api(`/api/notifications/${id}/read`, { method: 'PATCH' });
    assert.equal(read.status, 200);

    assert.equal((await api('/api/following/store_zara', { method: 'DELETE' })).status, 204);
    assert.equal((await api('/api/following/store_zara', { method: 'DELETE' })).status, 404);
  });

  it('skips the alert when the sale is below the minimum', async () => {
    const api = await signUp();
    await api('/api/following', {
      method: 'POST',
      body: { storeId: 'store_mango', minimumDiscountPercent: 60 },
    });
    const notifications = notificationListResponseSchema.parse(
      (await api('/api/notifications')).body,
    );
    assert.equal(notifications.items.length, 0);
  });
});
