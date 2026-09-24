import type { AddressResponseDTO } from "./address.js";
import type { MoneyDTO } from "./common.js";
import type { ProductVariantWithProductDTO } from "./product.js";

/**
 * Single item in an order response (snapshot of variant + price at order time).
 */
export interface OrderItemDTO {
  id: string;
  quantity: number;
  /** Unit price at order time, as an exact decimal string (`"450.00"`). See {@link MoneyDTO}. */
  price: MoneyDTO;
  /**
   * `price * quantity`, computed by the backend in exact decimal arithmetic.
   *
   * Exists so clients never multiply money themselves. Both clients used to render
   * `item.price * item.quantity` in a float, and the admin's receipt template did not
   * multiply at all -- printing five bags at the price of one.
   */
  lineTotal: MoneyDTO;
  productVariantId: string;
  variant: ProductVariantWithProductDTO;
  productName: string;
}

/**
 * Order in API responses.
 */
// Mirrors the `OrderStatus` enum in the backend's prisma/schema.prisma,
// in the same order, so the two can be diffed mechanically.
export type OrderStatusDTO =
  | "PENDING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "PACKED";

export type PaymentMethodDTO = "COD" | "UPI";

export type PaymentStatusDTO = "PENDING" | "PAID" | "REFUNDED" | "FAILED";

export interface OrderResponseDTO {
  id: string;
  status: OrderStatusDTO;
  paymentMethod: PaymentMethodDTO;
  paymentStatus: PaymentStatusDTO;
  subtotal: MoneyDTO;
  discount: MoneyDTO;
  deliveryFee: MoneyDTO;
  tax: MoneyDTO;
  total: MoneyDTO;
  /**
   * `total` in integer paise, for handing to a payment gateway.
   *
   * Exists so that no client ever multiplies a price by 100 again. Two separate
   * `* 100` conversions used to live in `fad-backend` and `rfm-app`, in different
   * repositories, neither aware of the other -- and because both were
   * `number -> number`, changing one without the other would have charged every
   * customer 100x with nothing going red. The backend is now the only place that
   * converts, once, and clients pass this straight through.
   */
  totalPaise: number;
  gatewayOrderId: string | null;
  address: AddressResponseDTO;
  items: OrderItemDTO[];
  createdAt: string;
}
