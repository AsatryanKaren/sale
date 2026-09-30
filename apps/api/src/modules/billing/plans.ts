import type { Plan, PlanId } from '@saleradar/contracts';

import { query } from '../../db';

type PlanRow = {
  id: PlanId;
  name: string;
  interval: Plan['interval'];
  price_amd: number;
  price_usd_cents: number;
};

function toPlan(row: PlanRow): Plan {
  return {
    id: row.id,
    name: row.name,
    interval: row.interval,
    prices: { AMD: row.price_amd, USD: row.price_usd_cents / 100 },
  };
}

/** Plans on sale, in display order. */
export async function listPlans(): Promise<Plan[]> {
  const rows = await query<PlanRow>(
    `SELECT id, name, interval, price_amd, price_usd_cents
     FROM plans WHERE is_active ORDER BY sort, id`,
  );
  return rows.map(toPlan);
}

/** Any plan by id, including retired ones, so existing subscribers keep renewing. */
export async function findPlan(id: PlanId): Promise<Plan | null> {
  const rows = await query<PlanRow>(
    'SELECT id, name, interval, price_amd, price_usd_cents FROM plans WHERE id = $1',
    [id],
  );
  const row = rows[0];
  return row ? toPlan(row) : null;
}

export async function findActivePlan(id: PlanId): Promise<Plan | null> {
  const rows = await query<PlanRow>(
    `SELECT id, name, interval, price_amd, price_usd_cents
     FROM plans WHERE id = $1 AND is_active`,
    [id],
  );
  const row = rows[0];
  return row ? toPlan(row) : null;
}
