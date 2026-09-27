# Campaign Management Platform

**Stack:** React 18 + Vite + Tailwind CSS + Firebase (Auth, Firestore, Storage)

This platform includes a public campaign website and a password-protected admin
dashboard for managing projects, news, events, gallery, volunteers, and contact
messages — all backed by Firebase with security rules enforced server-side.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1 — Download & Install Dependencies](#step-1--download--install-dependencies)
3. [Step 2 — Create a Firebase Project](#step-2--create-a-firebase-project)
4. [Step 3 — Register a Web App & Get Config Keys](#step-3--register-a-web-app--get-config-keys)
5. [Step 4 — Enable Firebase Authentication](#step-4--enable-firebase-authentication)
6. [Step 5 — Enable Firestore Database](#step-5--enable-firestore-database)
7. [Step 6 — Enable Firebase Storage](#step-6--enable-firebase-storage)
8. [Step 7 — Configure Environment Variables (.env.local)](#step-7--configure-environment-variables-envlocal)
9. [Step 8 — Create Your Admin User Account](#step-8--create-your-admin-user-account)
10. [Step 9 — Create the admins Document in Firestore](#step-9--create-the-admins-document-in-firestore)
11. [Step 10 — Deploy Security Rules](#step-10--deploy-security-rules)
12. [Step 11 — Run the Dev Server](#step-11--run-the-dev-server)
13. [Deploy to Firebase Hosting](#deploy-to-firebase-hosting)
14. [Project Structure](#project-structure)
15. [Firestore Collections Reference](#firestore-collections-reference)
16. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure the following are installed on your machine before starting:

| Tool | Version | Check | Install |
|---|---|---|---|
| Node.js | 18 or higher | `node --version` | https://nodejs.org |
| npm | 9 or higher | `npm --version` | Comes with Node |
| Git (optional) | any | `git --version` | https://git-scm.com |

You also need a **Google account** to use Firebase (it's free to get started).

---

## Step 1 — Download & Install Dependencies

1. Unzip the downloaded project folder, or clone the repository.
2. Open a terminal and navigate into the project folder:
   ```bash
   cd campaign-platform
   ```
3. Install all dependencies:
   ```bash
   npm install
   ```
   This will download React, Vite, Tailwind, Firebase SDK, and all other packages
   listed in `package.json`. It may take 1–2 minutes.

---

## Step 2 — Create a Firebase Project

1. Open your browser and go to: **https://console.firebase.google.com**
2. Sign in with your Google account.
3. Click the **"Add project"** button (or **"Create a project"**).
4. **Project name:** Enter a name, e.g. `candidate-campaign` — this is just a
   label for you, it doesn't appear on your website.
5. **Google Analytics:** You can enable or disable this — it's optional.
   If enabled, select or create an Analytics account when prompted.
6. Click **"Create project"** and wait for it to finish (about 30 seconds).
7. Click **"Continue"** when it's ready — you'll land on the project dashboard.

---

## Step 3 — Register a Web App & Get Config Keys

Firebase needs to know your website is connecting to it. This step generates
the API keys you'll put in `.env.local`.

1. On the Firebase project dashboard, look for the **"Add app"** section
   (or click the `</>` icon — it represents a Web app).
2. Click **`</>`** (Web).
3. **App nickname:** Enter anything, e.g. `Campaign Website`.
4. **Firebase Hosting:** You can tick this if you plan to deploy via Firebase
   Hosting later — it's optional for now.
5. Click **"Register app"**.
6. You'll see a code block like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

7. **Keep this page open** — you'll copy these values in Step 7.
8. Click **"Continue to console"** when done.

> **To find these values later:** Firebase Console → Project Settings
> (gear icon ⚙ next to "Project Overview") → scroll down to "Your apps"
> → select your web app → you'll see the config object again.

---

## Step 4 — Enable Firebase Authentication

This allows your admin to log in with email and password.

1. In the Firebase Console left sidebar, click **"Build"** → **"Authentication"**.
2. Click **"Get started"**.
3. You'll see a list of sign-in providers. Click **"Email/Password"**.
4. Toggle **"Enable"** to ON for the first option (Email/Password).
   Leave "Email link (passwordless sign-in)" disabled.
5. Click **"Save"**.

Authentication is now enabled. You'll add the actual admin user account in Step 8.

---

## Step 5 — Enable Firestore Database

This is the database that stores all your projects, news, events, volunteers, etc.

1. In the left sidebar, click **"Build"** → **"Firestore Database"**.
2. Click **"Create database"**.
3. **Security rules:** Select **"Start in production mode"**.
   (The project includes its own security rules in `firestore.rules` that you'll
   deploy in Step 10 — production mode is correct here.)
4. **Location:** Choose the region closest to your users.
   - Africa: `europe-west1` (Belgium) or `me-central1` (Middle East) are closest.
   - You cannot change the region after this, so choose carefully.
5. Click **"Enable"** and wait for the database to be created (~30 seconds).

---

## Step 6 — Enable Firebase Storage

This stores uploaded images (project photos, gallery, news covers, etc.).

1. In the left sidebar, click **"Build"** → **"Storage"**.
2. Click **"Get started"**.
3. **Security rules:** Click **"Next"** (you'll deploy proper rules from
   `storage.rules` in Step 10).
4. **Location:** This is automatically set to match your Firestore region.
5. Click **"Done"**.

---

## Step 7 — Configure Environment Variables (.env.local)

This is where you connect the project code to your Firebase project.

1. In your project folder, find the file called **`.env.example`**.
2. Make a copy of it and name the copy **`.env.local`**:
   ```bash
   cp .env.example .env.local
   ```
   On Windows (Command Prompt):
   ```cmd
   copy .env.example .env.local
   ```
3. Open `.env.local` in any text editor (VS Code, Notepad, etc.).
   You'll see this:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Replace each placeholder with the matching value from the Firebase config
   object you saw in Step 3. For example:

   | .env.local variable | Firebase config field |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | `apiKey` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `VITE_FIREBASE_PROJECT_ID` | `projectId` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `VITE_FIREBASE_APP_ID` | `appId` |

5. Save the file. It should look like:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyAbc123...
   VITE_FIREBASE_AUTH_DOMAIN=candidate-campaign.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=candidate-campaign
   VITE_FIREBASE_STORAGE_BUCKET=candidate-campaign.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
   VITE_FIREBASE_APP_ID=1:987654321:web:abc123def456
   ```

> ⚠️ **Important:** Never share or commit `.env.local` — it contains your
> private API keys. It is already listed in `.gitignore` so Git will ignore it.

---

## Step 8 — Create Your Admin User Account

This creates the login credentials you'll use to access the admin dashboard.

1. In the Firebase Console, go to **"Authentication"** (left sidebar).
2. Click the **"Users"** tab.
3. Click **"Add user"**.
4. Enter:
   - **Email:** your admin email address (e.g. `admin@yourcampaign.org`)
   - **Password:** a strong password (min. 6 characters)
5. Click **"Add user"**.
6. The user now appears in the list. **Copy the "User UID"** shown in the
   table — it's a long string like `aB3kL9mN2pQ7rS5tU8vW1x`.
   You'll need this in the next step.

> 💡 **Tip:** Click anywhere on the user row to see the full UID if it's
> truncated. You can also hover over it to see a copy icon.

---

## Step 9 — Create the admins Document in Firestore

The app uses an `admins` collection in Firestore to verify that a logged-in
user is actually an authorised admin. Simply having an Auth account is not
enough — this document must also exist. This is a deliberate security design:
it means you control admin access at the database level, not just the login level.

1. In the Firebase Console, go to **"Firestore Database"** (left sidebar).
2. Click **"+ Start collection"**.
3. **Collection ID:** Type exactly `admins` (lowercase) → click **"Next"**.
4. **Document ID:** Paste the User UID you copied in Step 8.
   (e.g. `aB3kL9mN2pQ7rS5tU8vW1x`)
   Do NOT click "Auto-ID" — the document ID must be the exact UID.
5. Now add the following fields to the document:

   | Field name | Field type | Value |
   |---|---|---|
   | `email` | string | your admin email address |
   | `role` | string | `admin` |
   | `createdAt` | timestamp | click "Set to current time" |

6. Click **"Save"**.

Your Firestore structure should now look like:
```
admins/
  └── aB3kL9mN2pQ7rS5tU8vW1x    ← this is your UID
        email: "admin@yourcampaign.org"
        role: "admin"
        createdAt: [timestamp]
```

> ⚠️ **Never create an `admins` document for anyone you don't fully trust.**
> Any UID with a document in this collection will have full read/write access
> to all campaign data in Firestore and Storage.

---

## Step 10 — Deploy Security Rules

The project includes pre-written security rules for both Firestore and Storage.
These rules enforce who can read and write data — they must be deployed to
Firebase before the app is production-ready.

### Option A — Deploy via Firebase CLI (recommended)

1. Install the Firebase CLI (once, globally):
   ```bash
   npm install -g firebase-tools
   ```
2. Log in:
   ```bash
   firebase login
   ```
3. Open `.firebaserc` in your project root and replace `YOUR_FIREBASE_PROJECT_ID`
   with your actual Firebase project ID (the `projectId` from Step 3).
4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

### Option B — Paste rules manually in the Firebase Console

**Firestore rules:**
1. Firebase Console → Firestore Database → **"Rules"** tab.
2. Delete the existing content and paste the contents of `firestore.rules`.
3. Click **"Publish"**.

**Storage rules:**
1. Firebase Console → Storage → **"Rules"** tab.
2. Delete the existing content and paste the contents of `storage.rules`.
3. Click **"Publish"**.

---

## Step 11 — Run the Dev Server

Everything is configured. Start the development server:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in 500ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open your browser:
- **Public website:** http://localhost:5173
- **Admin dashboard:** http://localhost:5173/admin/login

Log in with the email and password you created in Step 8. If you see the
dashboard, everything is working correctly.

---

## Deploy to Firebase Hosting

When you're ready to publish the site live:

```bash
# Build the production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be live at: `https://YOUR_PROJECT_ID.web.app`

To deploy everything at once (hosting + rules):
```bash
firebase deploy
```

---

## Project Structure

```
campaign-platform/
├── index.html                     Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── firebase.json                  Firebase Hosting + rules config
├── firestore.rules                Firestore security rules
├── storage.rules                  Storage security rules
├── .env.example                   Template for environment variables
├── .env.local                     Your private config (NOT committed to Git)
│
└── src/
    ├── main.jsx                   React app entry point
    ├── App.jsx
    ├── index.css                  Tailwind directives + global styles
    │
    ├── firebase/
    │   ├── config.js              Firebase app initialization
    │   ├── auth.js                signIn / signOut helpers
    │   ├── firestore.js           Generic Firestore CRUD helpers
    │   └── storage.js             File upload / delete helpers
    │
    ├── context/
    │   └── AuthContext.jsx        Global auth state (useAuth hook)
    │
    ├── routes/
    │   ├── AppRoutes.jsx          All route definitions
    │   └── ProtectedRoute.jsx     Redirects unauthenticated users
    │
    ├── layouts/
    │   ├── PublicLayout.jsx       Header + Footer wrapper
    │   └── AdminLayout.jsx        Sidebar + Topbar wrapper
    │
    ├── components/
    │   ├── public/                Header, Footer
    │   ├── admin/                 Sidebar, Topbar
    │   └── shared/                Button, Input, LoadingSpinner, ConfirmDialog
    │
    ├── pages/
    │   ├── public/                Home, About, VisionMission, Manifesto,
    │   │                          Projects, Gallery, NewsEvents, Contact,
    │   │                          VolunteerRegistration, NotFound
    │   └── admin/                 Login, DashboardHome, EventManagement,
    │                              CalendarManagement, ProjectManagement,
    │                              GalleryManagement, NewsManagement,
    │                              VolunteerManagement, ContactMessages
    │
    └── utils/
        ├── constants.js           Category lists, status enums
        └── formatDate.js          Date formatting helpers
```

---

## Firestore Collections Reference

| Collection | Who can read | Who can write | Purpose |
|---|---|---|---|
| `projects` | Everyone | Admin only | Community projects |
| `galleryItems` | Everyone | Admin only | Photo/video gallery |
| `news` | Everyone (published only) | Admin only | News articles |
| `events` | Everyone | Admin only | Campaign events |
| `manifesto` | Everyone | Admin only | Policy categories |
| `siteContent` | Everyone | Admin only | Editable page copy |
| `volunteers` | Admin only | Anyone (create) | Volunteer form submissions |
| `contactMessages` | Admin only | Anyone (create) | Contact form submissions |
| `admins` | Self (UID match) | Nobody (Console only) | Admin role registry |

---

## Troubleshooting

**"Missing or insufficient permissions" error in the browser console**
→ Your Firestore security rules haven't been deployed yet. Complete Step 10.
→ Or your `admins/{uid}` document doesn't exist — recheck Step 9.

**Login says "Invalid email or password" but credentials are correct**
→ Make sure you created the user in Firebase Authentication (Step 8),
  not just in Firestore.

**The app loads but shows no data**
→ Check your `.env.local` values — a wrong `projectId` means the app is
  connecting to the wrong (or non-existent) Firebase project.

**"auth/configuration-not-found" error**
→ Email/Password authentication hasn't been enabled. Complete Step 4.

**Images fail to upload in the admin dashboard**
→ Firebase Storage hasn't been enabled. Complete Step 6.
→ Or Storage security rules haven't been deployed. Complete Step 10.

**`npm install` fails**
→ Make sure Node.js 18+ is installed: `node --version`
→ Try deleting `node_modules/` and `package-lock.json`, then run `npm install` again.

**Port 5173 already in use**
→ Run `npm run dev -- --port 3000` to use a different port.