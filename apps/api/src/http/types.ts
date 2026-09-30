import type { User } from '@saleradar/contracts';

/** Hono context variables set by the auth middleware. */
export type AppEnv = {
  Variables: {
    user: User;
    sessionId: string;
  };
};
