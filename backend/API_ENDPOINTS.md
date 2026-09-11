# Nomad Yoga API endpoint inventory

All routes use the `/api/v1` prefix. `USER` means a valid bearer JWT; `ADMIN` means a JWT whose role includes `ADMIN`. This inventory is derived from the current controller decorators.

## System and authentication

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/health` | PUBLIC | Safe service/database health |
| POST | `/auth/register`, `/auth/verify-email`, `/auth/resend-verification` | PUBLIC | Account registration and verification |
| POST | `/auth/login`, `/auth/refresh` | PUBLIC | Start or rotate an authenticated session |
| POST | `/auth/forgot-password`, `/auth/reset-password` | PUBLIC | Password recovery |
| POST | `/auth/logout`, `/auth/logout-all` | USER | Revoke one or all refresh sessions |
| GET/PATCH | `/users/me` | USER | Current user profile |

## Notifications, programs, and practice

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET/PATCH | `/users/me/notification-preferences` | USER | Notification preferences |
| GET | `/notifications`, `/notifications/unread-count` | USER | Current user's notifications |
| PATCH | `/notifications/read-all`, `/notifications/:id/read` | USER | Mark owned notifications read |
| GET | `/programs`, `/programs/:slug`, `/instructors`, `/instructors/:slug`, `/sessions`, `/sessions/:id` | PUBLIC | Published catalog and sessions |
| POST/GET | `/course-bookings` | USER | Create/list owned course bookings |
| GET/POST | `/course-bookings/:id`, `/course-bookings/:id/cancel` | USER | View/cancel owned course booking |
| GET/POST | `/users/me/practice-sessions` | USER | List/create practice sessions |
| PATCH/DELETE | `/users/me/practice-sessions/:id` | USER | Update/delete owned practice session |
| GET | `/users/me/progress` | USER | Current user's progress |
| GET/POST | `/admin/programs`, `/admin/instructors`, `/admin/sessions` | ADMIN | Manage catalog entities |
| GET/PATCH/DELETE | `/admin/programs/:id`, `/admin/instructors/:id`, `/admin/sessions/:id` | ADMIN | Manage one catalog entity |
| POST/DELETE | `/admin/programs/:id/instructors`, `/admin/programs/:id/instructors/:instructorId` | ADMIN | Assign/unassign instructors |
| GET | `/admin/course-bookings`, `/admin/course-bookings/:id` | ADMIN | Inspect course bookings |
| PATCH | `/admin/course-bookings/:id/status` | ADMIN | Change booking status |

## Hostel

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/hostels`, `/hostels/:id`, `/hostels/:id/room-types`, `/room-types/:id` | PUBLIC | Hostel catalogue |
| GET/POST | `/hostels/:id/availability`, `/hostels/:id/quote` | PUBLIC | Availability and quote |
| POST/GET | `/hostel-bookings` | USER | Create/list owned bookings |
| GET/POST | `/hostel-bookings/:id`, `/hostel-bookings/:id/cancel` | USER | View/cancel owned booking |
| `/admin/*` | ADMIN | Hostel, room type, room, bed, amenity, image, price-rule, and booking management controllers |

## Store and payments

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/store/categories`, `/store/products`, `/store/products/:slug` | PUBLIC | Product catalogue |
| GET/POST/PATCH/DELETE | `/cart`, `/cart/items`, `/cart/items/:id` | PUBLIC or optional JWT | Session or authenticated cart operations |
| POST | `/store/checkout/preview`, `/store/orders`, `/store/orders/:id/payment` | USER | Checkout preview, order, and payment creation |
| GET | `/store/orders`, `/store/orders/:id` | USER | Owned orders |
| POST | `/store/orders/:id/cancel` | USER | Cancel eligible owned order |
| `/admin/store/*` | ADMIN | Categories, products, variants, inventory, images, orders, and order status |
| POST/GET | `/payments`, `/payments/:id` | USER | Create/list/view owned payments |
| POST | `/webhooks/payments/cashfree`, `/webhooks/payments/stripe` | PUBLIC, signed | Provider webhooks only |
| `/admin/payments/*` | ADMIN | Payment inspection, refunds, and reconciliation |

## Content, blog, contact, newsletter, and administration

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/blog/posts`, `/blog/posts/:slug`, `/blog/categories`, `/blog/tags` | PUBLIC | Published blog content |
| `/admin/blog/*` | ADMIN | Posts, categories, and tags |
| GET | `/content/:slug`, `/settings/public` | PUBLIC | Published CMS page and public settings |
| `/admin/content/*` | ADMIN | Pages, sections, and ordering |
| POST | `/contact`, `/newsletter/subscribe`, `/newsletter/unsubscribe` | PUBLIC | Enquiries and newsletter changes |
| `/admin/contact-enquiries/*`, `/admin/newsletter/*` | ADMIN | Manage enquiries, subscribers, and campaigns |
| `/admin/email/status`, `/admin/email/test` | ADMIN | Email configuration status and test delivery |
| `/admin/users/*`, `/admin/dashboard/summary`, `/admin/audit-logs`, `/admin/media/*`, `/admin/settings/*` | ADMIN | User, audit, media metadata, and settings management |

`/admin/*` rows are grouped where several CRUD routes share the same controller and access policy; see the corresponding controller for the exact route parameter names.
