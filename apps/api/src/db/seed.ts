import { seedPlans, seedSaleHistory, seedSales, seedStores } from './catalog';
import { query } from './client';

/** Inserts the seed plans and catalog. Existing rows are left alone. */
export async function seedCatalog(): Promise<void> {
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

  for (const sale of seedSales) {
    await query(
      `INSERT INTO sales (id, store_id, title, kind, status, min_discount_percent,
         max_discount_percent, started_at, ends_at, source_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        sale.id,
        sale.storeId,
        sale.title,
        sale.kind,
        sale.status,
        sale.minDiscountPercent,
        sale.maxDiscountPercent,
        sale.startedAt,
        sale.endsAt,
        sale.sourceUrl,
        sale.updatedAt,
      ],
    );
  }

  for (const event of seedSaleHistory) {
    await query(
      `INSERT INTO sale_history (id, store_id, sale_id, type, max_discount_percent, occurred_at, label)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [
        event.id,
        event.storeId,
        event.saleId,
        event.type,
        event.maxDiscountPercent,
        event.occurredAt,
        event.label,
      ],
    );
  }
}
