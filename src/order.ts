import type { AddressResponseDTO } from "./address.js";
import type { MoneyDTO } from "./common.js";
/**
 * The product behind an order line *now*, for a link and a thumbnail (P2-20).
 *
 * Replaces the whole `ProductVariantWithProductDTO` -- product, category and all,
 * fetched for every line of every order -- that clients never read: every name and
 * price an order shows comes from the frozen fields on the line itself.
 */
export interface OrderItemProductDTO {
  id: string;
  slug: string | null;
  /** First image, or `null` if it has none (or none any more). */
  image: string | null;
}

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
  /** The product as it is *now*, for links and images only (P2-20). */
  product: OrderItemProductDTO;
  /** Product name as it read when the order was placed (frozen). */
  productName: string;
  /** Variant name as it read when the order was placed (frozen). */
  variantName: string;
  /** Variant SKU as it read when the order was placed (frozen). */
  sku: string | null;
  /** Variant weight in grams as it read when the order was placed (frozen). */
  weight: number;
  /** HSN code as it read when the order was placed (frozen, P1-11). */
  hsnCode: string | null;
  /**
   * GST rate on this line as it read when the order was placed (frozen), a percentage
   * string: `"5.00"`. The receipt printed a correct GST total beside a 0% rate
   * because the line did not carry this.
   */
  taxRatePercent: string;
}

/**
 * The tax invoice for an order (P1-12), issued at dispatch (P2-31). A summary: the
 * full document (supplier, buyer, place of supply) is on the server.
 */
export interface OrderInvoiceDTO {
  /** Gap-free per financial year, e.g. `FAD/2026-27/0001`. */
  invoiceNumber: string;
  issuedAt: string;
  /** Intra-state is split CGST + SGST; inter-state is IGST. Never both. */
  supplyType: "INTRA_STATE" | "INTER_STATE";
  taxableValue: MoneyDTO;
  cgst: MoneyDTO;
  sgst: MoneyDTO;
  igst: MoneyDTO;
  total: MoneyDTO;
}

/**
 * A status change the viewer may make to this order (P2-15b).
 *
 * Decided by the server, per caller, from the transition table, their role and the
 * order's money state -- so a client never keeps its own copy of the rules. The admin
 * did, and it drifted: it still refused to cancel a paid order after the server had
 * learned to refund one (P2-03/P2-04).
 */
export interface OrderMoveDTO {
  to: OrderStatusDTO;
  /**
   * Why the move would be refused for this order right now, or `null` if it would
   * go through. Shown on a disabled button instead of inviting a certain 409.
   */
  blockedReason: string | null;
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
  /**
   * When an unpaid online order's stock hold ends, as an ISO instant (P2-17).
   * `null` for anything else -- cash orders, paid orders, orders past PENDING.
   *
   * After this the server may release the order (stock back to the shelf) the next
   * time it sweeps; until then, paying still works. The app shows it as "Pay by …",
   * so the hold's length -- a server setting -- is never hardcoded in a client.
   */
  paymentDueBy: string | null;
  /** The account that placed the order (P2-07). */
  customer: OrderCustomerDTO;
  /** The tax invoice, once issued at dispatch; `null` before that (P1-12). */
  invoice: OrderInvoiceDTO | null;
  /**
   * The status changes *this viewer* may make, via `PATCH /orders/:id/status`
   * (P2-15b). Empty for a customer -- their one action is cancel, via its own route.
   */
  allowedMoves: OrderMoveDTO[];
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
