# Nomad Yoga API

NestJS backend foundation for Nomad Yoga. Phase 2 provides application configuration, Prisma connectivity, a versioned health endpoint, secure request defaults, and module boundaries. It does not provide business APIs, authentication, payments, or migrations.

## Stack

- NestJS 11, TypeScript, Express
- Prisma 6 with PostgreSQL
- Helmet, strict CORS, and class-validator-ready global validation

## Layout

- `src/config` — validated startup configuration
- `src/common` — cross-cutting API concerns such as exception filters
- `src/database` — Prisma service and module
- `src/health` — `GET /api/v1/health`
- `src/modules` — intentionally empty boundaries for future domain modules
- `prisma` — the approved Phase 1 schema and migration constraint notes

## Setup and development

1. Copy `.env.example` to `.env` and set a safe development PostgreSQL `DATABASE_URL`.
2. Run `npm install` from this directory.
3. Run `npm run prisma:generate`.
4. Run `npm run start:dev`.

The API listens on port `4000` by default with the URI prefix `/api/v1`. CORS accepts only `FRONTEND_URL` (by default `http://localhost:3000`).

## Prisma

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
```

Migrations are deliberately not run by application startup. Never run `prisma:migrate:dev` against production, and do not create the initial migration until a confirmed safe development database URL is available. See `prisma/DATABASE_CONSTRAINTS.md` for migration-time constraints that need hand-authored SQL.

## API convention

Successful endpoints use natural NestJS response bodies. Errors have the consistent shape `success`, `statusCode`, `message`, `path`, and `timestamp`. The health endpoint returns `503` with a non-sensitive `degraded` status when its database query fails.

## Not implemented yet

Auth, users, instructors, programs, practice, hostel, store, payments, blog, newsletter, contact, notifications, memberships, content, and admin modules are compile-safe skeletons only. Their business endpoints and services belong to later phases.
