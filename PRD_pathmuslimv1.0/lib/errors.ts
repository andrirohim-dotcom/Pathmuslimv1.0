/**
 * Standardized API error envelope
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  timestamp: string;
  request_id?: string;
}

/**
 * Standard error codes used throughout the application
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Other
  BAD_REQUEST: 'BAD_REQUEST',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
} as const;

/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Create error response for common HTTP status codes
 */
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * HTTP status code mapping
 */
export function getStatusCode(errorCode: string): number {
  const statusMap: Record<string, number> = {
    [ErrorCodes.UNAUTHENTICATED]: 401,
    [ErrorCodes.UNAUTHORIZED]: 403,
    [ErrorCodes.INVALID_CREDENTIALS]: 401,
    [ErrorCodes.SESSION_EXPIRED]: 401,
    [ErrorCodes.VALIDATION_ERROR]: 400,
    [ErrorCodes.INVALID_INPUT]: 400,
    [ErrorCodes.MISSING_REQUIRED_FIELD]: 400,
    [ErrorCodes.NOT_FOUND]: 404,
    [ErrorCodes.CONFLICT]: 409,
    [ErrorCodes.ALREADY_EXISTS]: 409,
    [ErrorCodes.INTERNAL_SERVER_ERROR]: 500,
    [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
    [ErrorCodes.DATABASE_ERROR]: 500,
    [ErrorCodes.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCodes.BAD_REQUEST]: 400,
    [ErrorCodes.METHOD_NOT_ALLOWED]: 405,
  };

  return statusMap[errorCode] || 500;
}

/**
 * Factory functions for common error types
 */
export const createError = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new AppError(ErrorCodes.BAD_REQUEST, message, 400, details),

  unauthorized: (message = 'Unauthorized') =>
    new AppError(ErrorCodes.UNAUTHORIZED, message, 403),

  unauthenticated: (message = 'Authentication required') =>
    new AppError(ErrorCodes.UNAUTHENTICATED, message, 401),

  notFound: (resource: string) =>
    new AppError(ErrorCodes.NOT_FOUND, `${resource} not found`, 404),

  conflict: (message: string, details?: Record<string, unknown>) =>
    new AppError(ErrorCodes.CONFLICT, message, 409, details),

  validation: (message: string, details?: Record<string, unknown>) =>
    new AppError(ErrorCodes.VALIDATION_ERROR, message, 400, details),

  serverError: (message = 'Internal server error') =>
    new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, message, 500),

  serviceUnavailable: (message = 'Service unavailable') =>
    new AppError(ErrorCodes.SERVICE_UNAVAILABLE, message, 503),

  database: (message: string, details?: Record<string, unknown>) =>
    new AppError(ErrorCodes.DATABASE_ERROR, message, 500, details),

  rateLimitExceeded: () =>
    new AppError(ErrorCodes.RATE_LIMIT_EXCEEDED, 'Too many requests. Please try again later.', 429),

  methodNotAllowed: () =>
    new AppError(ErrorCodes.METHOD_NOT_ALLOWED, 'Method not allowed', 405),
};
