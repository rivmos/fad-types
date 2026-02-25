/**
 * Category status returned by the API (mirrors Prisma CategoryStatus).
 */
export type CategoryStatusDTO = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Category in API responses. Single source of truth for all clients.
 */
export interface CategoryResponseDTO {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  image: string | null;
  icon: string | null;
  isMixable: boolean;
  status: CategoryStatusDTO;
}
