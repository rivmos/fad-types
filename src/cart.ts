import type { ProductVariantWithProductDTO } from "./product.js";

/**
 * Single item in a cart response.
 */
export interface CartItemDTO {
  id: string;
  quantity: number;
  productVariantId: string;
  variant: ProductVariantWithProductDTO;
  productName: string;
}

/**
 * Cart in API responses. Includes computed totals.
 */
export type CartStatusDTO = "ACTIVE" | "CHECKED_OUT" | "ABANDONED";

export interface CartResponseDTO {
  id: string;
  status: CartStatusDTO;
  items: CartItemDTO[];
  totalItems: number;
  subtotal: number;
}
