# @fad/types

Shared API types and DTOs for FAD backend and clients (admin, mobile). Single source of truth for request/response shapes.

- **No Prisma** – only plain TypeScript types and Zod schemas.
- **Backend** maps Prisma models → these DTOs before sending JSON.
- **Clients** import these types to type API responses.

## Usage

**Backend (fad-backend)**  
Already depends on `@fad/types` via `file:../packages/types`. Use `UserResponseDTO`, `AuthSessionDTO`, etc., and map DB results with mappers in the backend (e.g. `toUserDTO` in user feature).

**Other clients (fad-admin, mobile)**  
Add the dependency:

- From repo root (if you use a monorepo): `pnpm add @fad/types@workspace:*`
- Or with file path: `pnpm add @fad/types@file:../packages/types`

Then import: `import type { UserResponseDTO, AuthSessionDTO } from "@fad/types"`.
