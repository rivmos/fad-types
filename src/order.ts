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
  /**
   * The variant as it is *now*, for images and links.
   *
   * Everything a receipt or an order history should show comes from the frozen
   * fields above and below instead: this relation reflects later edits, which is
   * exactly what freezing the line was for.
   */
  variant: ProductVariantWithProductDTO;
  /** Product name as it read when the order was placed (frozen). */
  productName: string;
  /** Variant name as it read when the order was placed (frozen). */
  variantName: string;
  /** Variant SKU as it read when the order was placed (frozen). */
  sku: string | null;
  /** Variant weight in grams as it read when the order was placed (frozen). */
  weight: number;
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

/**
 * Who placed an order.
 *
 * The account, not the delivery contact: `address.contactName`/`contactPhone` say who
 * receives the parcel, which is often someone else. The shop needs this to find an
 * order when a customer rings (P2-07's search by phone) and to know who to call back.
 */
export interface OrderCustomerDTO {
  id: string;
  /** Unset until the customer fills in their profile. */
  name: string | null;
  /** E.164, e.g. `+919876543210` -- the number they sign in with. */
  phone: string;
}

export interface OrderResponseDTO {
  id: string;
  /**
   * Human-readable order number, e.g. `FAD-26-0042`. Allocated per calendar year.
   *
   * `id` is a uuid: a shop taking a phone call cannot read it aloud and a customer
   * cannot read it back. Clients were printing `id.slice(0, 8)`, which looks like an
   * identifier, is not unique, and cannot be typed into a search box. Show this
   * wherever an order is named to a human, and keep `id` for links and API calls.
   */
  orderNumber: string;
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
  /** The account that placed the order (P2-07). */
  customer: OrderCustomerDTO;
  address: AddressResponseDTO;
  items: OrderItemDTO[];
  createdAt: string;
}

/**
 * One step in an order's history, oldest first: `GET /orders/:id/history` (P2-13).
 *
 * What the customer's timeline draws. Only the status and when: the trail also
 * records who moved it and why, and a staff member's reason ("customer rang, wrong
 * address") is a note for the shop, not something to show the customer.
 */
export interface OrderStatusEventDTO {
  status: OrderStatusDTO;
  /** ISO instant. */
  at: string;
}
