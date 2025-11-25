# South African E-commerce Platform

Full-stack e-commerce platform with customer storefront and separate admin dashboard, built for South African market with local payment integration.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- Zustand
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod
- Axios
- Lucide React

### Backend / Cloud
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- (Optional) Firebase Cloud Functions
- PayFast integration via callable functions

## Project Structure

```
sa-ecommerce/
├── client/          # React Frontend
├── server/          # Express Backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Auth + Firestore enabled)
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
cp env.example .env
# Paste your Firebase config values
npm run dev
```

## Environment Variables

See `client/env.example` for the required Firebase configuration keys.

## Sample Data / Seeding

1. Create a Firebase service account (Project settings → Service accounts → Generate new private key).
2. Save the JSON file at the project root as `serviceAccountKey.json` (or set `FIREBASE_SERVICE_ACCOUNT_PATH` to its location).
3. Install root dependencies and run the seed script:
   ```bash
   npm install
   npm run seed:products
   ```
   This populates the `products` collection in Firestore with 50+ South African-specific items.

## Features

### Customer Site
- Homepage with featured products
- Shop with filters and search
- Product detail pages
- Shopping cart
- Checkout with PayFast
- Order history
- User account management

### Admin Dashboard
- Dashboard with statistics
- Product management (CRUD)
- Order management
- Customer management
- Sales analytics

## South African Features
- ZAR currency (R)
- PayFast payment integration
- South African provinces
- Local shipping options
- Popular SA brands

## Deployment

- Frontend: Vercel / Netlify / Firebase Hosting
- Backend logic: Firebase (Auth + Firestore + optional Cloud Functions)

## License

MIT


