# IASO Med Deployment

## Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the Project URL and anon public key from Project Settings -> API.
4. Add them to Vercel as environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY` optional

## Vercel

Import this GitHub repo into Vercel.

Settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` already includes React Router fallback routing.
