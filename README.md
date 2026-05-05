# Paperclip Storefront

The public-facing storefront for Paperclip.

## Stack

See [STACK.md](./STACK.md) for the full tech stack and rationale.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## CI / Deploy

- **CI**: GitHub Actions runs typecheck, lint, and build on every push to `main` and every PR.
- **Deploy**: Vercel auto-deploys `main` when CI passes. Preview deploys on every PR.

## One-Time Setup (after pushing this repo)

1. Create a new GitHub repo (e.g. `paperclipai/storefront`) and push this code.
2. Connect the repo to Vercel. Enable "Require CI checks to pass before deploy" in Vercel project settings.
3. Set the Vercel project root directory to `./` (default).
4. Verify: push a commit to `main`, confirm CI goes green, then confirm Vercel deploys to the public URL.
