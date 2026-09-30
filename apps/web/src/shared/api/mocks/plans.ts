import { planListResponseSchema, type Plan, type PlanId } from '@saleradar/contracts';
import { HttpResponse, http } from 'msw';

/** Mirrors the API's seed plans (apps/api/src/db/catalog.ts). */
export const mockPlans: Plan[] = [
  { id: 'monthly', name: 'Monthly', interval: 'month', prices: { AMD: 1200, USD: 3 } },
  { id: 'annual', name: 'Annual', interval: 'year', prices: { AMD: 11500, USD: 29 } },
];

export function getMockPlan(id: PlanId): Plan | undefined {
  return mockPlans.find((plan) => plan.id === id);
}

export const planHandlers = [
  http.get('/api/plans', () =>
    HttpResponse.json(planListResponseSchema.parse({ items: mockPlans })),
  ),
];
