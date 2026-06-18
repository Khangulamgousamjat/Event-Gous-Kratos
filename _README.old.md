<p align="center">
  <img src="public/branding/college-logo.png" alt="KRATOS 2K26" width="180" />
</p>

<h1 align="center">KRATOS 2K26</h1>

<p align="center">
  <strong>High-performance event management platform for large-scale technical festivals.</strong>
</p>

<p align="center">
  <a href="https://kratos-events.vercel.app/">
    <img src="https://img.shields.io/badge/Live-kratos--events.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Architecture & Design Philosophy](#architecture--design-philosophy)
- [Tech Stack](#tech-stack)
- [System Design Highlights](#system-design-highlights)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)
- [Security Practices](#security-practices)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

KRATOS 2K26 is the official web platform for the **Annual Technical Festival** of Matoshri Pratishthan Group of Institutions (MPGI), School of Engineering, Nanded. It is engineered to handle the entire lifecycle of a multi-day, multi-track festival — from pre-event registration spikes down to on-the-ground check-ins and post-event result broadcasting.

The platform replaces ad-hoc spreadsheets and manual rosters with a **single, unified system** that serves three distinct user classes — participants, volunteers, and administrators — each with purpose-built dashboards and strictly scoped permissions.

Built on a serverless-first architecture with Next.js 15 Server Components and Neon Serverless PostgreSQL, KRATOS 2K26 is designed to sustain traffic bursts of hundreds of concurrent registrations without provisioning or scaling overhead.

---

## Live Demo

**Production:** [https://kratos-events.vercel.app/](https://kratos-events.vercel.app/)

---

## Key Features

### Registration Engine
- **Dual authentication** — Google OAuth for instant onboarding; credential-based fallback with bcrypt-hashed passwords.
- **Solo and team-based registration** with server-enforced min/max team size validation and collision-guarded deduplication.
- **Payment verification pipeline** — participants upload UPI transaction proof to Cloudinary; admins review and approve/reject from a dedicated queue.
- **Walk-in Fast-Track Desk** — a purpose-built admin interface for sub-10-second on-site registrations without requiring the participant to create an account.

### Participant Dashboard
- **Personalized schedule timeline** generated from the user's approved registrations against the 2-day x 5-slot event grid.
- **Gamified XP system** — participants earn experience points for registrations and attendance, progressing through levels and appearing on a public leaderboard.
- **Gallery module** — verified participants can upload and browse event photography, gated by admin-controlled gallery locks.

### Administrative Control Plane
- **Full CRUD event management** with modal-based editing, priority-based sort ordering, and real-time schedule grid assignments.
- **Registration verification dashboard** with inline Cloudinary proof review and batch approve/reject workflows.
- **CSV export** — one-click data extraction of participant rosters, team compositions, and payment records.
- **System-wide kill switch** — instantly disable all new registrations when venue capacity is reached.
- **Dynamic CMS** — upload hero images, about section assets, and live announcements directly to the database without code changes.
- **Results reveal system** — schedule result publication with embedded video URLs and timed reveal logic.

### Organizer Profiles
- **Public organizer directory** with filterable multi-department tags, glassmorphism cards, and modal profiles.
- **Admin-managed CRUD** — add, edit, and reorder organizer entries with linked social profiles (LinkedIn, Instagram).

### Squad Finder
- **Team recruitment board** — participants post short bios seeking teammates for specific events.

---

## Architecture & Design Philosophy

```
┌──────────────────────────────────────────────────────────────────┐
│                        Vercel Edge Network                       │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│   │  Static CDN  │    │ Edge Middleware│    │ Serverless Fns   │  │
│   │  (ISR Pages) │    │ (Auth Guard)  │    │ (Server Actions) │  │
│   └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘  │
└──────────┼───────────────────┼─────────────────────┼────────────┘
           │                   │                     │
           ▼                   ▼                     ▼
┌──────────────────┐  ┌───────────────┐  ┌───────────────────────┐
│   React 19 RSC   │  │   Auth.js v5  │  │   Neon Postgres       │
│   + Framer Motion│  │  (Session JWT)│  │  (Serverless, Pooled) │
└──────────────────┘  └───────────────┘  └───────────────────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                          │    Drizzle ORM      │
                                          │ (Type-safe Queries) │
                                          └─────────────────────┘
```

### Design Decisions

**Server Components by default.** Every route renders on the server unless client interactivity is explicitly required. This eliminates client-side data fetching waterfalls, reduces JavaScript bundle size, and ensures the first contentful paint includes real data — not loading skeletons.

**Server Actions over API routes.** Mutations (registrations, approvals, settings updates) are implemented as Server Actions collocated in `src/lib/actions.ts`. This provides end-to-end type safety from form submission to database write, eliminates the need for REST endpoint boilerplate, and enables progressive enhancement — forms work even before JavaScript hydrates.

**Serverless PostgreSQL.** Neon's HTTP-based connection protocol means there are no persistent connection pools to manage. Each serverless function invocation opens a lightweight connection, executes the query, and releases it. This model scales horizontally without connection exhaustion — critical during registration spikes.

**Edge middleware for auth gating.** The `src/proxy.ts` middleware runs at the edge layer before the request reaches the origin. It enforces role-based route protection, ensuring unauthenticated users never trigger a serverless function invocation for protected routes. This reduces cold start costs and keeps latency under control.

---

## Tech Stack

| Layer            | Technology                          | Purpose                                           |
|:-----------------|:------------------------------------|:--------------------------------------------------|
| **Framework**    | Next.js 15 (App Router)            | Server Components, Server Actions, file-based routing |
| **Language**     | TypeScript 5                        | End-to-end type safety across client and server   |
| **Runtime**      | React 19                            | React Compiler, concurrent features               |
| **Database**     | Neon (Serverless PostgreSQL)        | HTTP-based pooling, auto-scaling, branching       |
| **ORM**          | Drizzle ORM 0.45                    | Type-safe schema definition, zero-overhead queries |
| **Auth**         | Auth.js v5 (NextAuth)              | Google OAuth + Credentials, JWT sessions          |
| **Styling**      | Tailwind CSS v4                    | Utility-first, JIT compilation                    |
| **Animations**   | Framer Motion 12                    | Layout animations, gesture-driven interactions    |
| **Media**        | Cloudinary (via next-cloudinary)   | Upload, transform, and serve optimized images     |
| **Icons**        | Lucide React                        | Consistent, tree-shakeable icon set               |
| **Email**        | Nodemailer                          | Transactional email delivery                      |
| **Deployment**   | Vercel                              | Edge network, preview deployments, analytics      |

---

## System Design Highlights

### Latency Optimization
- **React Server Components** eliminate client-server data fetching round-trips. Pages render complete HTML with data on the first response.
- **React Compiler** (`babel-plugin-react-compiler`) auto-memoizes components, reducing unnecessary re-renders without manual `useMemo`/`useCallback` annotations.
- **Edge middleware** pre-authenticates requests before they reach the origin, avoiding cold-start penalties for unauthorized traffic.
- **Cloudinary CDN** offloads media delivery to a globally distributed network with automatic format negotiation (WebP/AVIF) and responsive sizing.

### Scalability Under Load
- **Neon's serverless driver** (`@neondatabase/serverless`) uses HTTP-over-WebSocket transport, enabling each serverless function instance to open a dedicated, short-lived connection. No connection pool exhaustion under concurrent load.
- **Database indexing strategy** — composite indexes on high-cardinality columns (`registrations.userId`, `registrations.eventId`, `registrations.status`) ensure consistent sub-millisecond query times even as the registration table scales.
- **Stateless session architecture** — JWT-based sessions with no server-side session store. Horizontal scaling requires zero session affinity.

### Data Integrity
- **Server-enforced validation** — team size constraints, duplicate registration checks, and payment verification logic are implemented exclusively in Server Actions. No client-side-only validation.
- **Referential integrity** — foreign key constraints across `users`, `events`, `registrations`, `teams`, and `teamMembers` tables enforce consistency at the database level.
- **Atomic transactions** — registration mutations that span multiple tables (creating team + team members + registration) are composed as atomic operations.

### Rate Limiting
- IP-based rate limiting (`src/lib/rate-limit.ts`) protects registration and authentication endpoints from abuse without external dependencies.

---

## Folder Structure

```
kratos-platform/
├── drizzle/                    # Generated migration files
├── drizzle.config.ts           # Drizzle Kit configuration
├── public/
│   └── branding/               # Static brand assets (logos, icons)
├── scripts/
│   └── seed-admin.ts           # Admin bootstrap script
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx            # Landing page (SSR)
│   │   ├── loading.tsx         # Global loading skeleton
│   │   ├── globals.css         # Tailwind directives + custom properties
│   │   ├── about/              # About page
│   │   ├── admin/
│   │   │   ├── dashboard/      # Admin control center
│   │   │   ├── desk/           # Fast-track walk-in registration
│   │   │   ├── events/         # Event CRUD management
│   │   │   ├── organizers/     # Organizer profile management
│   │   │   ├── registrations/  # Payment verification queue
│   │   │   ├── results/        # Results management
│   │   │   ├── schedule/       # Schedule grid editor
│   │   │   ├── settings/       # System-wide configuration
│   │   │   ├── users/          # User management
│   │   │   └── verify/         # Registration verification
│   │   ├── api/                # API routes (auth, webhooks, export)
│   │   ├── auth/               # Login, registration pages
│   │   ├── contact/            # Contact page
│   │   ├── dashboard/          # Participant dashboard
│   │   ├── events/             # Public event catalog
│   │   ├── leaderboard/        # XP leaderboard
│   │   ├── organizers/         # Public organizer directory
│   │   ├── privacy/            # Privacy policy
│   │   ├── profile/            # User profile management
│   │   ├── sponsorships/       # Sponsorship information
│   │   ├── squads/             # Team recruitment board
│   │   └── terms/              # Terms of service
│   ├── auth.ts                 # Auth.js configuration (providers, callbacks)
│   ├── proxy.ts                # Edge middleware (route protection)
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── layout/             # Navbar, Footer, shared layout
│   │   ├── marketing/          # Landing page sections
│   │   ├── organizers/         # Organizer cards and modals
│   │   ├── profile/            # Profile form components
│   │   ├── squads/             # Squad finder components
│   │   └── ui/                 # Shared primitives (buttons, modals, inputs)
│   ├── db/
│   │   ├── index.ts            # Neon client initialization
│   │   ├── schema.ts           # Drizzle schema (10 tables, enums, indexes)
│   │   ├── seed.ts             # Development data seeder
│   │   └── seed-admin.ts       # Admin provisioning script
│   ├── lib/
│   │   ├── actions.ts          # Server Actions (registrations, CRUD, etc.)
│   │   ├── authz.ts            # Role-based authorization helpers
│   │   ├── env.ts              # Environment variable validation
│   │   ├── notifications.ts    # Email notification logic
│   │   ├── rate-limit.ts       # IP-based rate limiter
│   │   ├── schedule.ts         # Schedule computation utilities
│   │   ├── utils.ts            # Shared utility functions
│   │   └── xp.ts               # XP/level calculation engine
│   └── types/
│       └── next-auth.d.ts      # Session type extensions
├── next.config.ts              # Next.js configuration (headers, images, compiler)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

| Requirement       | Version  |
|:------------------|:---------|
| Node.js           | 18+      |
| npm / pnpm        | Latest   |
| Neon PostgreSQL   | Free tier|
| Cloudinary        | Free tier|
| Google OAuth      | Configured in Google Cloud Console |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kratos-platform.git
cd kratos-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Populate `.env.local` with your credentials:

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@host.neon.tech/neondb?sslmode=require"

# Auth
AUTH_SECRET=""  # Generate with: npx auth secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"

# Application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin Bootstrap
SEED_ADMIN_EMAIL="admin@kratos.fest"
SEED_ADMIN_PASSWORD="your-secure-password"
```

### 4. Initialize the database

Push the Drizzle schema to your Neon instance and provision the root admin:

```bash
npx drizzle-kit push
npm run seed:admin
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### Role Matrix

| Role            | Scope                                                              |
|:----------------|:-------------------------------------------------------------------|
| **PARTICIPANT** | Register for events, view personal schedule, upload gallery photos, earn XP |
| **VOLUNTEER**   | Access Fast-Track Desk for walk-in registrations                  |
| **ADMIN**       | Full platform control — event CRUD, payment verification, data export, system settings |

### Admin Access

1. Navigate to `/auth/adminlogin`
2. Sign in with the credentials configured in `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
3. Access the admin dashboard at `/admin/dashboard`

### Volunteer Registration

Admins can register volunteer accounts via `/auth/adminregister`.

---

## Deployment

KRATOS 2K26 is optimized for deployment on **Vercel**.

### Production Checklist

```bash
# 1. Validate TypeScript compilation
npx tsc --noEmit

# 2. Run linter
npm run lint

# 3. Test production build locally
npm run build
npm run start
```

### Vercel Deployment

1. Import the repository in the [Vercel Dashboard](https://vercel.com/new).
2. Set all environment variables from `.env.example` in the Vercel project settings.
3. Ensure `NEXT_PUBLIC_SITE_URL` points to your production domain.
4. Push the database schema: `npx drizzle-kit push`.
5. Provision the admin: `npm run seed:admin`.
6. Deploy. Vercel handles build optimization, edge distribution, and SSL automatically.

---

## Performance Considerations

| Technique                    | Impact                                                    |
|:-----------------------------|:----------------------------------------------------------|
| React Server Components      | Zero client JS for data-fetching pages; smaller bundles   |
| React Compiler               | Automatic memoization; eliminates manual optimization     |
| Edge Middleware               | Auth checks run at CDN edge; sub-ms latency               |
| Neon Serverless Driver        | HTTP transport eliminates connection pool bottlenecks     |
| Cloudinary Transformations    | On-the-fly image resizing and format negotiation          |
| Database Indexing             | Composite indexes on registration lookup paths            |
| Security Headers              | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` set globally |

---

## Security Practices

- **Authentication** — Auth.js v5 with JWT sessions. Passwords hashed with `bcryptjs`. No plaintext credentials stored.
- **Authorization** — Role-based access control enforced at two layers: edge middleware (`src/proxy.ts`) and server-side authorization checks (`src/lib/authz.ts`).
- **Input validation** — Server Actions validate all inputs server-side. Client-side validation exists for UX only.
- **Rate limiting** — IP-based throttling on authentication and registration endpoints (`src/lib/rate-limit.ts`).
- **HTTP headers** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` applied globally via `next.config.ts`.
- **Environment isolation** — Sensitive keys validated at boot via `src/lib/env.ts`. Missing variables cause immediate startup failure.
- **Media security** — Cloudinary upload presets restrict accepted file types and maximum dimensions.

---

## Future Improvements

- **Webhook-driven payment verification** — integrate Razorpay/Cashfree webhooks for automated payment confirmation, eliminating manual admin review.
- **Incremental Static Regeneration** — apply ISR to the event catalog and leaderboard for sub-100ms TTFB without sacrificing data freshness.
- **Real-time notifications** — WebSocket-based push notifications for registration approvals, schedule changes, and live announcements.
- **Attendance analytics dashboard** — time-series visualizations of registration velocity, event popularity heatmaps, and check-in throughput metrics.
- **Multi-festival tenancy** — abstract the platform into a configurable system supporting multiple festivals from a single deployment.
- **Offline-first PWA** — service worker caching for participant schedules and QR passes, enabling reliable operation on congested campus networks.

---

## Contributors

Built by the engineering team at **MPGI School of Engineering, Nanded** for KRATOS 2K26.

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <sub>If this project helped you or you found it interesting, consider giving it a star.</sub>
</p>

<p align="center">
  <a href="https://github.com/your-username/kratos-platform/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/kratos-platform?style=social" alt="GitHub Stars" />
  </a>
</p>
