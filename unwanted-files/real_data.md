# KRATOS 2026 Real Data Master Sheet

This document is the single source of truth for all real-world data needed to run KRATOS 2026 across the website, admin panel, registration flow, payments, schedule, results, organizers, and public communication.

## How to use this file

- Fill every field with real final data before launch.
- If a field is not decided yet, write `TBD - owner name - target date`.
- Keep names, dates, email IDs, phone numbers, slugs, and links exactly as they should appear publicly.
- Do not store secrets here.
  Store `DATABASE_URL`, `AUTH_SECRET`, OAuth secrets, and similar credentials only in `.env.local`.
- Use IST for all dates and times unless explicitly noted otherwise.
- Keep one copy of truth here, then mirror it into the admin panel and content pages.

---

## 🏫 COLLEGE DETAILS

### 1. Institution identity

| Field | Fill here | Notes |
| --- | --- | --- |
| Official college name | Matoshri Pratishthan Group of Institutions, Nanded | Full legal name |
| Short college name | M. P. G. I |  |
| Festival name | KRATOS 2026 |  |
| Festival subtitle/tagline | Build. Compete. Innovate. |  |
| Hosting department | School of Engineering |  |
| Official college website | https://mpgi.ac.in/school-of-engineering/ |  |
| NAAC / accreditation line | Recognized by AICTE, Affiliated to DBATU, Lonere |  |

### 2. Campus and venue identity

| Field | Fill here | Notes |
| --- | --- | --- |
| Full campus address | Jijau Nagar, Latur Nanded Highway, Post, Vishnupuri, Khupsarwadi, Nanded, Maharashtra 431606 | Include city, district, state, PIN |
| Google Maps link | https://maps.app.goo.gl/jUsf6JgUbzdNe2io7 | Public map URL |
| Primary festival venue name | Main Engineering Campus | Example: `Main Campus` |
| Registration desk location | At Entrance | Exact on-campus location |
| Inauguration / closing venue | Auditorium | Hall / auditorium name |
| Help desk location | At Registration desk location | For participants on event days |
| Parking instructions |  | Optional but recommended |

### 3. Branding assets owned by the college

| Field | Fill here | Notes |
| --- | --- | --- |
| Official college logo file path / URL | `/branding/college-logo.png` or `https://mpgi.ac.in/assets/logo-circle-6lgibGd7.png` | PNG/SVG preferred |
| KRATOS logo file path / URL | `/branding/kratos-logo.png` | Needed for favicon / header / posters |
| Favicon source | `/branding/favicon-source.png` | Source asset archived from the old repo root |
| Official college colors |  | Hex values |
| Official festival colors |  | Hex values if different |
| Approved font guidance |  | Optional if design team has one |

### 4. About page team data

> **Note from organizers:** Placeholders to be used until final team list is confirmed.

#### Faculty advisors

| Name | Role | Department | Phone | Email | Public on website? |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | Yes |
|  |  |  |  |  | Yes |

#### Student core team

| Name | Role | Year | Branch | Phone | Email | Public on website? |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  | Yes |
|  |  |  |  |  |  | Yes |
|  |  |  |  |  |  | Yes |
|  |  |  |  |  |  | Yes |

#### Web / design team

| Name | Role | GitHub / portfolio link | Public on website? |
| --- | --- | --- | --- |
| RAHIL HUSSAIN | FRONTEND DEV | https://github.com/Rahil-dope | Yes |
| PRANAV BIRADE | BACKEND DEV | https://github.com/PRANAVBIRHADE | Yes |

---

## 📅 EVENT DETAILS

### 1. Festival timeline

| Field | Fill here | Notes |
| --- | --- | --- |
| Festival start date | 20/04/2026 10:30 AM IST | IST |
| Festival end date | 21/04/2026 05:30 PM IST | IST |
| Day 1 date | 20/04/2026 10:30 AM IST | IST |
| Day 2 date | 21/04/2026 10:30 AM IST | IST |
| Daily reporting time | 09:30 AM | For volunteers / organizers |
| Public start time each day | 10:00 AM | If same for all attendees |
| Public end time each day | 05:30 PM |  |
| Registration opening date and time | PRESENT (Open now) | IST |
| Registration closing date and time | 18/04/2026 06:00 PM IST | Drives admin deadline |
| Countdown target date and time | 20/04/2026 10:30 AM IST | Must match what hero should count down to |
| Results reveal date and time | 22/04/2026 06:30 PM IST | Drives leaderboard unlock |
| Gallery unlock timing | 22/04/2026 06:30 PM IST | Example: `After closing ceremony on Day 2` |

### 2. Festival-wide public copy

| Field | Fill here | Notes |
| --- | --- | --- |
| Hero eyebrow text | Annual Technical Festival of MPGI Engineering | Example: `Largest Tech Festival at Matoshri` |
| Hero headline line 1 | KRATOS | Keep if unchanged |
| Hero headline line 2 | 2026 | Keep if unchanged |
| Hero description | Experience two days of innovation, competition, and creativity at KRATOS 2026. From coding challenges and hardware builds to design, gaming, and problem-solving events, this is where engineers come to test their skills, collaborate, and compete. Open to all engineering branches, KRATOS is designed to maximize participation, learning, and real-world exposure. | Public landing page copy |
| CTA headline | Ready to Compete? | Optional if replacing existing section copy |
| CTA description | Registrations are now open. Choose your events, form your team, and be part of KRATOS 2026. Limited time to register. | Replace hardcoded urgency text with real message |
| Footer copyright line | © 2026 KRATOS \| Student Department \| Matoshri Pratishthan Group of Institutions, Nanded | Exact public text |
| Default announcement message | 🚀 Registrations Open — KRATOS 2026 on 20–21 April \| Register before 18 April | Single-line scrolling message |

### 3. Fixed schedule structure used by the current system

The current admin schedule UI supports exactly **5 slots per day**.
If timings change beyond this structure, the code will need updates.

| Slot | Default time range in system | Confirm final time | Day 1 label if no event linked | Day 2 label if no event linked |
| --- | --- | --- | --- | --- |
| 1 | 10:30 AM – 11:00 AM | ✅ Confirmed | Opening Ceremony | Events Begin |
| 2 | 11:00 AM – 01:00 PM | ✅ Confirmed | Multiple events | Multiple events |
| 3 | 01:00 PM – 01:30 PM | ✅ Confirmed | Lunch / break | Lunch / break |
| 4 | 01:30 PM – 04:00 PM | ✅ Confirmed | Multiple events | Multiple events |
| 5 | 04:00 PM – 05:30 PM | ✅ Confirmed | E-Sports + Poster | Prize Distribution |

### 4. Day-wise operational schedule

#### Day 1 (20 April 2026)

| Time Slot | Event | Venue |
| --- | --- | --- |
| 10:30 – 11:00 AM | Opening Ceremony, Lamp Lighting, Welcome Address & Chief Guest Speech | Auditorium |
| 11:00 AM – 02:00 PM | Mini Hackathon (3 Hours) | Computer Lab |
| 11:00 AM – 12:00 PM | Tech Quiz — Preliminary Round | Seminar Hall |
| 12:00 – 01:00 PM | Circuit Designing Competition | Electronics Lab |
| 01:00 – 01:30 PM | Lunch Break | — |
| 01:30 – 03:00 PM | Tech Treasure Hunt | Campus Area |
| 01:30 – 03:30 PM | Hardware Project Display Round | Project Gallery / Lab |
| 03:00 – 04:00 PM | Components Identifying Competition | Electronics Lab |
| 04:00 – 05:00 PM | E-Sports Tournament (BGMI) — Qualifiers | Computer Lab |
| 04:00 – 05:00 PM | Tech Poster Presentation | Seminar Hall |
| 05:00 – 05:30 PM | Day 1 Wrap-Up and Feedback Session | Auditorium |

#### Day 2 (21 April 2026)

| Time Slot | Event | Venue |
| --- | --- | --- |
| 10:30 – 12:00 PM | Junkyard Innovation | Open Area / Workshop Zone |
| 10:30 – 12:00 PM | Bridge Designing Competition | Workshop Area |
| 12:00 – 01:30 PM | Hardware Project — Final Demonstration | Auditorium / Lab |
| 12:00 – 01:30 PM | E-Sports Tournament (BGMI) — Finals | Computer Lab |
| 01:30 – 02:00 PM | Lunch Break | — |
| 02:00 – 03:00 PM | Tech Quiz — Final Round | Auditorium |
| 03:00 – 04:00 PM | Reel Competition Judging & Screening | Auditorium |
| 04:00 – 05:00 PM | Final Evaluation and Result Compilation | Organizing Room |
| 05:00 – 05:30 PM | Prize Distribution, Certificate Ceremony & Valediction Address | Auditorium |
| 05:30 PM | Closing of KRATOS 2026 | — |

---

## 🧩 EVENTS

### Event Fee Structure (applies to all paid events)

| Number of members | Fee |
| --- | --- |
| 1 member | ₹49 |
| 2 members | ₹98 |
| 3 members | ₹147 |
| 4 members | ₹196 |
| 5 members | ₹245 |

---

### 1. 🚀 Hackathon

| Field | Value |
| --- | --- |
| Event Name | Hackathon |
| Slug | hackathon |
| Category | Coding / Innovation |
| Tagline | Build something impactful in just 3 hours |
| Description | A fast-paced coding and innovation challenge where teams design and develop a solution to a given problem statement within 3 hours. Focus is on creativity, functionality, and real-world applicability. |
| Is Common Event | Yes |
| Format | TEAM |
| Min Team Size | 2 |
| Max Team Size | 4 |
| Expected Participants | 40–60 |
| Venue | Computer Lab |
| Schedule | Day 1 — 11:00 AM to 02:00 PM |
| Round Structure | Single round |
| Equipment by College | PCs, Internet |
| Participants must bring | Laptop, charger |
| Payment Required | Yes |
| Registration Cap | 15 teams |
| Prizes | 1st: ₹5000 \| 2nd: ₹3000 \| 3rd: ₹2000 |
| Rules | Teams must build within time limit; Internet allowed; Pre-built projects not allowed; Final demo required |
| Judging Criteria | Innovation, Functionality, Practical use, Presentation |

---

### 2. 🧠 Tech Quiz

| Field | Value |
| --- | --- |
| Event Name | Tech Quiz |
| Slug | tech-quiz |
| Category | Knowledge / Quiz |
| Tagline | Test your engineering IQ |
| Description | A multi-round quiz competition covering core engineering concepts, technology trends, and logical reasoning. |
| Is Common Event | Yes |
| Format | SOLO / TEAM |
| Min Team Size | 1 |
| Max Team Size | 2 |
| Expected Participants | 30–40 |
| Venue | Seminar Hall |
| Schedule | Day 1 Prelims 11:00 AM → Day 2 Finals 02:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹2500 \| 2nd: ₹1000 \| 3rd: ₹500 |
| Rules | No phones allowed; Decision of quiz master final; Tie-breaker rounds possible |

---

### 3. 🧩 Tech Treasure Hunt

| Field | Value |
| --- | --- |
| Event Name | Tech Treasure Hunt |
| Slug | tech-treasure-hunt |
| Category | Puzzle / Adventure |
| Tagline | Decode. Solve. Conquer. |
| Description | A campus-wide technical treasure hunt where teams solve clues related to engineering and logic to reach the final destination. |
| Is Common Event | Yes |
| Format | TEAM |
| Min Team Size | 3 (at least 1 girl mandatory) |
| Max Team Size | 5 |
| Expected Participants | 40–60 |
| Venue | Entire Campus |
| Schedule | Day 1 — 01:30 PM to 03:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹2500 \| 2nd: ₹1000 \| 3rd: ₹500 |
| Rules | No external help; Clues must be solved sequentially; First team to finish wins; Fair play mandatory |

---

### 4. 🎨 Tech Poster Presentation

| Field | Value |
| --- | --- |
| Event Name | Tech Poster Presentation |
| Slug | tech-poster |
| Category | Design / Research |
| Tagline | Present your ideas visually |
| Description | Participants present posters on emerging technologies, innovations, or engineering concepts and explain them to judges. |
| Is Common Event | Yes |
| Format | SOLO / TEAM |
| Min Team Size | 1 |
| Max Team Size | 4 |
| Expected Participants | 15–20 |
| Venue | Corridor |
| Schedule | Day 1 — 04:00 PM to 05:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹1500 \| 2nd: ₹500 \| 3rd: ₹500 |
| Rules | Poster must be original; Topic must be technical; Presentation time: 3–5 minutes; Q&A by judges |
| Judging Criteria | Content quality, Design clarity, Innovation, Presentation |

---

### 5. 🔧 Junkyard Innovation

| Field | Value |
| --- | --- |
| Event Name | Junkyard Innovation |
| Slug | junkyard-innovation |
| Category | Design / Build |
| Tagline | Build innovation from waste |
| Description | A hands-on challenge where teams create innovative models using scrap or low-cost materials. Focus is on creativity, usability, and engineering thinking. |
| Is Common Event | Yes |
| Format | TEAM |
| Min Team Size | 1 |
| Max Team Size | 4 |
| Expected Participants | 20–40 |
| Venue | Workshop / Open Area |
| Schedule | Day 2 — 10:30 AM to 12:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹3000 \| 2nd: ₹1500 \| 3rd: ₹500 |
| Rules | Use only provided / basic materials; No pre-built models; Must explain working; Time-bound build |
| Judging Criteria | Creativity, Utility, Design, Presentation |

---

### 6. 🔌 Circuit Designing Competition

| Field | Value |
| --- | --- |
| Event Name | Circuit Designing Competition |
| Slug | circuit-design |
| Category | Electronics |
| Tagline | Design. Analyze. Solve. |
| Description | Participants design and simulate electronic circuits based on given problem statements, testing their understanding of circuit logic and design. |
| Is Common Event | Yes |
| Format | SOLO |
| Min Team Size | 1 |
| Max Team Size | 1 |
| Expected Participants | 15–20 |
| Venue | Electronics Lab |
| Schedule | Day 1 — 12:00 PM to 01:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹1500 \| 2nd: ₹500 \| 3rd: ₹500 |
| Rules | Solve given circuit problem; Simulation tools allowed; No external help |

---

### 7. 🌉 Bridge Designing Competition

| Field | Value |
| --- | --- |
| Event Name | Bridge Designing Competition |
| Slug | bridge-design |
| Category | Civil / Design |
| Tagline | Build strength through design |
| Description | Teams construct a bridge model using basic materials and test its load-bearing capacity. |
| Is Common Event | Yes |
| Format | TEAM |
| Min Team Size | 1 |
| Max Team Size | 4 |
| Expected Participants | 20–40 |
| Venue | Workshop Area |
| Schedule | Day 2 — 10:30 AM to 12:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹2000 \| 2nd: ₹1500 \| 3rd: ₹500 |
| Rules | Use given materials only; Time-bound construction; Strength test will be applied |

---

### 8. ⚙️ Hardware Project Competition

| Field | Value |
| --- | --- |
| Event Name | Hardware Project Competition |
| Slug | hardware-project |
| Category | Hardware / Innovation |
| Tagline | Showcase real engineering |
| Description | Participants present working hardware projects demonstrating practical engineering applications such as IoT, robotics, and embedded systems. |
| Is Common Event | Yes |
| Format | TEAM |
| Min Team Size | 1 |
| Max Team Size | 4 |
| Expected Participants | 20–40 |
| Venue | Lab / Auditorium |
| Schedule | Day 1 Display 01:30 PM — Day 2 Final Demo 12:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹4000 \| 2nd: ₹2500 \| 3rd: ₹1500 |
| Rules | Project must be functional; Live demo required; Explain working clearly |
| Judging Criteria | Innovation, Complexity, Practical application, Presentation |

---

### 9. 🔍 Components Identifying Competition

| Field | Value |
| --- | --- |
| Event Name | Components Identifying Competition |
| Slug | components-identifying |
| Category | Electronics |
| Tagline | Identify. Understand. Apply. |
| Description | Participants identify electronic components and their functions within a time limit. |
| Is Common Event | Yes |
| Format | SOLO |
| Expected Participants | 15–25 |
| Venue | Electronics Lab |
| Schedule | Day 1 — 03:00 PM to 04:00 PM |
| Payment Required | Yes |
| **Note** | Fallback event — keep low priority |

---

### 10. 🎮 E-Sports Tournament (BGMI)

| Field | Value |
| --- | --- |
| Event Name | E-Sports Tournament (BGMI) |
| Slug | bgmi |
| Category | Gaming |
| Tagline | Strategy. Survival. Victory. |
| Description | A competitive BGMI tournament where participants battle in a structured format emphasizing strategy and skill. |
| Is Common Event | Yes |
| Format | SOLO |
| Team Size | 1 |
| Expected Participants | 40–48 |
| Venue | Classroom |
| Schedule | Day 1 Qualifiers 04:00 PM → Day 2 Finals 12:00 PM |
| Payment Required | Yes |
| Prizes | 1st: ₹2000 \| 2nd: ₹1500 \| 3rd: ₹500 |
| Rules | Fair play mandatory; No hacking/mods; Decisions final |

---

### 11. 🎥 Reel Competition

| Field | Value |
| --- | --- |
| Event Name | Reel Competition |
| Slug | reel-competition |
| Category | Creative / Media |
| Tagline | Create. Capture. Inspire. |
| Description | Participants create short reels showcasing technical ideas, innovation, or college life. Online submission before Day 2; judging and screening on Day 2. |
| Is Common Event | Yes |
| Format | SOLO or TEAM |
| Expected Participants | 10–20 |
| Venue | Online Submission + Auditorium Screening |
| Schedule | Submission: Before Day 2 \| Judging: Day 2 03:00–04:00 PM |
| Payment Required | **FREE EVENT** |
| Prizes | 1st: ₹1000 \| 2nd: ₹500 |
| Rules | Duration: 30–60 sec; Original content only |

---

## 👥 ORGANIZING TEAM

> **Note from organizers:** Will be finalized later. Use placeholders until then.

### 1. Public organizer directory

| Organizer name | Role | Contact line | Show publicly? | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | Yes / No |  |
|  |  |  | Yes / No |  |
|  |  |  | Yes / No |  |

### 2. Internal operational owners

| Function | Owner name | Phone | Email | Backup owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Festival overall lead |  |  |  |  |  |
| Admin panel owner |  |  |  |  |  |
| Registration verification lead |  |  |  |  |  |
| Payment verification lead |  |  |  |  |  |
| Check-in lead |  |  |  |  |  |
| Results and leaderboard owner |  |  |  |  |  |
| Gallery moderation owner |  |  |  |  |  |
| Sponsorship lead |  |  |  |  |  |
| Website / technical support lead |  |  |  |  |  |

### 3. Admin access roster

Do not store passwords here.

| Admin name | Role | Login email | Needs admin access? | Notes |
| --- | --- | --- | --- | --- |
|  |  |  | Yes / No |  |
|  |  |  | Yes / No |  |
|  |  |  | Yes / No |  |

---

## 💰 PAYMENT DETAILS

### 1. Official payment collection

| Field | Fill here | Notes |
| --- | --- | --- |
| UPI ID | 9834147160@kotak811 | Maps to admin settings |
| UPI account holder name | SHAIKH RAHIL HUSAIN SHAUKAT HUSSAIN | For participant confidence |
| Payment app / bank name |  | Optional |
| Default fee per person (INR) | 49 | Maps to global `feePerPerson` |
| Are any events free? | YES | If yes, list exceptions below |
| Free event list | Reel Competition | If applicable |
| Refund policy | No refunds | Public wording |
| Tax / receipt note |  | Optional |

### 2. Payment proof standards

| Field | Fill here | Notes |
| --- | --- | --- |
| Accepted payment proof formats | PNG, JPG, PDF | Example: PNG, JPG, PDF |
| Required screenshot details | payer name, UTR, amount, date | Example: payer name, UTR, amount, date |
| Required transaction reference format |  | Example: `12-digit UTR` |
| Manual verification SLA |  | Example: `Within 12 hours` |
| Rejection reasons to use in admin notes |  | Comma-separated shortlist |
| Payment support escalation contact |  | Name + phone/email |

### 3. QR and display assets

| Field | Fill here | Notes |
| --- | --- | --- |
| Official static UPI QR image | Present | Optional backup asset |
| Printed payment poster available? | Yes |  |
| QR verification owner |  | Who confirms the UPI target is correct |

---

## ⚙️ SYSTEM SETTINGS

### 1. Launch configuration

| Field | Fill here | Notes |
| --- | --- | --- |
| Registration open? | Yes | Maps to `registrationOpen` |
| Registration deadline | 18/04/2026 06:00 PM IST | IST, maps to `deadline` |
| Gallery locked? | Yes | Maps to `isGalleryLocked` |
| Results reveal time | 22/04/2026 06:30 PM IST | IST, maps to `resultsRevealTime` |
| Results video embed URL |  | Must be YouTube `/embed/` URL |
| Active announcement visible? | Yes | Current system supports one active line |
| Active announcement text | 🚀 Registrations Open — KRATOS 2026 on 20–21 April \| Register before 18 April | Single-line broadcast |

### 2. Content replacements still needing real data

| Item | Real value needed | Owner | Status |
| --- | --- | --- | --- |
| Hero image |  |  | Pending |
| Contact page emails | kratos2026@mpgi.ac.in / studentdept@mpgi.ac.in | Web team | Placeholder used |
| Contact page phone numbers | 9834147160 | Rahil | Placeholder used |
| Sponsorship email |  |  | Pending |
| About page faculty names |  | Student Dept | TBD |
| About page student team names |  | Student Dept | TBD |
| About page developer links | Rahil: github.com/Rahil-dope, Pranav: github.com/PRANAVBIRHADE | Web team | ✅ Done |
| Event rules PDF links |  |  | Pending |

### 3. Operational rules the current build assumes

- One active scrolling announcement at a time.
- One registration creates one team record.
- Team members are stored individually.
- Gallery upload limit is 4 photos per user.
- Results page expects top 3 winners per event.
- Schedule UI currently supports only 2 days and 5 slots per day.
- Team size UI currently supports a maximum of 4.

---

## 📞 CONTACT INFORMATION

### 1. Public website contacts

| Contact type | Name / team | Email | Phone | WhatsApp | Public on website? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| General support |  | kratos2026@mpgi.ac.in | 9834147160 |  | Yes | Used on contact page |
| Event queries |  | studentdept@mpgi.ac.in |  |  | Yes | Used on contact page |
| Logistics |  |  |  |  | Yes / No |  |
| Command center |  |  |  |  | Yes / No |  |
| Sponsorships |  |  |  |  | Yes / No |  |

---

## Final readiness checklist

- [x] College identity and branding approved
- [x] Festival dates and countdown target confirmed
- [x] Registration deadline confirmed in IST (18 April 2026 6:00 PM)
- [x] All 11 events entered with final slugs, formats, fees, and venues
- [x] Day 1 and Day 2 schedule locked
- [ ] Organizer directory approved for public display
- [x] UPI ID verified — 9834147160@kotak811
- [x] Announcement text reviewed
- [ ] Contact emails and phone numbers verified with team
- [ ] Hero image and branding assets replaced with owned files
- [ ] Rules PDFs collected for every event
- [ ] Results reveal time YouTube embed URL prepared
- [ ] Cloudinary upload preset confirmed
- [ ] Admin roster finalized
