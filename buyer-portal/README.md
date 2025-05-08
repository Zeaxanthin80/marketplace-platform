# Buyer Portal

This service provides the buyer-facing APIs and logic for the multi-vendor marketplace. It includes product discovery, cart management, checkout, order history, and buyer profile management.

## Authentication

See [API_AUTH.md](./API_AUTH.md) for how to register, log in, and authenticate with JWTs for this API.

## Structure

- `/src/controllers` — Business logic for each route
- `/src/routes` — Express route definitions
- `/src/models` — Data models (in-memory or ORM)
- `/src/middleware` — Auth, validation, error handling
- `/src/services` — Reusable business logic
- `/src/utils` — Helper functions
- `/src/tests` — Integration/unit tests
- `/src/config` — App config and constants
- `/src/types` — Shared TypeScript types
- `app.ts` — Express app entry
- `server.ts` — Server bootstrap
