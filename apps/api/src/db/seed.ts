import { seedPlans, seedSaleHistory, seedSales, seedStores } from './catalog';
import { query } from './client';

/** The day the sample sales were written for; their dates are moved so it becomes today. */
const SAMPLE_DATA_TODAY = Date.parse('2026-06-15T12:00:00.000Z');

function shiftToToday(iso: string, now: number): string;
function shiftToToday(iso: string | null, now: number): string | null;
function shiftToToday(iso: string | null, now: number): string | null {
  return iso === null ? null : new Date(Date.parse(iso) + now - SAMPLE_DATA_TODAY).toISOString();
}

/**
 * Inserts the seed plans and catalog. Plans and stores are left alone once
 * they exist. The sample sales and their history are rewritten on every boot
 * with dates moved relative to today, so the demo keeps live sales instead of
 * ones that ended months ago. Remove them once a sale checker writes real data.
 */
export async function seedCatalog(
  options: { sampleSales?: boolean; now?: number } = {},
): Promise<void> {
  const { sampleSales = true, now = Date.now() } = options;

  for (const [index, plan] of seedPlans.entries()) {
    await query(
      `INSERT INTO plans (id, name, interval, price_amd, price_usd_cents, sort)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [
        plan.id,
        plan.name,
        plan.interval,
        plan.prices.AMD,
        Math.round(plan.prices.USD * 100),
        index,
      ],
    );
  }

  for (const store of seedStores) {
    await query(
      `INSERT INTO stores (id, slug, name, website_url, logo_url, country_code, category, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [
        store.id,
        store.slug,
        store.name,
        store.websiteUrl,
        store.logoUrl ?? null,
        store.countryCode,
        store.category,
        store.isActive,
      ],
    );
  }

  if (!sampleSales) {
    // A database that once held the samples (for example a local one reused
    // in production) drops them; history rows go with their sale.
    await query('DELETE FROM sales WHERE id = ANY($1)', [seedSales.map((sale) => sale.id)]);
    return;
  }

  for (const sale of seedSales) {
    await query(
      `INSERT INTO sales (id, store_id, title, kind, status, min_discount_percent,
         max_discount_percent, started_at, ends_at, source_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         started_at = EXCLUDED.started_at,
         ends_at = EXCLUDED.ends_at,
         updated_at = EXCLUDED.updated_at`,
      [
        sale.id,
        sale.storeId,
        sale.title,
        sale.kind,
        sale.status,
        sale.minDiscountPercent,
        sale.maxDiscountPercent,
        shiftToToday(sale.startedAt, now),
        shiftToToday(sale.endsAt, now),
        sale.sourceUrl,
        shiftToToday(sale.updatedAt, now),
      ],
    );
  }

  for (const event of seedSaleHistory) {
    await query(
      `INSERT INTO sale_history (id, store_id, sale_id, type, max_discount_percent, occurred_at, label)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET occurred_at = EXCLUDED.occurred_at`,
      [
        event.id,
        event.storeId,
        event.saleId,
        event.type,
        event.maxDiscountPercent,
        shiftToToday(event.occurredAt, now),
        event.label,
      ],
    );
  }
}
