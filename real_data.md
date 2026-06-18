# KRATOS 2026 Real Data Checklist

Fill this sheet before deployment so the live database and admin settings can be completed without guesswork.

## 1. Platform Settings

- Public site URL
- UPI ID that will receive registration payments
- Default fee per person, if one shared fee is used across paid events
- Registration deadline date and time
- Whether registrations should open immediately after deploy
- Emergency contact details for students

## 2. Event Data

Provide the following for every event:

- Event name
- Short tagline
- Full description
- Category
- Venue
- Schedule text
- Event format:
  `SOLO`
  `TEAM`
  `SOLO_TEAM`
  `SOLO_PAIR`
- Minimum team size
- Maximum team size
- Fee for the event if it is not free
- Prize details, if shown publicly
- Sort order for the event list

## 3. Branding Assets

- Hero image URL if replacing the default
- About section image 1
- About section image 2
- About section image 3
- Organizer profile images

## 4. Staff and Access

- Initial admin name
- Initial admin email
- Initial admin password
- Additional volunteer emails, if needed
- `ADMIN_SETUP_KEY` value if staff accounts will be created after deployment

## 5. Cloudinary Setup

The current build uses the Cloudinary upload widget with an unsigned preset.

- Cloudinary cloud name
- Unsigned upload preset for screenshots
- Confirm the preset allows image uploads only
- Confirm the preset is suitable for JPG and PNG screenshots

## 6. Optional Notification Setup

- SMTP host
- SMTP port
- SMTP username
- SMTP password
- SMTP from address
- Twilio account SID
- Twilio auth token
- Twilio WhatsApp sender number

## 7. Event-Day Operations

- Staff who will review payment screenshots
- Staff who will handle desk registrations at `/admin/desk`
- Final exported CSV destination or owner
- Approval turnaround expectation for students
