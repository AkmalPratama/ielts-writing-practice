# IELTS Writing Practice

A responsive study workspace for IELTS Academic and General Training writing. Read the task and write your answer in one place, with browser-saved drafts, a word count, a timer, original practice questions, and optional AI feedback.

**AI bands are practice estimates, not official IELTS scores.** This MVP has no accounts or payments. Sample feedback is explicitly labelled and does not assess your essay.

## Original build prompts

The following is the original idea prompt, followed by the detailed build prompt used for the app, reproduced as supplied.

### Initial idea

```text
i have idea that i want to build, however i am new to prompting and i don't have the knowledge to build the proper one. help me suggest the prompt. My idea is that i want to build web based application to help user practice ielts writing task What i have in mind is text editor like interface and user can see the writing task in one place. After user finish writing, it can give feedback based on ielts criteria. It also can generate writing topics question. Ask me if anything need to be cleared
```

### App-building prompt

```text
Build a polished, responsive web app called IELTS Writing Practice for people preparing for the IELTS Writing test.

PRODUCT
Help learners practise IELTS Academic and General Training writing. The main screen should have the writing task and an essay editor visible together on desktop, with a clear stacked layout on mobile.

MVP FEATURES
- Let the learner select Academic or General Training, then Writing Task 1 or Task 2.
- Generate original IELTS-style practice tasks on demand. Include appropriate Task 1 types: charts, tables, maps, processes for Academic; letters for General Training. Task 2 should include common essay question types. Clearly label generated tasks as practice, not official IELTS questions.
- Include a small set of sample practice tasks so the app is useful even before AI is configured.
- Provide an easy-to-use writing editor with a live word count, optional timer, clear/reset controls, and draft autosave in the browser.
- When the learner clicks “Get feedback,” assess the essay against the appropriate IELTS Writing criteria. Show estimated band scores from 0–9 for each criterion and an estimated overall band, with a short explanation, specific evidence from the learner’s essay, strengths, and the three most useful improvements.
- Use the criteria that apply to the selected task. Do not present scores as official IELTS results or guarantee score accuracy. Do not rewrite the whole essay unless the learner asks.

AI, COST, AND SECURITY REQUIREMENTS
- Before choosing or activating an AI provider, making any live AI request, or enabling a paid service, first tell me which provider/model you propose, how it is billed, and which app features will use it. Wait for my approval.
- While waiting, build the app with clearly labeled sample feedback and sample tasks. Do not pretend sample feedback is a real assessment.
- After I approve a provider, make AI calls only when the learner explicitly clicks “Generate task” or “Get feedback.” Never make background calls, automatically reassess, or retry a failed request without telling the learner.
- Show a clear notice before the first AI request explaining that the essay or task prompt will be sent to the selected AI provider and that usage may incur charges.
- Keep provider credentials on the server using Replit Secrets. Never put secrets in frontend code, commit them to the repository, or ask me to paste them into chat.
- Do not add paid databases, hosting services, subscriptions, or deployment steps without explaining their costs and asking first.
- Don’t store essays on the server. Keep drafts in the learner’s browser and provide a way to clear them.

DESIGN AND DELIVERY
Use a calm, focused study-workspace design with readable typography and minimal distractions. Make feedback easy to scan and usable on phones. Keep the MVP simple: no accounts or payments.
Before implementation, give me a short plan and identify any costs or approvals needed. Build and preview the app without deploying it. Include brief, plain-language instructions for running it and for enabling real AI feedback after I approve the provider.
```

The prompt records the original requirements, not a guarantee that every suggested question type is supported by live generation. See the app's available tasks and the [operating guide](artifacts/ielts-writing/README.md) for current behavior and limitations.

## How to use the app

1. Open the app and choose **Academic** or **General Training**, then **Task 1** or **Task 2**.
2. Choose a practice task or click **Next sample**. Academic Task 1 uses visual information; General Training Task 1 uses letters; Task 2 uses essays. These are practice questions, not official IELTS questions.
3. Read the instructions and write in the editor. The task and editor sit together on desktop and stack on smaller screens.
4. Watch the live word count. Task 1 asks for at least **150 words**, normally in **20 minutes**; Task 2 asks for at least **250 words**, normally in **40 minutes**. The timer is optional.
5. Drafts save in this browser. Use **Export text** to keep a separate copy. Clearing site data, switching browsers, or using private browsing can remove drafts. Use **Clear draft** or **Reset task** when you want to discard your work; read the confirmation first.
6. To request an original AI task, click **Generate with AI** and confirm the cost/privacy notice.
7. To assess your answer, click **Get feedback** and confirm submission. Review estimated criterion bands, evidence from your answer, strengths, and the three most useful improvements. Task 1 uses Task Achievement; Task 2 uses Task Response. Both also use Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.
8. If live AI is unavailable, continue with sample practice and the labelled sample feedback. Sample feedback is unrelated to your answer. Read the in-app guide for scoring and privacy limitations.

### AI costs and privacy

- The current approved provider is **OpenAI GPT-5 nano through Replit AI Integrations**. Live requests are paid; check current provider rates and Replit billing before enabling them in another workspace. Do not silently substitute a model.
- The app permits **20 AI attempts per calendar day across all learners in each environment**, resetting at midnight **Asia/Jakarta**. Failed attempts count. This request limit is not a guaranteed dollar spending cap.
- No background assessment, background generation, or automatic retries are made.
- Essays remain in browser storage unless you explicitly submit them for AI assessment. The server does not persist essay bodies; the AI provider processes submitted text under its own data policies. Avoid personal or sensitive information.
- PostgreSQL stores generated tasks and the daily usage counter, not essays. Database failures block paid calls. Development and production have separate counters.

## Run the project in Replit

The workspace uses **Node.js 24**, **pnpm**, **React/Vite**, **Express**, and **PostgreSQL with Drizzle ORM**.

1. Open the existing workspace, or import this private repository into a Replit account that has access to it.
2. Install dependencies if needed:

   ```sh
   pnpm install --frozen-lockfile
   ```

3. Confirm the PostgreSQL database and Replit AI Integrations are configured. A GitHub clone does **not** include database contents, secrets, or AI authorization. Obtain approval before enabling paid services in a new workspace.
4. Use Replit's configured workflows to start the frontend, API server, and slides. They supply the required ports and base paths.
5. Open the app preview at `/`. The API is mounted at `/api`, and the slide deck at `/ielts-project-overview/`.

### Development checks

```sh
pnpm run typecheck
```

The service manifests supply environment variables during managed builds. If manually building a frontend from the shell, supply its port and base path:

```sh
PORT=22879 BASE_PATH=/ pnpm --filter @workspace/ielts-writing run build
PORT=22039 BASE_PATH=/ielts-project-overview/ pnpm --filter @workspace/ielts-project-overview run build
pnpm --filter @workspace/api-server run build
```

The API starts with:

```sh
PORT=8080 NODE_ENV=production pnpm --filter @workspace/api-server run start
```

These commands alone do not replace the shared router. Outside Replit, configure a reverse proxy to route `/api` to Express, `/` to the built app, and `/ielts-project-overview/` to the built slides, with SPA fallbacks for the frontends. This repository's primary publishing setup is Replit.

## How to deploy on Replit

**Publishing, database usage, and live AI may incur charges.** Review the current rates and obtain the owner's approval before publishing or enabling paid services. A GitHub commit does not publish the app.

1. **Check the preview.** Confirm sample practice, draft saving, exporting, and the slide deck work. Run the offline checks above. Do not run paid AI benchmarks as part of a build.
2. **Open Replit's Publishing tool.** Use the existing **Autoscale** application configuration. The artifact manifests define the API service and static frontend builds; preserve their routing rather than replacing the setup with one Vite preview server.
3. **Review the production database.** Configure the separate production PostgreSQL database and inspect the schema changes presented during publishing. Apply only the intended schema changes through that flow. Do not run the development schema-push command against production or add migrations to server startup.
4. **Review production secrets and AI configuration.** Ensure the API has `DATABASE_URL` and the server-side Replit AI Integration configuration (`AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY`). Manage them through Replit's secure configuration; do not copy values into the README, source files, browser code, or GitHub. The imported repository does not provision these automatically.
5. **Review costs, visibility, and service settings.** The API production command is `node --enable-source-maps artifacts/api-server/dist/index.mjs`; its startup health check is `/api/healthz`. The app's built files are in `artifacts/ielts-writing/dist/public`, and the slides' built files in `artifacts/ielts-project-overview/dist/public`. The manifests define their build commands and routes.
6. **Publish using Replit's Publish action.** The owner makes the final publishing decision. Inspect the build and startup logs if publishing fails.
7. **Check the published URL shown by Replit.** Open `/` for the app, `/api/healthz` for API health, and `/ielts-project-overview/` for the slides. Check the in-app AI setup status before deliberately making any paid request.
8. **Protect drafts before switching origins.** Preview drafts do not automatically move to the published site. Export important answers before switching.
9. **Publish again after later code changes** when you want them live. Committing to GitHub alone does not update the published app.

Official references: [Publishing](https://docs.replit.com/features/publishing/overview), [development and production databases](https://docs.replit.com/features/data-and-storage/development-and-production), [Secrets](https://docs.replit.com/core-concepts/project-editor/app-setup/secrets), and [Replit AI Integrations](https://docs.replit.com/features/integrations/replit-ai-integrations).

## Project overview slides

The editable nine-slide deck is committed in [`artifacts/ielts-project-overview`](artifacts/ielts-project-overview).

It covers the product, practice coverage, learner workflow, writing workspace, AI feedback, scoring limits, privacy, AI cost safeguards, and publishing readiness.

In the running workspace or published application, open `/ielts-project-overview/`. The deck uses the app's visual style and screenshots.

Download the [nine-slide PDF overview](docs/ielts-writing-project-overview.pdf). The editable source remains in the slides directory; no PowerPoint export is included.

## Repository layout

| Directory | Purpose |
| --- | --- |
| `artifacts/ielts-writing` | Learner-facing React app and detailed operating documentation |
| `artifacts/api-server` | Express API, original practice tasks, AI feedback, and offline scoring checks |
| `artifacts/ielts-project-overview` | Editable nine-slide project overview |
| `artifacts/mockup-sandbox` | Design/component previews |
| `lib/api-spec`, `lib/api-client-react`, `lib/api-zod` | API contract, generated client, and validation |
| `lib/db` | PostgreSQL schema and database access |

See the [detailed operating guide](artifacts/ielts-writing/README.md), [scoring benchmark](artifacts/ielts-writing/docs/scoring-benchmark.md), and [quotation audit](artifacts/ielts-writing/docs/scoring-audit.md) for additional limitations and safeguards.