# Infinite 7 Impex - Client Application

Modern React web client for Infinite 7 Impex, built with React 19, TypeScript, Vite, Tailwind CSS v4, and Zod.

## Tech Stack

- **Framework**: React 19 with Vite 8
- **Language**: TypeScript (with strict types & erasable syntax compliance)
- **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite`)
- **Validation**: Zod (runtime validation & type inference)
- **Icons**: Lucide React
- **Linter**: Oxlint

## Folder Structure

```
client/src/
├── assets/                  # Static assets (images, icons, svgs)
├── components/
│   ├── common/              # Reusable UI primitives (Button, Badge, Card, Spinner)
│   ├── feedback/            # Alerts, toasts, and dialogs
│   └── layout/              # Structural components (Navbar, Footer, Shell)
├── config/                  # Environment variables and application constants
│   └── env.ts               # Validated env settings (API Base URL)
├── hooks/                   # Custom reusable React hooks
├── pages/                   # Application pages / views (HomePage)
├── services/                # API client layer
│   ├── api-client.ts        # Type-safe fetch client with error handling
│   └── endpoints.ts         # Centralized endpoint definitions matching server
├── types/                   # Zod schemas and inferred TypeScript types
│   ├── api.ts               # Standard API response envelope & pagination
│   ├── auth.ts              # Admin login credentials schema
│   ├── customer.ts          # Customer enquiry schema & model
│   ├── category.ts          # Product category schema & model
│   ├── product.ts           # Product schema & populated models
│   ├── blog.ts              # Blog post & section schemas
│   └── index.ts             # Central types re-export
├── utils/                   # Helper functions (cn class combiner)
├── App.tsx                  # Root application component
├── index.css                # Tailwind CSS v4 entry & base styling
└── main.tsx                 # Application entry point
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `client/` directory (or copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build & Linting
```bash
npm run build     # Type-check and compile production bundle
npm run lint      # Run Oxlint checks
npm run preview   # Preview production build locally
```
