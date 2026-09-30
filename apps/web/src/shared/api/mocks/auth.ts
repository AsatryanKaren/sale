import {
  PLAN_CATALOG,
  TRIAL_DURATION_HOURS,
  checkoutRequestSchema,
  loginRequestSchema,
  signupRequestSchema,
  type PlanId,
  type SessionResponse,
  type Subscription,
  type User,
} from '@saleradar/contracts';
import { HttpResponse, http } from 'msw';

/**
 * Mock accounts and billing. Accounts live in localStorage so a signed-up demo
 * user survives reloads; the "session" is the signed-in account id, standing in
 * for the httpOnly cookie a real backend would set.
 */

const AUTH_STORAGE_KEY = 'saleradar.mock-auth';
const HOUR_MS = 60 * 60 * 1000;

type MockAccount = {
  user: User;
  password: string;
  subscription: Subscription;
};

type MockAuthState = {
  accounts: MockAccount[];
  sessionUserId: string | null;
};

function readAuthState(): MockAuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'accounts' in parsed &&
        Array.isArray(parsed.accounts)
      ) {
        return parsed as MockAuthState;
      }
    }
  } catch {
    // Fall through to an empty state.
  }

  return { accounts: [], sessionUserId: null };
}

const authState = readAuthState();

function persistAuthState(): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch {
    // Storage can be unavailable (private mode); the mock keeps working in memory.
  }
}

function addPeriod(from: Date, plan: PlanId): Date {
  const next = new Date(from);
  if (PLAN_CATALOG[plan].interval === 'year') {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

/** Applies time-based transitions (trial or period ending) before responding. */
function refreshSubscription(account: MockAccount, now = new Date()): Subscription {
  const { subscription } = account;

  if (subscription.status === 'trialing' && new Date(subscription.trialEndsAt) <= now) {
    subscription.status = 'expired';
  }

  if (
    subscription.status === 'active' &&
    subscription.currentPeriodEnd &&
    new Date(subscription.currentPeriodEnd) <= now
  ) {
    if (subscription.cancelAtPeriodEnd || !subscription.plan) {
      subscription.status = 'expired';
    } else {
      subscription.currentPeriodEnd = addPeriod(now, subscription.plan).toISOString();
    }
  }

  return subscription;
}

function getSessionAccount(): MockAccount | null {
  const account = authState.accounts.find((item) => item.user.id === authState.sessionUserId);
  return account ?? null;
}

function toSessionResponse(account: MockAccount): SessionResponse {
  return { user: account.user, subscription: refreshSubscription(account) };
}

function unauthorized() {
  return HttpResponse.json({ message: 'Please sign in to continue.' }, { status: 401 });
}

/**
 * Guard for catalog endpoints: a signed-in account with an active trial or
 * subscription. Returns the error response to send, or null when allowed.
 */
export function requireAccess() {
  const account = getSessionAccount();
  if (!account) {
    return unauthorized();
  }

  const subscription = refreshSubscription(account);
  if (subscription.status === 'expired') {
    persistAuthState();
    return HttpResponse.json(
      { message: 'Your free trial has ended. Choose a plan to keep using SaleRadar.' },
      { status: 402 },
    );
  }

  return null;
}

export const authHandlers = [
  http.get('/api/auth/session', () => {
    const account = getSessionAccount();
    if (!account) {
      return unauthorized();
    }

    const response = toSessionResponse(account);
    persistAuthState();
    return HttpResponse.json(response);
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const parsed = signupRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Please check the form and try again.' },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    if (authState.accounts.some((account) => account.user.email === email)) {
      return HttpResponse.json(
        { message: 'An account with this email already exists. Try signing in.' },
        { status: 409 },
      );
    }

    const now = new Date();
    const account: MockAccount = {
      user: {
        id: `user_${crypto.randomUUID()}`,
        email,
        name: parsed.data.name.trim(),
        createdAt: now.toISOString(),
      },
      password: parsed.data.password,
      subscription: {
        status: 'trialing',
        plan: null,
        trialEndsAt: new Date(now.getTime() + TRIAL_DURATION_HOURS * HOUR_MS).toISOString(),
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    };

    authState.accounts.push(account);
    authState.sessionUserId = account.user.id;
    persistAuthState();
    return HttpResponse.json(toSessionResponse(account), { status: 201 });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const parsed = loginRequestSchema.safeParse(await request.json());
    const credentials = parsed.success ? parsed.data : null;
    const email = credentials?.email.trim().toLowerCase();
    const account = authState.accounts.find((item) => item.user.email === email);

    if (!credentials || account?.password !== credentials.password) {
      return HttpResponse.json({ message: 'Email or password is incorrect.' }, { status: 401 });
    }

    authState.sessionUserId = account.user.id;
    const response = toSessionResponse(account);
    persistAuthState();
    return HttpResponse.json(response);
  }),

  http.post('/api/auth/logout', () => {
    authState.sessionUserId = null;
    persistAuthState();
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('/api/billing/checkout', async ({ request }) => {
    const account = getSessionAccount();
    if (!account) {
      return unauthorized();
    }

    const parsed = checkoutRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return HttpResponse.json({ message: 'Unknown plan.' }, { status: 400 });
    }

    const now = new Date();
    account.subscription = {
      ...account.subscription,
      status: 'active',
      plan: parsed.data.plan,
      currentPeriodEnd: addPeriod(now, parsed.data.plan).toISOString(),
      cancelAtPeriodEnd: false,
    };
    persistAuthState();
    return HttpResponse.json(toSessionResponse(account));
  }),

  http.post('/api/billing/cancel', () => {
    const account = getSessionAccount();
    if (!account) {
      return unauthorized();
    }

    if (account.subscription.status !== 'active') {
      return HttpResponse.json({ message: 'There is no active plan to cancel.' }, { status: 409 });
    }

    account.subscription.cancelAtPeriodEnd = true;
    persistAuthState();
    return HttpResponse.json(toSessionResponse(account));
  }),

  http.post('/api/billing/resume', () => {
    const account = getSessionAccount();
    if (!account) {
      return unauthorized();
    }

    account.subscription.cancelAtPeriodEnd = false;
    persistAuthState();
    return HttpResponse.json(toSessionResponse(account));
  }),

  /** Demo-only: end the trial now so the paywall can be tried without waiting a day. */
  http.post('/api/dev/expire-trial', () => {
    const account = getSessionAccount();
    if (!account) {
      return unauthorized();
    }

    account.subscription = {
      ...account.subscription,
      status: 'expired',
      plan: null,
      trialEndsAt: new Date().toISOString(),
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
    persistAuthState();
    return HttpResponse.json(toSessionResponse(account));
  }),
];
