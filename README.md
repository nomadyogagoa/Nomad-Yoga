# Nomad Yoga — Frontend UI (Phases 1–6)

A combined frontend-only implementation for the Nomad Yoga platform. The brand name is intentionally centralized so it can be changed later without restructuring the project.

## Included

- Phase 1: Home landing page and premium design system
- Phase 2: About, Programs, Program Details, Schedule, Instructors, Instructor Details
- Phase 3: Pricing, Contact, Gallery, Journal/Blog, Login, Registration
- Phase 4: Student Dashboard UI
- Phase 5: Admin Dashboard UI, CMS content editor, Students, Programs, Payments, Notifications, Media Library, Settings and feature visibility
- Phase 6: Responsive behavior, accessibility focus states, reduced-motion support, UI consistency and polish

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Key routes

Public: `/`, `/about`, `/programs`, `/schedule`, `/instructors`, `/pricing`, `/gallery`, `/blog`, `/contact`

Auth: `/login`, `/register`

Student: `/dashboard`

Admin: `/admin`, `/admin/content`, `/admin/programs`, `/admin/students`, `/admin/payments`, `/admin/notifications`, `/admin/gallery`, `/admin/settings`

## Important

This is UI-only. Buttons/forms are visual flows and do not persist data yet. Backend, authentication, payment gateway, email, SMS and WhatsApp integrations are intentionally deferred to the backend phase.

Change branding and feature flags in `config/site.ts`.
