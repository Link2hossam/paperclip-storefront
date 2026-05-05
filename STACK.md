# Stack Decision

Chosen 2026-05-05 for the Paperclip storefront.

## Layer | Choice | Rationale

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15 (App Router)** | Industry standard for React storefronts. SSR/SSG, image optimization, API routes out of the box. Largest ecosystem of examples and libraries. |
| Host | **Vercel** | Zero-config deploy for Next.js. Preview deploys on every PR. Auto-deploy main on green CI. Edge functions for auth redirects. |
| Database | **Neon (Serverless Postgres)** | Branch-per-preview DB, serverless scale-to-zero, generous free tier. Drizzle ORM for type-safe queries. |
| Payments | **Stripe** | De facto standard. Checkout Sessions for quick integration, webhooks for fulfillment, Stripe Connect for marketplace if needed later. |
| Email | **Resend** | Modern API, React email templates, generous free tier. Simpler than SendGrid for transactional + marketing. |
| Analytics | **PostHog** | Product analytics + session replay + feature flags in one tool. Self-hostable option if needed. Free tier covers early scale. |

## Alternatives Considered

- **Remix** — Strong but smaller ecosystem. Next.js wins on hiring and examples.
- **Supabase** — Great DX but Neon's branching model is a better fit for preview deploys.
- **PlanetScale** — Pulled free tier; not worth the cost risk at this stage.
- **Plausible** — Lighter but no session replay or feature flags.

## CI / CD

- **GitHub Actions** runs lint, type-check, and tests on every push.
- **Vercel** auto-deploys `main` when CI is green (via Vercel GitHub integration, required status checks enabled).
- Preview deploys on every PR; Neon branches match.

## Runtimes

- Node 22 LTS
- TypeScript strict mode
