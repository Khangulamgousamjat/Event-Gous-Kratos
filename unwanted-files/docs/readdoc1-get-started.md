# 🛠️ ReadDoc 1: Project Setup & Run

Welcome! This guide will help you get the **KRATOS 2026** platform running on your local machine in less than 5 minutes.

## 1. Prerequisites
- **Node.js** (v20 or higher) installed.
- Access to the **Neon Database** and **Cloudinary** credentials (check with the team).

## 2. Getting the Code
If you haven't already, clone the repository:
```bash
git clone <repository-url>
cd kratos-platform
```

## 3. Configuration (Critical)
1. In the root folder, create a file named `.env.local`.
2. Copy the contents of `.env.example` into it and fill in the values.
   - `DATABASE_URL`: Your Neon Postgres connection string.
   - `AUTH_SECRET`: Any random string (generate one with `openssl rand -base64 32`).
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary name.
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary signed upload preset.

## 4. Installation
Install the necessary dependencies:
```bash
npm install
```

## 5. Database Sync
Sync the database schema and seed initial data:
```bash
# Push the schema to your DB
npx drizzle-kit push

# Create the first admin user
npx tsx src/db/seed-admin.ts
```

## 6. Run the Project
Start the development server:
```bash
npm run dev
```
The site will be live at [**localhost:3000**](http://localhost:3000).

---
> **Next Step**: Read [**`readdoc2-new-features.md`**](./readdoc2-new-features.md) to see what's new!
