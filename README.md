# Advanced B2B Billing & SaaS Starter

A robust, production-ready starter kit for building B2B SaaS applications. Built with **Next.js 16**, **Stripe**, **Drizzle ORM**, and **Tailwind CSS**, this project implements advanced billing patterns, multi-tenancy, and team management out of the box.

## 🚀 Features

- **Multi-Tenancy Architecture**: Built-in support for Organizations and Members.
- **Advanced Billing with Stripe**:
  - Subscription Management (Per-seat, Tiered).
  - **Usage-Based Billing**: Metered usage reporting to Stripe.
  - Customer Portal integration.
  - Resilient Webhook handling.
- **Team Management**:
  - Invite system with expiration.
  - Role-based access control (Owner, Admin, Member).
- **Modern Stack**:
  - Next.js 16 (App Router & Server Actions).
  - TypeScript & Strict Type Safety.
  - Drizzle ORM with PostgreSQL.
  - Authentication via NextAuth.js (v5).
  - UI Components with Tailwind CSS & Radix UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **Auth**: [Auth.js (NextAuth)](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🏁 Getting Started

### 1. Prerequisites

- Node.js 18+ installed.
- A PostgreSQL database (local or hosted e.g., Neon, Supabase).
- A Stripe account with test mode API keys.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd b2b-billing
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp env.example .env
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/b2b_billing"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Authentication
# Generate a secret: npx auth secret
AUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

Push the schema to your database:

```bash
npx drizzle-kit push
```

### 5. Running the App

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 💳 Stripe Setup

1.  **Create Products**: In your Stripe Dashboard, create your subscription products.
2.  **Webhooks**:
    -   Use the Stripe CLI to forward webhooks locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
    -   Copy the Signing Secret (`whsec_...`) to your `.env` file.
    -   Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.

## 📂 Project Structure

- `actions/`: Server Actions for business logic (Billing, Org management).
- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utilities, Database configuration, and Schema definitions.
- `drizzle/`: Database migration files.

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.

## 📄 License

This project is licensed under the MIT License.
