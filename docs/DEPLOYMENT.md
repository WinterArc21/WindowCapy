# Deployment (Vercel CI)

This repository includes a GitHub Action that deploys to Vercel for preview PRs and on pushes to `main` (production).

Setup steps:
1) Create/import the project in Vercel (connect GitHub repo `WinterArc21/WindowCapy`).
2) In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (e.g. https://window.example.com)
3) In Vercel Project Settings → General, copy `ORG_ID` and `PROJECT_ID`.
4) In GitHub repo Settings → Secrets and variables → Actions, add secrets:
   - `VERCEL_TOKEN` (create at vercel.com → Account Settings → Tokens)
   - `VERCEL_ORG_ID` (from step 3)
   - `VERCEL_PROJECT_ID` (from step 3)

After secrets are set:
- Opening/Updating a PR → preview deployment URL in Actions logs and Vercel dashboard.
- Merging to `main` → production deployment.

Notes:
- Audio bucket is private; playback uses Storage signed URLs from server routes.
- Moderation queue requires JWT claim `role=moderator` to list/update reports (see SQL policies).
