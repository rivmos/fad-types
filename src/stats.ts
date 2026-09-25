import type { MoneyDTO } from "./common.js";

/** A pack running low, for the dashboard's restock list. */
export interface LowStockVariantDTO {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  sku: string | null;
  /** Units on hand, already net of what checkouts have taken. */
  stock: number;
}

/**
 * `GET /stats` -- what the owner opens the admin to see (P2-11). ADMIN only.
 *
 * "Today" is the shop's calendar day (`SHOP_TIME_ZONE`, Asia/Kolkata by default),
 * not the server's: a server in UTC would otherwise start the day at 05:30.
 */
export interface AdminStatsDTO {
  today: {
    /** Start of today in the shop's time zone, as an ISO instant. */
    from: string;
    /**
     * Today as the shop's calendar has it, `YYYY-MM-DD`. What to pass as `from`/`to`
     * to `GET /orders` for the same day -- those dates are read in the shop's time
     * zone too, so the list and this count agree.
     */
    date: string;
    /**
     * Orders placed today that are real sales: cash on delivery, or paid online.
     * An online order still waiting for its payment is not counted, and neither is
     * anything cancelled or returned.
     */
    orders: number;
    /** The same orders' totals, summed exactly. */
    revenue: MoneyDTO;
  };
  /** PENDING orders a packer can pack now: cash on delivery, or paid online. */
  awaitingPacking: number;
  lowStock: {
    /** A pack is low at or below this many units (`LOW_STOCK_THRESHOLD`). */
    threshold: number;
    /** How many packs are low; `variants` is at most the first 20, lowest first. */
    count: number;
    variants: LowStockVariantDTO[];
  };
}
