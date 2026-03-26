# Edexia Grounded Feedback Prototype

Vite + React prototype for a grounded PDF-highlighting workflow that now includes a server-side OpenAI call for quote-based stimulus generation.

## Local development

```bash
npm ci
cp .env.example .env
# add your OPENAI_API_KEY to .env
npm run dev
```

`npm run dev` now starts a small local Node server that mounts the OpenAI API route and serves the frontend through Vite on `http://localhost:5173`.

Required env vars:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` optional, defaults to `gpt-5-mini`
- `OPENAI_IMAGE_MODEL` optional, defaults to `gpt-image-1`

## Vercel deployment

The same API route still deploys on Vercel. Add the same environment variables in the Vercel project settings.

## Production build

```bash
npm run build
```

## GitHub Actions

This repo includes:

- `.github/workflows/ci.yml` for install + build checks
- `.github/workflows/vercel-preview.yml` for non-`main` preview deployments
- `.github/workflows/vercel-production.yml` for `main`/`master` production deployments
