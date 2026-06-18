# KRATOS 2026 - Platform Features

Welcome to the KRATOS 2026 Platform. This document outlines the core features of the system and how they work, focusing on the experience for participants, volunteers, and administrators.

---

## 🎓 1. For Students & Participants

### Frictionless Registration
*   **One-Step Sign Up:** Students can log in instantly using their Google account or create a manual profile. No complex verifications needed.
*   **Team Creation Made Easy:** For group events like E-Sports or Hackathons, the team leader can add the names and phone numbers of their team members directly during checkout.
*   **Transparent Payments:** For paid events, participants upload a screenshot of their UPI payment and provide the transaction ID for admin verification.

### Personalized Dashboard
*   **"My Schedule" Timeline:** Once registered, every student receives a personalized, chronological timeline on their dashboard showing exactly when and where they need to report.
*   **Digital Fast-Entry Pass:** The dashboard generates a unique QR code valid for the entire festival. Students present this at entry gates or desk registrations for instant lookup.
*   **Live Progression (XP System):** We introduced a gamified system where students earn "XP" for registering and attending events, moving them up in Rank and Level natively within the platform.

### Dynamic Interaction
*   **Live Event Feed:** A real-time marquee directly on the homepage keeps students informed of sudden venue changes or breaking announcements.
*   **Exclusive Photo Gallery:** Only verified (paid/approved) participants gain access to upload and view photos on the public gallery module on their dashboard.

---

## 🛡️ 2. For Volunteers & Organizers

### The Fast-Track Volunteer Desk
*   **Sub-10 Second Registrations:** A dedicated dashboard meant for chaotic on-the-day registrations. Volunteers can intake walk-in students, select their event, and register them instantly without the student needing to create an account first.
*   **Role-Based Security:** Volunteers have restricted access. They can scan QR codes and approve registrations, but cannot delete events, export data, or access super-admin settings.

### Lightning-Fast Check-Ins
*   **Digital Sentry Scanner:** A built-in QR Code scanner (accessible via a smartphone camera) that securely scans the participant's Fast-Entry pass and logs their attendance at an event with one tap.

---

## 👑 3. For Super Administrators

### Total Platform Control
*   **Event Management Engine:** Admins have full CRUD (Create, Read, Update, Delete) control. Change event rules, entry fees, or minimum team sizes instantly from a visual interface without coding.
*   **Master Schedule Builder:** A drag-and-drop style interface to link events to specific time slots across the two-day festival timeline.
*   **The Kill-Switch:** A hardcoded safety mechanism allowing admins to temporarily disable all new registrations across the platform if capacity is breached.

### Data & Operations
*   **One-Click CSV Export:** Need to print a list for the security gate? One button instantly exports every participant, their team members, and check-in status to a standard Excel/CSV format.
*   **Automated Campaigns:** A built-in notification hub designed to support instant WhatsApp and Email broadcasts to all users or specific event subsets (requires backend configuration).
*   **Results & Leaderboards:** A secure panel to upload or reveal event results via YouTube embeds precisely at the scheduled time.

---

## ⚙️ How It Works (The Lifecycle)

1. **Pre-Event Phase:** Admins populate the Event Registry. Students visit the landing page, browse events, and secure their spots.
2. **Registration Phase:** Students upload UPI proofs. Volunteers check the "Pending Verification" queue on their backend, verify the transaction with the bank, and hit "Approve."
3. **Event Day Phase:** Students arrive with their Dashboard open. Volunteers scan their QR codes to instantly route them to the correct venue. Walk-ins are handled via the Fast-Track desk.
4. **Post-Event Phase:** The event concludes. Admins hit the "Reveal Results" switch on the main settings page to broadcast the winners globally.
