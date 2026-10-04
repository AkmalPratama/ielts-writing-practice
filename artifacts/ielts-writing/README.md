# IELTS Writing Practice

IELTS Academic and General Training practice with original sample questions,
AI question generation, and estimated rubric feedback. No accounts or essay database.

## Use the app

Choose a module and task, write your answer, and optionally start the timer.
Drafts are saved in this browser only. Clearing site data or using private
browsing can remove drafts; export text to keep a copy.

“Generate with AI” and “Get feedback” require explicit cost/privacy confirmation.
Feedback assesses the submitted answer using four equally weighted criteria,
with evidence, strengths, and improvements. Bands are estimates, not official
IELTS results. “View sample feedback” remains an unrelated, labeled example.

## Scoring reliability

The rubric uses the public May 2023 IELTS Writing Band Descriptors, with
task-specific checks for process/chart overviews, letter bullet points and tone,
and essay relevance/argument development. Responses of 20 words or fewer are
Band 1 across all four criteria under the public descriptors; longer shortfalls
are assessed for demonstrated development and range, without an invented fixed
deduction. Evidence must be an exact substring of the submitted essay (layout
whitespace is ignored); unsupported quotes or inconsistent scores fail explicitly
without retrying. Quotation matching does **not** validate the AI's interpretation.

See [the scoring benchmark](docs/scoring-benchmark.md) and
[the quotation/comment audit](docs/scoring-audit.md) for paid comparison results
against four published examiner-rated answers and two original stress tests.
The sources publish overall task bands, **not individual criterion bands**.
Criterion-level diagnostic spreads and analyst interpretations of examiner
comments are not official criterion scores. This small, non-random check is not
an accuracy guarantee or a prediction of an actual IELTS test result.

## Approved AI and costs

The owner approved OpenAI `gpt-5-nano` via Replit AI Integrations. No personal API
key is required. Usage is paid from the owner's Replit credits at provider rates.
Listed prices reviewed during activation: $0.05 per million input tokens and
$0.40 per million output tokens; reasoning tokens count as output.
Rates can change. OpenAI marks this model deprecated; no automatic substitution.

There are at most **20 outbound AI attempts per day across the app**, resetting
at midnight Asia/Jakarta. Failed and verification calls count. Each call allows
at most 8192 completion tokens. SDK and frontend retries are disabled. There are
no background generation or assessment calls. This is not a dollar spending cap.

## Privacy and persistent storage

Essays stay in the browser unless assessment is explicitly confirmed. Assessment
sends the essay and task through Replit AI Integrations to OpenAI. The app does
not persist or log essay bodies; provider data policies still apply.

Generated prompts and the daily request counter are stored in PostgreSQL.
Atomic database reservations enforce the 20-attempt limit across concurrent
server instances. Database failures block provider calls. Development and
production have separate databases and counters; failed requests still count.
No learner identifiers, essay text, feedback, or credentials are stored in these tables.

The owner approved preparing live-AI publishing with a production database at
the explained usage-based hosting and database rates. Replit's Publish flow
applies the development schema to production; no startup/build-time migrations.
Publishing requires the owner's final action in Replit. Check publishing costs
and account spend limits there. Drafts from the preview browser origin do not
automatically move to the published origin; export important drafts first.

## Development

Use the configured app/API workflows. Endpoints live under `/api/writing`.
Run `pnpm run typecheck` for TypeScript checks.

Offline rubric checks (no paid requests):

```sh
cd artifacts/api-server
../../scripts/node_modules/.bin/tsx --test src/benchmarks/rubric.test.ts
```

Paid benchmark calls are manual only, require fresh explicit owner approval,
and count toward the same environment's database daily limit. Follow the manual
benchmark confirmation flags; never reset counters to make capacity available.
See the benchmark report
for reproduction instructions; do not add the paid runner to build/test scripts.