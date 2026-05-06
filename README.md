# Luxantara Trading Journal

Mobile-first TypeScript Next.js trading journal inspired by the provided TraderWaves references. It includes dashboard, accounts, journal trade history, daily journal editor, journal library, templates, and tag management screens. It is deployable on Vercel and includes a Supabase schema for persistence.

## Run locally

Install dependencies and run Next.js:

```bash
npm install
npm run dev
```

## Deploy to Vercel

Import this repository in Vercel. The included `vercel.json` marks the project as Next.js, and `app/api/config/route.ts` exposes the Supabase public config from Vercel environment variables.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables.
4. Deploy. The app will read the public Supabase config from `/api/config`.
