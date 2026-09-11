# Nomad Yoga API

NestJS 11 + Prisma/PostgreSQL backend for Nomad Yoga. The API prefix is `/api/v1`; see [API_ENDPOINTS.md](API_ENDPOINTS.md) for the controller-derived route inventory.

## Local setup

1. Copy `.env.example` to `.env` and set a safe, local PostgreSQL `DATABASE_URL` plus a unique `JWT_ACCESS_SECRET` of at least 32 characters.
2. Install dependencies with `npm install`.
3. Run `npm run prisma:generate`, then `npm run start:dev`.

The API defaults to port `4000`. `FRONTEND_URL` is required; `FRONTEND_URLS` optionally permits a comma-separated list of additional trusted browser origins. CORS never uses a wildcard with credentials.

## Authentication and security

- Access tokens are short-lived bearer JWTs. Refresh tokens are opaque, SHA-256 hashed at rest, rotated on refresh, revocable, and set in a path-scoped `HttpOnly` cookie (`Secure` in production, `SameSite=Lax`).
- Global validation transforms input and rejects unknown fields. USER routes use the current JWT identity; ADMIN controllers require the `ADMIN` role.
- Helmet is enabled with defaults. Each request accepts or receives an `X-Request-Id`, which is returned and included in safe error responses.
- Error responses never expose Prisma/SQL/provider internals. Common Prisma conflicts, relation constraints, and missing records are mapped to safe application responses.

## Integrations and health

`GET /api/v1/health` returns only service name, environment, time, and database availability. It is a combined liveness/readiness-style check today; split readiness/liveness endpoints can be added when deployment infrastructure needs them.

Email and payment credentials are deliberately optional for compile/test work. Provider gateways reject unsupported live operations until credentials and an approved integration test environment exist. No provider credentials, tokens, passwords, or raw webhook payloads should be logged.

Swagger/OpenAPI is not installed in this repository, so `/api/docs` is intentionally unavailable. The route inventory is maintained in `API_ENDPOINTS.md`; Swagger can be added later once DTO annotation coverage is planned without altering API behavior.

## Database policy

Do **not** run migrations, `db push`, seed, or start a database-dependent server until a safe development database is explicitly approved. Current migration-time checks and required PostgreSQL concurrency tests are documented in [prisma/DATABASE_CONSTRAINTS.md](prisma/DATABASE_CONSTRAINTS.md).

Useful non-database validation commands:

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run typecheck
npm run build
npm test
```

## Production checklist

- Use a managed PostgreSQL database and execute reviewed migrations only.
- Set production-only JWT secrets, trusted HTTPS frontend origin(s), and provider credentials.
- Verify Cashfree/Stripe signatures and idempotency against provider sandboxes.
- Verify Resend/SMTP delivery and sender-domain configuration.
- Run the PostgreSQL integration and concurrency cases listed in `DATABASE_CONSTRAINTS.md`.
- Use a shared rate-limit store and a durable outbox/queue before multi-instance production delivery.
- The frontend must sanitize authored CMS/blog rich HTML before rendering; the backend stores it as content and never executes it.
