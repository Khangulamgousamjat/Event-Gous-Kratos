# ReadDoc 3: Admin Manual

How to manage the KRATOS 2026 platform from the dashboard.

## 1. Accessing the Admin Panel
1. Go to [**`localhost:3000/auth/admin-login`**](http://localhost:3000/auth/admin-login).
2. Log in using the `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` you set in `.env.local`.

## 2. Managing Landing Page Images
This is one of the most important recent updates for the web team:

- Navigate to [**`Admin Dashboard > System Settings`**](http://localhost:3000/admin/settings).
- Look for the **Hero Image** and **About Section** fields.
- Click **Upload** to send the file to Cloudinary and save the URL in the database.
- Changes appear on the landing page immediately.

## 3. Verifying Registrations

- Go to **Registrations**.
- Click **Pending** to see participants who have uploaded payment proofs.
- Click the proof link to view the Cloudinary screenshot.
- Use **Approve** or **Reject** to update the registration state.

## 4. Organizing the Schedule

- Go to **Schedule**.
- The grid is fixed at **2 days x 5 slots**.
- Select an event from the dropdown to link it to a specific time slot.

## 5. Exports and Reports

- Use the **CSV Export** buttons in the Registrations and Results sections to download participant lists for on-campus verification.

---

> **Congratulations!** You've completed the ReadDoc series.
> **For more technical detail**, check [**`DOCUMENTATION.md`**](../DOCUMENTATION.md).
> **For post-launch improvements**, read [**`readdoc4-future-scope.md`**](./readdoc4-future-scope.md).
