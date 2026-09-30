import type { ZodType } from 'zod';
import { z } from 'zod';

import { appConfig } from '@/shared/config';

import { ApiError } from './errors';
import type { RequestOptions } from './types';

function buildUrl(path: string, searchParams?: RequestOptions['searchParams']): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${appConfig.apiBaseUrl}${normalizedPath}`, window.location.origin);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return `${url.pathname}${url.search}`;
}

function formatZodError(error: z.ZodError): unknown {
  return z.treeifyError(error);
}

export async function requestJson<T>(
  path: string,
  schema: ZodType<T>,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  const init: RequestInit = {
    method,
    headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(options.body);
  }

  if (options.signal) {
    init.signal = options.signal;
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, options.searchParams), init);
  } catch (error) {
    throw new ApiError({
      message: 'Unable to reach the SaleRadar API.',
      code: 'network_error',
      details: error,
    });
  }

  if (response.status === 204) {
    const parsed = schema.safeParse(undefined);
    if (!parsed.success) {
      throw new ApiError({
        message: 'Unexpected empty response from the API.',
        code: 'validation_error',
        status: response.status,
        details: formatZodError(parsed.error),
      });
    }

    return parsed.data;
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (error) {
    throw new ApiError({
      message: 'The API returned an invalid response.',
      code: 'validation_error',
      status: response.status,
      details: error,
    });
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'The request failed.';

    const code =
      response.status === 401
        ? 'unauthorized'
        : response.status === 402
          ? 'payment_required'
          : response.status === 404
            ? 'not_found'
            : response.status === 409
              ? 'conflict'
              : response.status >= 400 && response.status < 500
                ? 'validation_error'
                : 'unknown';

    throw new ApiError({
      message,
      code,
      status: response.status,
      details: payload,
    });
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiError({
      message: 'The API returned data in an unexpected shape.',
      code: 'validation_error',
      status: response.status,
      details: formatZodError(parsed.error),
    });
  }

  return parsed.data;
}
