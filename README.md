# CitySen

CitySen is a modern single-page application that delivers real-time situational awareness for cities. The project is built with Next.js 14, Tailwind CSS, shadcn/ui primitives, MapLibre GL, React Query, Prisma, and NextAuth.

## Getting started

```bash
pnpm install
pnpm dev
```

Set the following environment variables in `.env`:

```
DATABASE_URL=postgresql://user:password@host:5432/citysen
NEXTAUTH_SECRET=your-secret
EMAIL_SERVER_HOST=smtp.example
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=secret
EMAIL_FROM=CitySen <notifications@citysen.example>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_MAPTILER_KEY=your-maptiler-key
```

After configuring the database, run the migrations and seed script:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

## Features

- Landing page with marketing content and hero illustration.
- Full-screen map experience with search, geolocation, heatmap overlay, and incident layer.
- Sidebar filters synchronized with URL state and map viewport.
- Incident details drawer with media gallery and source link.
- API routes for incidents, categories, bookmarks, alerts, and heatmap statistics.
- Admin dashboard for managing incidents and categories.
- Prisma schema and seed data for demo content.
- Test harness configured with Vitest and Playwright.

## Scripts

- `pnpm dev` – Run Next.js in development mode.
- `pnpm build` – Build the application for production.
- `pnpm start` – Start the production build.
- `pnpm test` – Run unit tests with Vitest.
- `pnpm test:e2e` – Execute Playwright end-to-end tests.

## Folder structure

```
app/             # Next.js App Router pages and layouts
components/      # Reusable UI and map components
lib/             # Utilities, data hooks, and Prisma helpers
prisma/          # Prisma schema and seed data
public/          # Static assets
```
