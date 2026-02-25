/**
 * Address in API responses. Single source of truth for all clients.
 */
export interface AddressResponseDTO {
  id: string;
  label: string | null;
  addressLine1: string;
  addressLine2: string | null;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  contactName: string;
  contactPhone: string | null;
  isDefault: boolean;
}
