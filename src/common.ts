/**
 * Standard API response envelope used across the backend (success, message, data).
 * Use on the frontend to type all API responses.
 */
export interface ApiResponseDTO<T> {
  success: boolean;
  message?: string;
  data: T | null;
}

/**
 * Pagination metadata returned with list endpoints (e.g. product list, search).
 */
export interface PaginationMetaDTO {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * API response for paginated list endpoints. Extends the standard envelope with pagination.
 */
export interface PaginatedApiResponseDTO<T> extends ApiResponseDTO<T[]> {
  pagination: PaginationMetaDTO;
}
