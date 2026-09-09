# Nomad Yoga

Nomad Yoga is organized as two independent applications:

- `frontend/` — Next.js web application, deployed through Vercel.
- `backend/` — NestJS API with Prisma and PostgreSQL.

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Database schema and Prisma commands are managed from `backend/prisma`. Do not create or apply migrations until a confirmed safe development PostgreSQL connection is available.

## Vercel

Set the Vercel project's **Settings → Build & Deployment → Root Directory** to `frontend`. This lets Vercel discover the Next.js package and build configuration after the repository reorganization.
