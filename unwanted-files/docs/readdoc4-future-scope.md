# ReadDoc 4: Final Improvements & Future Scope

This guide captures the most practical post-launch improvements for the **KRATOS 2026** platform.

The goal is simple: keep the system **student-friendly**, **operationally efficient**, **event-ready**, and **stable** without drifting into unnecessary complexity.

---

## 1. Student-Friendly Enhancements

These improvements reduce friction for attendees and make the platform easier to use on event day.

### My Schedule View
- Add a simple timeline on the participant dashboard showing only the events the student has registered for.
- Include reporting times, venues, and event order in one chronological view.
- Keep it read-only and lightweight; this is a convenience feature, not a full planner.

### Instant QR Code Generation
- Generate a unique QR code on the student dashboard tied to the participant's user ID or approved registration identity.
- Let volunteers scan this code at entry gates or event desks for faster verification.
- Reuse the existing QR and ticketing approach where possible instead of creating a new parallel system.

### Automated Notifications
- Add a lightweight messaging integration for reminder emails or WhatsApp alerts.
- Use it for broad operational messages such as registration reminders, event-day alerts, or venue changes.
- Prefer simple providers such as SMTP relays or Twilio-style APIs; avoid building a complex notification engine.

### Live Updates Banner
- Add an admin-editable announcement banner on the homepage.
- Use it for urgent updates like venue changes, reporting calls, or "starting in 10 minutes" notices.
- Keep updates manual and fast so admins can change them during live operations.

---

## 2. Operationally Efficient Tools

These improvements are aimed at admins and volunteers who need speed and clarity during the event.

### One-Click CSV Export
- Add a prominent export action on the admin dashboard for all users and event-specific participant lists.
- Support offline backup, print-ready attendance lists, and quick sharing with coordinators.
- Keep the export format plain `.csv` so it works everywhere.

### Fast-Track Desk Registration
- Add a minimal volunteer-facing registration page for walk-ins.
- Optimize for speed: the form should collect only the data needed to create a valid registration in seconds.
- Avoid routing volunteers through the full public registration flow.

### Volunteer Sub-Admin Roles
- Introduce basic RBAC with two roles.
- `Super Admin`: full access to all system actions.
- `Volunteer`: can view participant lists and mark attendance/check-ins, but cannot delete users, delete events, or change global settings.
- Keep the first version intentionally small and permission-based instead of introducing a deep role hierarchy.

### Bulk Check-In System
- Allow volunteers to mark participants as present by scanning QR codes or typing IDs manually.
- Keep the workflow event-specific so the right check-in is applied to the right registration.
- Design for queue speed first; audit detail can stay minimal.

---

## 3. Event-Ready and Stable Architecture

These improvements focus on reliability under real event-day traffic and imperfect campus connectivity.

### Local Cache / Offline Fallback
- Add a basic service worker to cache static assets such as CSS, JS, logos, and fonts.
- If the network drops temporarily, the site should still load its shell and core layout.
- Keep this limited to safe static caching; do not attempt a full offline data-sync system.

### Rate Limiting
- Add simple IP-based rate limiting on login and registration endpoints.
- The goal is to reduce spam, accidental resubmissions, and basic traffic abuse during peak load.
- Use straightforward thresholds and fail-safe responses rather than a complicated abuse-detection system.

### Database Indexing Optimization
- Review and add indexes for frequently queried fields.
- Prioritize `user email`, `phone number`, `event ID`, and registration status where appropriate.
- This helps preserve fast admin queries and lookup speed as registrations grow.

### Registration Kill Switch
- Add an environment-variable-based global registration kill switch.
- This should immediately disable new registrations if the overall event capacity is reached or operations need a manual stop.
- Keep the check simple and centralized so it can override normal registration flow safely.

---

## 4. What We Will Avoid

To protect performance and maintainability, the following ideas should stay out of scope unless the platform's needs change significantly:

- No real-time live chat support. A WhatsApp support link is simpler and more reliable.
- No complex split payment routing. Keep payments direct and operationally easy.
- No heavy 3D graphics or large auto-playing video backgrounds that hurt mobile performance.
- No machine-learning event matching or recommendation systems.

---

## 5. Recommended Direction

If these improvements are implemented in phases, the highest-value sequence is:

1. `My Schedule`, QR-based check-in improvements, and CSV export improvements.
2. Volunteer role restrictions and the fast-track desk registration flow.
3. Rate limiting, database indexing review, and the registration kill switch.
4. Service worker caching and lightweight messaging integrations.

This keeps the roadmap practical and aligned with the platform's real-world job: get students registered, verified, and checked in quickly without compromising stability.
