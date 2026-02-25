/**
 * Category summary embedded in product responses (no Prisma).
 */
export interface CategorySummaryDTO {
  id: string;
  name: string;
  image: string | null;
  icon: string | null;
}

/**
 * Product variant in API responses. Price/weight as numbers for clients.
 */
export interface ProductVariantDTO {
  id: string;
  sku: string | null;
  name: string;
  price: number;
  weight: number;
  stock: number;
}

export interface ProductVariantWithProductDTO extends ProductVariantDTO {
  product: ProductResponseDTO;
}
/**
 * Product in API responses. Variants optional (list vs detail/search).
 */
export type ProductStatusDTO =
  | "DRAFT"
  | "AVAILABLE"
  | "ARCHIVED"
  | "OUT_OF_STOCK";

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  slug: string | null;
  images: string[];
  videos: string[];
  status: ProductStatusDTO;
  category: CategorySummaryDTO;
  variants?: ProductVariantDTO[];
}
