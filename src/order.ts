import type { AddressResponseDTO } from "./address.js";
import type { ProductVariantWithProductDTO } from "./product.js";

/**
 * Single item in an order response (snapshot of variant + price at order time).
 */
export interface OrderItemDTO {
  id: string;
  quantity: number;
  price: number;
  productVariantId: string;
  variant: ProductVariantWithProductDTO;
  productName: string;
}

/**
 * Order in API responses.
 */
export type OrderStatusDTO =
  | "PENDING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethodDTO = "COD" | "UPI";

export type PaymentStatusDTO = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export interface OrderResponseDTO {
  id: string;
  status: OrderStatusDTO;
  paymentMethod: PaymentMethodDTO;
  paymentStatus: PaymentStatusDTO;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  gatewayOrderId: string | null;
  address: AddressResponseDTO;
  items: OrderItemDTO[];
  createdAt: string;
}
