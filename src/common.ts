/**
 * A money amount, as an exact decimal string with two places: `"450.00"`, `"0.00"`.
 *
 * **Why a string and not a number.** Money in this system is rupees and paise, and a
 * JavaScript number cannot hold those exactly -- 0.1 + 0.2 is famously not 0.3, and
 * the error compounds silently through a cart. Postgres stores `Decimal(10,2)` and
 * the backend does its arithmetic in `Prisma.Decimal`; this type carries that value
 * across the wire without ever passing through a float.
 *
 * It is deliberately a *string* rather than integer paise. Both are exact, but paise
 * would have left every field `number -> number`, so the change would have compiled
 * everywhere while silently meaning something 100x different. As a string, every
 * place that reads money fails to build until it is looked at. That was the point.
 *
 * **Do not do arithmetic on this.** Totals are computed by the backend. To display
 * it, format the string. To pay with it, use the paise field the order provides.
 */
export type MoneyDTO = string;

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
