# Setup Guide

This project now uses a Firebase-first architecture (Auth + Firestore + optional Cloud Functions). There is no separate Node/Express server—everything runs from the client and Firebase services.

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (https://firebase.google.com)

## Firebase Setup

1. **Create a Firebase project**
   - Go to the Firebase console and create a project (enable Analytics if you want).
   - Enable **Authentication** (Email/Password), **Firestore**, and optionally **Storage**.

2. **Create a web app**
   - In Project settings → General → “Add app” → Web.
   - Copy the config values (apiKey, authDomain, etc.).

3. **Configure environment variables**
   - In `client/`, copy `env.example` to `.env` and paste your Firebase config:
     ```bash
     cd client
     cp env.example .env
     # update each VITE_FIREBASE_* value
     ```

4. **(Optional) Cloud Functions / PayFast**
   - Use Firebase Cloud Functions for any sensitive logic (admin actions, payment integrations).
   - Remember to secure Firestore with rules/custom claims.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

## Firebase Auth & Firestore Data

- Users are stored in Firestore (`/users/{uid}`) after registration.
- Products, orders, and dashboard stats live in Firestore collections (`/products`, `/orders`, etc.).
- Seed data using the provided script or via the Firebase console (see below).

## Sample Data / Seeding

1. Generate a Firebase service account key (Project settings → Service accounts → “Generate new private key”).
2. Save the JSON at the project root as `serviceAccountKey.json` (ignored by git) or set `FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/key.json`.
3. From the project root run:
   ```bash
   npm install
   npm run seed:products
   ```
   The script writes 50+ curated South African products into Firestore with keywords, pricing, and inventory.

## Security Rules (High Level)

Implement rules based on your needs, for example:

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    match /orders/{id} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

Use Firebase custom claims or role fields to protect admin operations.

## Deployment

- Deploy the React app to Vercel/Netlify or Firebase Hosting.
- Firebase services (Auth/Firestore/Functions) are already hosted by Google.

## Troubleshooting

- **Auth issues**: Ensure Firebase auth domain matches your local/deployed origin.
- **Firestore permissions**: Check security rules and indexes if queries fail.
- **Env variables**: Vite only exposes variables prefixed with `VITE_`.

With Firebase configured, the app can be developed and deployed without any standalone backend server.
