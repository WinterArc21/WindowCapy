# Window — Social Media for Real Lives

Warm, minimalist social sharing that celebrates real life. Built with Next.js 14, TypeScript, Tailwind, and Supabase (auth, database, storage).

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase: Auth, Postgres, RLS, Storage (images public, audio private signed URLs)
- Fonts: Nunito Sans via `next/font`

## Getting started (local)
1. Clone and install deps
   ```bash
   npm install
   # or bun install
   ```
2. Copy envs
   ```bash
   cp .env.example .env.local
   # Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
3. Run dev server
   ```bash
   npm run dev
   ```

## Supabase setup
1. Create a new Supabase project.
2. Apply SQL migration:
   - In the Supabase SQL editor, run `supabase/migrations/000_init.sql`.
3. Create storage buckets:
   - The migration inserts `images` (public) and `audio` (private) buckets.
4. Auth settings:
   - Enable email/password auth.
5. JWT/roles:
   - Moderators require a JWT custom claim `role=moderator` to access reports.

## Environment variables
See `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (defaults to http://localhost:3000)
- Optional: `POSTHOG_API_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (placeholders only)

## App structure
- `app/(feed)/page.tsx` — Home feed (Random, Following)
- `app/(feed)/story/[id]/page.tsx` — Story detail
- `app/compose/page.tsx` — Compose (text + image + audio)
- `app/(auth)/login`, `app/(auth)/register` — Authentication
- `middleware.ts` — Auth guard for protected routes
- `components/ui/*` — UI primitives
- `components/story/*` — Story components
- `lib/*` — Supabase clients, storage utils, blocklist
- `supabase/migrations/*.sql` — Schema + RLS

Planned (MVP scope, in progress):
- Profiles & follow system, reactions, comments, collections, resonate
- Moderation (reports, queue)
- Server actions and API route handlers for core entities

## Deployment (Vercel)
1. Connect this GitHub repo on Vercel.
2. Set Environment Variables for the project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Build command: `npm run build` (default). Output: Next.js app.
4. Add a Supabase database and apply `supabase/migrations/000_init.sql`.

## Audio diaries (beta)
- Uses MediaRecorder API to capture webm in supported browsers (Chromium-based).
- iOS/Safari support is limited; consider fallbacks.
- Audio stored privately; the app requests signed URLs for playback.

## Development scripts
- `npm run dev` – local dev
- `npm run build` – production build
- `npm run start` – start server
- `npm run lint` – ESLint
- `npm run typecheck` – TypeScript noEmit
- `npm run test` – Vitest unit tests

## Accessibility & theming
- Nunito Sans applied globally via `next/font`.
- Warm palette mapped to CSS variables and Tailwind theme tokens.
- Visible focus rings and keyboard-friendly components.

---
This is an early MVP scaffold. Contributions and issues welcome.
