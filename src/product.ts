import type { MoneyDTO } from "./common.js";
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
 * Product variant in API responses.
 */
export interface ProductVariantDTO {
  id: string;
  sku: string | null;
  name: string;
  /** Exact decimal string (`"450.00"`). See {@link MoneyDTO}. */
  price: MoneyDTO;
  /** Grams. Not money -- a plain number is fine. */
  weight: number;
  stock: number;
  /**
   * GST rate for this pack, a percentage as an exact decimal string: `"5.00"`,
   * `"0.00"` (P1-11). On the variant because the pack decides the rate (loose vs
   * pre-packaged and labelled). Prices are tax-inclusive: this splits the price, it
   * never adds to it.
   */
  taxRatePercent: string;
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
  /** HSN code under the GST tariff (P1-11); `null` until the owner sets one. */
  hsnCode: string | null;
  variants?: ProductVariantDTO[];
}
