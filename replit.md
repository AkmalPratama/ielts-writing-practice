# IELTS Writing Practice

A focused web workspace for IELTS Academic and General Training writing practice.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/ielts-writing run dev` — web app (configured workflow supplies port)
- PostgreSQL stores only generated prompts and daily usage counts; essays are never stored. AI credentials are provisioned server-side by Replit AI Integrations.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ielts-writing` — frontend and learner drafts (browser storage)
- `artifacts/api-server/src/routes/writing.ts` — task library and consent-gated AI endpoints
- `lib/api-spec/openapi.yaml` — API contract
- `artifacts/ielts-writing/README.md` — operation, privacy, and AI activation instructions

## Architecture decisions

- The owner approved OpenAI GPT-5 nano at listed rates of $0.05/1M input and $0.40/1M output tokens, with 20 AI attempts per Jakarta calendar day across the app. Do not substitute models or increase limits without approval.
- Usage reservations are atomic PostgreSQL increments, shared by every instance in each environment. Failed requests count. No automatic retries. Database failure blocks paid calls.
- No server essay persistence or accounts in this MVP: minimise complexity and preserve learner privacy.
- Demo feedback is a static example, not a simulated assessment of a learner's essay.

## Product

Task selection for both modules, Task 1 visual/letter exercises, Task 2 essays, draft editor, word counts, timer, browser autosave, and explicitly labelled sample feedback.

## User preferences

- Explain costs and obtain approval before enabling paid AI, databases, hosting, subscriptions, or deployment.
- The owner subsequently approved preparing live-AI publishing with a production database after hosting/database rates were explained. The owner makes the final publish action in Replit.
- Choose a fast, inexpensive model; never silently claim sample scores assess the learner's writing.
- No background AI requests, automatic reassessment, or silent retries.
- No credentials in frontend code or chat. Essays stay in the browser unless explicit live-AI processing is approved.

## Gotchas

- Re-run API codegen after contract changes.
- Replit AI Integrations usage is separate from Agent mode usage; do not describe it as free.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
