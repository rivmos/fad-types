/**
 * Role names returned by the API (mirrors Prisma RoleNames).
 */
export type RoleNameDTO = "ADMIN" | "CUSTOMER" | "DELIVERY" | "PACKER";

/**
 * API response shape for a user. Single source of truth for all clients (web, mobile).
 */
export type UserResponseDTO = {
  id: string;
  phone: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  points: number;
  roles: RoleNameDTO[];
};
