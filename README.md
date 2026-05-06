# Luxantara Trading Journal

Mobile-first trading journal dashboard inspired by the provided TraderWaves references. It is deployable as a static Vercel app and includes a Supabase schema for persistence.

## Run locally

Open `index.html` directly for the UI, or run a static server:

```bash
npx serve .
```

## Deploy to Vercel

Import this repository in Vercel. The included `vercel.json` serves `index.html` for app routes, and `api/config.js` exposes the Supabase public config from Vercel environment variables.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel environment variables.
4. Deploy. The app will read the public Supabase config from `/api/config`.
