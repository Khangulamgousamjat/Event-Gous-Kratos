# KRATOS 2026 Admin Guide

## Before Deployment

1. Set the required environment variables in the deployment target:
   `DATABASE_URL`
   `AUTH_SECRET`
   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   `NEXT_PUBLIC_SITE_URL`
2. Run `npm run build`.
3. Seed the first admin account with `npm run seed:admin` if the database is empty.
4. Sign in at `/auth/adminlogin`.
5. Open `/admin/settings` and confirm:
   registration open or closed state
   UPI ID
   fee per person
   deadline
   deployment checks

## How To Approve Or Reject

1. Open `/admin/registrations`.
2. Select a registration and click `Review`.
3. Verify:
   event details
   participant details
   team details if present
   transaction ID
   payment screenshot
4. Add notes if needed.
5. Click `Approve Registration` or `Reject Registration`.
6. Ask the student to recheck `/status` using their phone number or transaction ID.

## How To Export CSV

Use these exports while signed in as staff:

- Registrations CSV:
  `/api/admin/export?dataset=participants`
- Users CSV:
  `/api/admin/export?dataset=users`
- Payment proofs CSV:
  `/api/admin/proofs`

The registrations export includes leader rows, additional team members, status, total fee, and transaction ID.

## How To Handle Event-Day Desk Entries

1. Open `/admin/desk`.
2. Select the event.
3. Enter the participant name and phone number.
4. Add extra team members only when needed.
5. Save the desk entry.

This simplified build does not include a separate scanner-based check-in screen. The live event-day fallback is the manual desk workflow at `/admin/desk`.

## Recommended Final Validation

Before opening registrations to students:

1. Register one individual entry.
2. Register one team entry.
3. Upload a payment screenshot.
4. Confirm both entries appear in `/admin/registrations`.
5. Approve one and reject one.
6. Confirm `/status` shows the updated result.
7. Download all three CSV exports once.
