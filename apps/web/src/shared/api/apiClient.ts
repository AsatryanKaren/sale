import type { ZodType } from 'zod';

import { requestJson } from './request';
import type { RequestOptions } from './types';

export const apiClient = {
  get<T>(
    path: string,
    schema: ZodType<T>,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> {
    return requestJson(path, schema, { ...options, method: 'GET' });
  },
  post<T>(
    path: string,
    schema: ZodType<T>,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> {
    return requestJson(path, schema, { ...options, method: 'POST', body });
  },
  patch<T>(
    path: string,
    schema: ZodType<T>,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> {
    return requestJson(path, schema, { ...options, method: 'PATCH', body });
  },
  delete<T>(
    path: string,
    schema: ZodType<T>,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ): Promise<T> {
    return requestJson(path, schema, { ...options, method: 'DELETE' });
  },
};
