/**
 * Standardized API Response Format
 * All API endpoints should return responses in this format
 */

export interface ApiMetadata {
  total?: number; // For paginated responses
  page?: number; // Current page
  limit?: number; // Items per page
  [key: string]: unknown;
}

export interface ApiErrorDetails {
  code: string; // Error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
  message: string; // Human-readable error message
  details?: Record<string, unknown>; // Additional error context
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetails;
  metadata?: ApiMetadata;
}

/**
 * Create a successful API response
 * @param data The response data
 * @param metadata Optional metadata (pagination, etc.)
 * @returns Formatted API response
 */
export function success<T>(data: T, metadata?: ApiMetadata): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(metadata && { metadata }),
  };
}

/**
 * Create an error API response
 * @param code Error code identifier
 * @param message Human-readable error message
 * @param details Optional additional error context
 * @returns Formatted error response
 */
export function error<T = unknown>(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}

/**
 * Parse pagination parameters from request
 * @param searchParams Query parameters
 * @returns Parsed pagination object
 */
export function parsePagination(
  searchParams: Record<string, string | string[] | undefined>,
  defaultLimit = 20,
  maxLimit = 100
) {
  let page = 1;
  let limit = defaultLimit;

  if (searchParams.page) {
    const parsed = parseInt(String(searchParams.page), 10);
    if (!isNaN(parsed) && parsed > 0) {
      page = parsed;
    }
  }

  if (searchParams.limit) {
    const parsed = parseInt(String(searchParams.limit), 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= maxLimit) {
      limit = parsed;
    }
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create pagination metadata
 * @param total Total number of items
 * @param page Current page
 * @param limit Items per page
 * @returns Pagination metadata object
 */
export function createPaginationMetadata(
  total: number,
  page: number,
  limit: number
): ApiMetadata {
  return {
    total,
    page,
    limit,
  };
}
