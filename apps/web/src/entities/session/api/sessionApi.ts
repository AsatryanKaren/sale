import {
  checkoutRequestSchema,
  loginRequestSchema,
  sessionResponseSchema,
  signupRequestSchema,
  type CheckoutRequest,
  type LoginRequest,
  type SignupRequest,
} from '@saleradar/contracts';
import { z } from 'zod';

import { apiClient } from '@/shared/api';

export const sessionApi = {
  getSession() {
    return apiClient.get('/auth/session', sessionResponseSchema);
  },
  login(payload: LoginRequest) {
    return apiClient.post('/auth/login', sessionResponseSchema, loginRequestSchema.parse(payload));
  },
  signup(payload: SignupRequest) {
    return apiClient.post(
      '/auth/signup',
      sessionResponseSchema,
      signupRequestSchema.parse(payload),
    );
  },
  logout() {
    return apiClient.post('/auth/logout', z.undefined());
  },
  checkout(payload: CheckoutRequest) {
    return apiClient.post(
      '/billing/checkout',
      sessionResponseSchema,
      checkoutRequestSchema.parse(payload),
    );
  },
  cancel() {
    return apiClient.post('/billing/cancel', sessionResponseSchema);
  },
  resume() {
    return apiClient.post('/billing/resume', sessionResponseSchema);
  },
  expireTrialForDemo() {
    return apiClient.post('/dev/expire-trial', sessionResponseSchema);
  },
};
