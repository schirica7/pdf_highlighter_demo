# Edexia Grounded Feedback Prototype

Vite + React prototype for a grounded-feedback workflow with a PDF inspection modal.

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Actions

This repo includes:

- `.github/workflows/ci.yml` for install + build checks
- `.github/workflows/vercel-preview.yml` for non-`main` preview deployments
- `.github/workflows/vercel-production.yml` for `main`/`master` production deployments
