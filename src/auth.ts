import type { UserResponseDTO } from "./user.js";

/**
 * Payload returned on login and token refresh.
 */
export interface AuthSessionDTO {
  user: UserResponseDTO;
  accessToken: string;
  refreshToken: string;
}
