# 🎯 KRATOS 2026 Registration Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)

**A modern, fast, and scalable event registration platform built with Next.js and React 19**

[🌐 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Staff Operations](#-staff-operations)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎨 Overview

**KRATOS 2026** is a comprehensive event registration platform designed for seamless participant onboarding, payment verification, and staff management. It features a clean public registration flow with a powerful staff review and approval system.

Whether you're organizing a single event or managing multiple concurrent events with team registrations, KRATOS provides the tools to:

- ✅ Collect and verify participant registrations
- 💳 Manage payment proof uploads with validation
- 📋 Review and approve submissions with detailed notes
- 📊 Export registration data for reporting
- 🪑 Handle event-day desk check-ins
- 📱 Public status lookup for participants

---

## 🚀 Features

### For Participants

| Feature | Description |
|---------|-------------|
| **Event Browsing** | Discover available events with full details at `/events` |
| **Quick Registration** | Support for individual and team registrations |
| **Payment Upload** | Secure screenshot upload with file validation |
| **Status Tracking** | Check registration status with phone number or transaction ID |
| **Real-time Updates** | Instant approval/rejection notifications |

### For Staff

| Feature | Description |
|---------|-------------|
| **Review Dashboard** | Centralized panel to review all registrations at `/admin/registrations` |
| **Verification Workflow** | Approve, reject, or request clarifications with notes |
| **CSV Exports** | Download participant data, user info, and payment proofs |
| **Event-Day Operations** | Desk entry screen for on-site check-ins at `/admin/desk` |
| **Admin Settings** | Configure UPI, fees, deadlines, and system health checks |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 16.2, React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Database** | Drizzle ORM, Neon PostgreSQL |
| **Authentication** | NextAuth v5 (staff-only) |
| **File Uploads** | Cloudinary Upload Widget |
| **Notifications** | SMTP (email), Twilio (WhatsApp) — optional |
| **3D Graphics** | Three.js, React Three Fiber (hero animations) |
| **QR Codes** | QRCode.React, html5-qrcode |
| **Build Tools** | ESLint 9, TypeScript Compiler |

---

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ or yarn
- PostgreSQL database (Neon recommended)
- Cloudinary account for media uploads

### 60-Second Setup

```bash
# 1. Clone and install
git clone <repository-url>
cd kratos-platform
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your values (see next section)

# 3. Seed initial admin account
npm run seed:admin

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your platform running.

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

See the [Environment Variables](#-environment-variables) section below for complete details.

### Step 3: Initialize Database

```bash
# Create tables using Drizzle migrations
npm run db:migrate

# Seed the first admin account
npm run seed:admin
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | NextAuth secret for session encryption | `your-secure-random-string` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | `my-cloud-name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name | `my-upload-preset` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of deployed site | `https://kratos.example.com` |

### Bootstrap Variables (First-Time Setup)

| Variable | Description |
|----------|-------------|
| `SEED_ADMIN_EMAIL` | Initial staff admin email |
| `SEED_ADMIN_PASSWORD` | Initial staff admin password |

### Optional Variables

| Variable | Purpose |
|----------|---------|
| `ADMIN_SETUP_KEY` | Key required to create new staff accounts without existing admin |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Email notifications |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` | WhatsApp notifications |
| `REGISTRATION_KILL_SWITCH` | Set to `true` to pause all registrations |
| `REGISTRATION_KILL_SWITCH_MESSAGE` | Custom message shown when registrations are closed |

### Example `.env.local`

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/kratos

# NextAuth
AUTH_SECRET=$(openssl rand -base64 32)

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-cloud
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kratos-uploads

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Bootstrap
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=secure-initial-password
```

---

## 📁 Project Structure

```
kratos-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public pages (landing, events, register, status)
│   │   ├── admin/             # Staff dashboard and management
│   │   │   ├── registrations/ # Review and approve submissions
│   │   │   ├── desk/          # Event-day check-in
│   │   │   ├── settings/      # Configuration panel
│   │   │   └── verify/        # Individual registration review
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth configuration
│   │   │   ├── admin/         # Staff API endpoints
│   │   │   └── export/        # CSV export endpoints
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── forms/            # Form components
│   │   └── sections/         # Page sections
│   ├── lib/                  # Utilities and helpers
│   │   ├── db/              # Database client
│   │   ├── auth/            # Auth helpers
│   │   └── utils/           # Utility functions
│   ├── schema/              # Drizzle ORM database schema
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
│   ├── images/             # Hero and section images
│   └── branding/           # Logo and favicon
├── scripts/
│   └── seed-admin.ts       # Database seeding script
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🌐 API Routes

### Public Routes

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Landing page with hero section |
| `/events` | GET | Browse available events |
| `/register` | GET/POST | Event registration form |
| `/status` | GET | Check registration status by phone/transaction ID |

### Authentication Routes

| Path | Method | Description |
|------|--------|-------------|
| `/auth/adminlogin` | GET/POST | Staff login page |
| `/auth/callback/credentials` | POST | NextAuth callback |

### Admin Routes

| Path | Method | Description |
|------|--------|-------------|
| `/admin/dashboard` | GET | Admin home/statistics |
| `/admin/registrations` | GET | List all registrations |
| `/admin/verify/[id]` | GET/POST | Review and approve/reject |
| `/admin/desk` | GET/POST | Event-day check-in |
| `/admin/settings` | GET/POST | Configuration and health checks |

### API Endpoints

| Path | Method | Description |
|------|--------|-------------|
| `/api/admin/export?dataset=participants` | GET | Export participants CSV |
| `/api/admin/export?dataset=users` | GET | Export users CSV |
| `/api/admin/proofs` | GET | Export payment proofs CSV |
| `/api/auth/signin` | POST | Authenticate staff user |

---

## 📋 Pre-Deployment Checklist

Before deploying to production, complete these steps:

### 1. Environment Setup

- [ ] Set all required environment variables in your deployment platform (Vercel, Railway, Render, etc.)
- [ ] Verify PostgreSQL database is accessible and migrated
- [ ] Confirm Cloudinary cloud name and unsigned preset are configured

### 2. Initial Admin Account

- [ ] Run `npm run seed:admin` to create first admin
- [ ] Verify login at `/auth/adminlogin` works with seeded credentials

### 3. Configuration Review

- [ ] Open `/admin/settings` and verify:
  - [ ] Registration open/closed status
  - [ ] UPI ID for receiving payments
  - [ ] Fee per person (if applicable)
  - [ ] Registration deadline date/time
  - [ ] All deployment checks show ✅

### 4. Test End-to-End Flow

Execute the complete registration workflow:

```
1. Register as individual   → /register
2. Register as team        → /register (team option)
3. Upload payment proof    → Screenshot upload
4. Check status           → /status
5. Approve from admin     → /admin/registrations
6. Re-check status        → /status (should show approved)
```

### 5. Export Verification

- [ ] Download participants CSV at `/api/admin/export?dataset=participants`
- [ ] Download users CSV at `/api/admin/export?dataset=users`
- [ ] Download payment proofs at `/api/admin/proofs`
- [ ] Verify all data is correctly formatted

### 6. Staff Access

- [ ] Create additional staff accounts if needed via `/admin/settings`
- [ ] Share `/auth/adminlogin` link with review team
- [ ] Document approval SLA expectations

---

## 👥 Staff Operations

### Approving Registrations

1. Sign in at `/auth/adminlogin`
2. Navigate to `/admin/registrations`
3. Click a registration to view details:
   - Event information
   - Participant name, phone, email
   - Team members (if team registration)
   - Transaction ID
   - Payment screenshot
4. Add optional verification notes
5. Click **Approve Registration** or **Reject Registration**
6. Participant will see updated status at `/status`

### Event-Day Check-In

At the venue, use the desk entry screen:

1. Open `/admin/desk` on a staff device
2. Select the event
3. Enter participant name and phone number
4. Confirm check-in
5. Optional: Add extra team members if they arrive late

### Data Export

Download data while signed in as staff:

```bash
# All participants and team compositions
curl https://your-site.com/api/admin/export?dataset=participants

# User contact information
curl https://your-site.com/api/admin/export?dataset=users

# Payment proof submissions
curl https://your-site.com/api/admin/proofs
```

---

## 🚀 Deployment

### Supported Platforms

KRATOS 2026 is optimized for serverless deployment:

- **Vercel** (recommended for Next.js) — [Deploy Guide](DEPLOYMENT.md#vercel)
- **Railway** (with PostgreSQL) — [Deploy Guide](DEPLOYMENT.md#railway)
- **Render** — [Deploy Guide](DEPLOYMENT.md#render)
- **Self-hosted** (Docker-ready) — [Deploy Guide](DEPLOYMENT.md#self-hosted)

### Quick Deploy to Vercel

```bash
# 1. Push code to GitHub
git push origin main

# 2. Visit vercel.com and connect your repository
# 3. Add environment variables in Vercel dashboard
# 4. Deploy!
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed platform-specific instructions.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** | Complete staff operations manual |
| **[real_data.md](real_data.md)** | Pre-deployment data preparation checklist |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Platform-specific deployment guides *(TODO)* |

---

## 🔧 Available Scripts

```bash
# Development
npm run dev           # Start dev server at http://localhost:3000

# Production
npm run build         # Create optimized production build
npm start            # Start production server

# Database
npm run seed:admin   # Seed initial admin account

# Code Quality
npm run lint         # Run ESLint on all files
npm run lint:fix     # Auto-fix linting issues

# Database Migrations (with Drizzle)
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply pending migrations
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork and clone** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Make changes** and test thoroughly
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature description"
   ```
5. **Push and create a Pull Request**

### Code Standards

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Keep components focused and reusable
- Add comments for complex logic
- Test new features before submitting

### Commit Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting changes
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Build or dependency updates

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Credits & Maintainers

**KRATOS 2026** was built with:

- **Next.js** & **React 19** for the modern frontend
- **Drizzle ORM** & **PostgreSQL** for reliable data management
- **NextAuth** for secure authentication
- **Tailwind CSS** & **Framer Motion** for beautiful UI
- **Cloudinary** for media management

### Contributors

<!-- TODO: Update with actual contributor list -->
- Lead Developer: [@rahil-events]
- Design & UX: [Your Team]

---

## 🐛 Reporting Issues

Found a bug or have a feature request?

1. Check [existing issues](https://github.com/your-org/kratos-2026/issues)
2. [Create a new issue](https://github.com/your-org/kratos-2026/issues/new) with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable

---

## 📞 Support

For questions or support:

- 📧 Email: rahilhussain431601@gmail.com
- 📖 Documentation: Check [ADMIN_GUIDE.md](ADMIN_GUIDE.md)

---

<div align="center">

**Built with ❤️ for seamless event registration,**
**Built by Rahil & Team**

[⬆ Back to top](#-kratos-2026-registration-platform)

</div>
