# ✨ ReadDoc 2: What's New in Kratos 2026

The platform has undergone a major visual and technical overhaul for a more **premium, professional** feel. This guide explains the latest features you’ll see.

## 1. 🏭 Premium Branding
The site now reflects the official identity of **Matoshri Pratishthan Group of Institutions, Nanded**.
-   **Typography**: Using `Space Grotesk` (Headings) and `Inter` (Body).
-   **Animations**: Added staggered entrance effects using `framer-motion` to the **Hero**, **About**, and **Organizers** sections. They slide in as you scroll!

## 2. 🖼️ Dynamic Image CMS
We’ve moved the landing page images from static files to the **database**.
-   **Hero Image**: The main campus photo can now be changed directly from the Admin Panel.
-   **About Collage**: The three images in the About section are now also managed via the dashboard.
-   **Stored in Cloudinary**: All images are optimized and served globally.

## 3. 🗺️ New Contact Page with Maps
The Contact page has been completely rebuilt to include:
-   **Official Contacts**: Real email and phone support for everyone.
-   **Campus Map**: An embedded Google Map pointing exactly to the Nanded campus.
-   **Organizer Cards**: Direct links and contact details for faculty and student leads.

## 4. 🗄️ Database Changes
-   Added the `system_settings` table to store hero assets.
-   Synchronized the **Drizzle Schema** with these new fields.
-   **Run `npx drizzle-kit push`** if you are seeing errors with the landing page.

---
> **Next Step**: Read [**`readdoc3-admin-manual.md`**](./readdoc3-admin-manual.md) to learn how to manage the site!
