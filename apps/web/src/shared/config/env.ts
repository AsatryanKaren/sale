import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api'),
  VITE_USE_MOCK_API: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
});

export type AppEnv = {
  apiBaseUrl: string;
  useMockApi: boolean;
};

export function readAppEnv(
  source: Record<string, string | undefined> = import.meta.env,
): AppEnv {
  const parsed = envSchema.safeParse({
    VITE_API_BASE_URL: source.VITE_API_BASE_URL,
    VITE_USE_MOCK_API: source.VITE_USE_MOCK_API,
  });

  if (!parsed.success) {
    throw new Error('Invalid application environment configuration.');
  }

  return {
    apiBaseUrl: parsed.data.VITE_API_BASE_URL.replace(/\/$/, ''),
    useMockApi: parsed.data.VITE_USE_MOCK_API,
  };
}
