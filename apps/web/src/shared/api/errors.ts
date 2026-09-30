export type ApiErrorCode =
  | 'network_error'
  | 'unauthorized'
  | 'payment_required'
  | 'validation_error'
  | 'not_found'
  | 'conflict'
  | 'unknown';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | undefined;
  readonly details: unknown;

  constructor(options: {
    message: string;
    code: ApiErrorCode;
    status?: number;
    details?: unknown;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

export function toUserFacingApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'network_error':
        return 'Network issue. Check your connection and try again.';
      case 'unauthorized':
      case 'payment_required':
        return error.message;
      case 'not_found':
        return 'We could not find what you were looking for.';
      case 'validation_error':
        return 'Some of the data looked invalid. Please refresh and try again.';
      case 'conflict':
        return 'That action could not be completed. Please refresh and try again.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}

export function isApiErrorWithCode(error: unknown, code: ApiErrorCode): error is ApiError {
  return error instanceof ApiError && error.code === code;
}
