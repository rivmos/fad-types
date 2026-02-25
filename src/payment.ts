import type { PaymentStatusDTO } from "./order.js";

/**
 * Response from payment verify order endpoint.
 */
export interface VerifyOrderResponseDTO {
  orderStatus: PaymentStatusDTO;
}
