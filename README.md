# Payment Links

A fullstack project for creating and sharing payment links. Built to learn backend fundamentals like HTTP requests, middleware, authentication, jwt, and database operations.

Neon is picked due to it's lightweight and close to SQL syntax

## Tech Stack

**Backend** — Express 5, TypeScript, Drizzle ORM, Neon PostgreSQL, JWT, bcrypt

**Frontend** — Next.js 16, React 19, Tailwind CSS 4, shadcn/ui

## Features

- User registration and login with hashed passwords (bcrypt) and JWT tokens
- Full CRUD for payment links (create, read, update, delete)
- Search links by product name or link code
- Auth middleware protecting link routes
- Public shareable payment pages (`/pay/:linkCode`)
- Auto-generated unique link codes with nanoid
- Server-rendered payment pages with OpenGraph metadata

## Project Structure

```
payment-links-backend/
├── backend/
│   └── src/
│       ├── index.ts              # Express app entry point
│       ├── middleware/auth.ts     # JWT authentication middleware
│       ├── db/
│       │   ├── index.ts          # Drizzle + Neon database connection
│       │   └── schema/           # Table definitions (users, links)
│       └── routes/
│           ├── register.ts       # POST /api/v1/register
│           ├── login.ts          # POST /api/v1/login
│           ├── create-links.ts   # POST /api/v1/links
│           ├── get-links.ts      # GET /api/v1/links, /search, /:linkCode
│           ├── update-links.ts   # PUT /api/v1/links/:linkCode
│           ├── delete-links.ts   # DELETE /api/v1/links/:linkCode
│           └── public-link.ts    # GET /api/v1/pay/:linkCode (no auth)
└── frontend/
    ├── app/
    │   ├── page.tsx              # Login / Register
    │   ├── dashboard/page.tsx    # Link management dashboard
    │   └── pay/[linkCode]/page.tsx  # Public payment page
    ├── components/
    │   ├── ui/                   # Reusable UI (Button, Input)
    │   └── dashboard/            # Dashboard components (LinkCard, LinkForm, SearchBar)
    ├── context/auth-context.tsx   # Auth state provider
    └── lib/
        ├── api.ts                # Fetch helper with JWT auth
        └── types.ts              # Shared TypeScript interfaces
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/register` | No | Create a new user |
| POST | `/api/v1/login` | No | Login, returns JWT token |
| GET | `/api/v1/links` | Yes | Get all links |
| GET | `/api/v1/links/search?q=` | Yes | Search links by name or code |
| GET | `/api/v1/links/:linkCode` | Yes | Get a single link |
| POST | `/api/v1/links` | Yes | Create a new payment link |
| PUT | `/api/v1/links/:linkCode` | Yes | Update a link |
| DELETE | `/api/v1/links/:linkCode` | Yes | Delete a link |
| GET | `/api/v1/pay/:linkCode` | No | Public link for customers |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=3001
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key
```

Push the database schema and start the server:

```bash
npx drizzle-kit push
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.
