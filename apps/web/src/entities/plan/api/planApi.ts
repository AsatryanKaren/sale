import { planListResponseSchema } from '@saleradar/contracts';

import { apiClient } from '@/shared/api';

export const planApi = {
  getPlans() {
    return apiClient.get('/plans', planListResponseSchema);
  },
};
