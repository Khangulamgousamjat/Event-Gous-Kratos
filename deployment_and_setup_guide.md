# 🚀 Deployment, Database Setup, & Environment Guide

This guide provides step-by-step instructions on how to obtain your environment variables, configure **Firebase Firestore** as your database backend, and host your live website on **Vercel**.

---

## 📋 Table of Contents
1. [Where to Get Your Environment Variables (Step-by-Step)](#1-where-to-get-your-environment-variables-step-by-step)
2. [How to Use Firebase Firestore as Your Database Backend](#2-how-to-use-firebase-firestore-as-your-database-backend)
3. [How the Backend Works on Firestore](#3-how-the-backend-works-on-firestore)
4. [How to Deploy Live on Vercel](#4-how-to-deploy-live-on-vercel)

---

## 1. Where to Get Your Environment Variables (Step-by-Step)

Here is how to set up and fetch credentials for each service:

### A. NextAuth Secret (`AUTH_SECRET`)
This is used to encrypt user sessions.
1. Open a terminal.
2. Run this command:
   ```bash
   openssl rand -base64 32
   ```
3. Copy the generated random string and use it as `AUTH_SECRET`.

---

### B. Cloudinary API (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` & `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`)
This is required so participants can upload registration payment screenshots.
1. Sign up/Log in to [Cloudinary](https://cloudinary.com/).
2. On the **Console Dashboard**, copy your **Cloud Name** (this is `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`).
3. Click the **Gear Icon (Settings)** at the bottom left.
4. Go to the **Upload** tab.
5. Scroll down to **Upload presets** and click **Add upload preset**.
6. Set **Signing Mode** to **Unsigned**.
7. In the **Folder** field, you can set it to `kratos_payments`.
8. Save it, and copy the auto-generated **Preset name** (this is `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).

---

### C. Google OAuth (`AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`)
Required for Google single sign-in.
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Search for **APIs & Services** > **OAuth consent screen**, configure it as "External", and fill in basic details.
4. Go to the **Credentials** tab.
5. Click **Create Credentials** > **OAuth client ID**.
6. Select **Web application** as the application type.
7. Add Authorized Redirect URIs:
   * **Localhost:** `http://localhost:3000/api/auth/callback/google`
   * **Production:** `https://your-vercel-domain.vercel.app/api/auth/callback/google`
8. Save it to get your **Client ID** (`AUTH_GOOGLE_ID`) and **Client Secret** (`AUTH_GOOGLE_SECRET`).

---

### D. SMTP Email Credentials (e.g., Gmail)
1. Go to your Google Account settings > **Security**.
2. Enable **2-Step Verification** (required for app passwords).
3. Search for **App passwords** in the search bar.
4. Generate a new app password for "Mail" and "Windows Computer" (or Custom).
5. Copy the 16-character password.
6. Configure:
   * `SMTP_HOST=smtp.gmail.com`
   * `SMTP_PORT=587`
   * `SMTP_USER=yourgmail@gmail.com`
   * `SMTP_PASS=xxxxxxxxxxxxxxxx` (the app password without spaces)
   * `SMTP_FROM=yourgmail@gmail.com`

---

### E. Twilio WhatsApp Credentials
1. Sign up/Log in to [Twilio](https://www.twilio.com/).
2. Go to the console dashboard and copy your **Account SID** (`TWILIO_ACCOUNT_SID`) and **Auth Token** (`TWILIO_AUTH_TOKEN`).
3. Go to Messaging > **Try it Out** > **Send a WhatsApp Message** to activate the WhatsApp Sandbox.
4. Copy the Twilio sandbox WhatsApp number (e.g. `whatsapp:+14155238886`) and paste it as `TWILIO_WHATSAPP_FROM`.

---

## 2. How to Use Firebase Firestore as Your Database Backend

Because the application runs queries and mutations on the secure server-side (Server Actions, NextAuth credentials, and API routes), we use the **Firebase Admin SDK**. The Admin SDK requires a **Service Account Private Key** (rather than the client-side keys like apiKey or appId).

### Step-by-Step: Generate Your Service Account Keys
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project **event-kratos**.
3. Click the **Gear Icon (Project Settings)** in the left sidebar next to "Project Overview".
4. Select the **Service accounts** tab.
5. Click the blue button at the bottom: **Generate new private key**.
6. In the pop-up warning, click **Generate key**.
7. A `.json` file containing your credentials will be downloaded to your computer.
8. Open this downloaded `.json` file in a text editor (like Notepad).
9. Extract and configure the following fields into your `.env.local` file:

```env
# 1. Project ID
FIREBASE_PROJECT_ID="event-kratos"

# 2. Client Email (Copy the client_email field from your JSON)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@event-kratos.iam.gserviceaccount.com"

# 3. Private Key (Copy the entire private_key field from your JSON, including the BEGIN and END lines)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6...\n-----END PRIVATE KEY-----\n"
```

> [!IMPORTANT]
> Keep the private key wrapped in double quotes `"..."` in your `.env.local` file so Next.js parses the newlines (`\n`) correctly.

---

## 3. How the Backend Works on Firestore

* **Collections Structure**: Instead of SQL tables, the application stores data inside JSON document collections:
  * `users`: User profiles (name, email, role, phone, xp, level).
  * `events`: Event listings, pricing, and rules.
  * `registrations`: Main registration records (transaction ID, total fee, payment screenshot).
  * `teams`: Registrations representing a team event.
  * `teamMembers`: Custom rosters associated with a team ID.
  * `systemSettings`: Global states (locked website, registration switch, price multipliers). Document ID `1` holds the active configuration.
  * `announcements`: Layout notices.
  * `organizers` / `scheduleSlots` / `squadPosts` / `teamMessages`: Auxiliary collections.
* **Batch Operations & Transactions**: Registration submissions utilize `db.runTransaction()` to verify team slots and register participants atomically. Other admin actions (like deleting cascading components) use `db.batch()` to execute atomic NoSQL mutations.

---

## 4. How to Deploy Live on Vercel

Vercel is the hosting platform for Next.js and makes live deployment simple.

### Step 1: Push Code to GitHub
Ensure all local adjustments are committed and pushed:
```bash
git add -A
git commit -m "feat: database migrated to firebase firestore"
git push origin main
```

### Step 2: Connect GitHub to Vercel
1. Log in to [Vercel](https://vercel.com/) with your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your `Event-Gous-Kratos` repository.

### Step 3: Configure Environment Variables
Under the **Environment Variables** section in Vercel, copy and paste the values from your `.env.local` file:
* `FIREBASE_PROJECT_ID`
* `FIREBASE_CLIENT_EMAIL`
* `FIREBASE_PRIVATE_KEY` (Paste the exact private key string)
* `AUTH_SECRET`
* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
* `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
* `NEXT_PUBLIC_SITE_URL` (Set this to your live production URL, e.g., `https://event-gous-kratos.vercel.app`)

### Step 4: Deploy!
1. Click **Deploy**.
2. Vercel will build the Next.js production bundle, run compile checks, and launch your live website.
3. Once the build finishes, you will receive a production URL.
