/** Offline report generation. No AI imports, requests, credentials or retries. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { cases } from "./cases";

interface RecordResult {
  id: string;
  wordCount: number;
  error?: string;
  feedback?: {
    overallBand: number;
    criteria: { name: string; band: number; evidence: string; explanation: string }[];
  };
  exactEvidence?: boolean[];
  productionValid?: boolean;
  overallDeviation?: number | null;
  criterionMinusPublishedOverall?: number[] | null;
  commentRangeDistance?: number[] | null;
}
interface Run {
  phase: string; model: string; startedAt: string; initialRemaining: number;
  finalRemaining: number; records: RecordResult[];
}
const resultsDir = resolve(import.meta.dirname, "results");
const runs: Run[] = ["baseline", "revised"].map(phase =>
  JSON.parse(readFileSync(resolve(resultsDir, `${phase}.json`), "utf8")));
if (runs.some(r => r.records.length !== cases.length)) throw new Error("Incomplete run: do not report it as a complete comparison.");
const mean = (a: number[]) => a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;
const fmt = (n: number | null | undefined) => n == null ? "n/a" : n.toFixed(2);
const sign = (n: number) => `${n > 0 ? "+" : ""}${n}`;
const metrics = runs.map(r => {
  const rated = r.records.filter(v => v.feedback && v.overallDeviation != null);
  const criteria = [0, 1, 2, 3].map(i => ({
    criterionIndex: i,
    meanCriterionMinusPublishedOverall: mean(rated.map(v => v.criterionMinusPublishedOverall![i]!)),
    meanAbsoluteCommentRangeDistance: mean(rated.map(v => Math.abs(v.commentRangeDistance![i]!))),
  }));
  const quotes = r.records.flatMap(v => v.exactEvidence ?? []);
  return {
    phase: r.phase, attempts: r.initialRemaining - r.finalRemaining,
    failures: r.records.filter(v => v.error).length,
    ratedCount: rated.length,
    meanAbsoluteOverallDeviation: mean(rated.map(v => Math.abs(v.overallDeviation!))),
    meanSignedOverallDeviation: mean(rated.map(v => v.overallDeviation!)),
    withinHalfBand: rated.filter(v => Math.abs(v.overallDeviation!) <= 0.5).length,
    exactQuotations: quotes.filter(Boolean).length, totalQuotations: quotes.length,
    productionAccepted: r.records.filter(v => v.productionValid).length,
    criteria,
  };
});
let report = `# IELTS scoring benchmark

## Scope and safeguards

Run dates (UTC): ${runs.map(r => `${r.phase}: ${r.startedAt}`).join("; ")}.
Model: **gpt-5-nano**, low reasoning, maximum 8192 completion tokens per attempt.
Owner approved up to 16 paid verification calls after a cost explanation.
Only 12 remained in the existing Jakarta ledger, so the batch was reduced to
six inputs assessed once with each prompt. Attempts used:
**${metrics.reduce((n, m) => n + m.attempts, 0)}**. No retries, model changes, cap increases,
paid storage or publishing. The API workflow was stopped while the single-process
benchmark used the same durable preview ledger. No learner essays were used.

The four published answers cover Academic and General Training, Tasks 1 and 2.
The additional off-topic and 15-word answers are ORIGINAL SYNTHETIC stress tests,
not examiner-rated examples. Neither has an invented examiner overall band.
Published bands in the final set range from 5 to 7.5.
Original plans for a school-travel chart were replaced with a process whose full
source diagram could be visually verified.

## What the numbers mean

- Overall deviation = rounded practice estimate minus published **task overall** band.
  MAE = mean absolute overall deviation, over successful published-answer assessments only.
  These are RAW model scores, including responses that the production validator would
  reject. They are not a measure of delivered feedback or its availability.
- **Individual examiner criterion bands are not published in these sources.**
  True per-criterion error/MAE cannot be measured from them.
- Criterion-minus-overall is reported as a diagnostic spread, NOT criterion accuracy.
- Analyst comment ranges were declared in cases.ts before the calls, by interpreting
  the examiner's prose using the public descriptors. Signed range distance is zero
  inside that range, otherwise the signed difference to its nearest endpoint.
  These ranges are NOT examiner ratings or independent calibration targets.
  Mean absolute range distance quantifies alignment with this analyst interpretation only.
- Exact evidence checks ignore layout whitespace and a single outer quote pair.
  Spelling, case and punctuation are not corrected. Quote existence does not prove
  that the explanation supports its band: see the separate human-readable audit.
- One stochastic response per input/prompt, a very small non-random set, historical
  examiner ratings, handwritten transcription and text-encoded visual input:
  **no accuracy guarantee, significance claim, confidence interval or official score**.
  The same inputs were used to develop/check the prompt, not a held-out test.

## Final offline-only follow-up changes

The tables below compare the frozen baseline against the PAID-TESTED revised
candidate. Its exact system prompts are archived in tested-revised-prompts.json
and verified against the recorded hashes by offline tests.

After those 12 attempts exhausted the daily allowance, final production guidance
was separated by active task type to prevent Task 1 overview requirements leaking
into Task 2, and to remind the letter assessor that addresses/dates are not required.
Those final prompt refinements were **not paid-tested**; do not attribute the
measured improvement to this final version. A deterministic feedback-item check
also now rejects blank/punctuation-only items and invalid counts, rather than
showing malformed model output. No new call was made for these changes.

## Overall comparison (raw candidate outputs, before rejection)

| Phase | Published answers assessed | Overall MAE | Signed mean deviation | Within ±0.5 | Exact quotations | Accepted by current validator | Failed attempts |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
`;
for (const m of metrics) report += `| ${m.phase} | ${m.ratedCount} | ${fmt(m.meanAbsoluteOverallDeviation)} | ${fmt(m.meanSignedOverallDeviation)} | ${m.withinHalfBand}/${m.ratedCount} | ${m.exactQuotations}/${m.totalQuotations} | ${m.productionAccepted}/${cases.length} | ${m.failures} |\n`;
report += `\n| Input | Words | Published task overall | Baseline | Revised | Baseline deviation | Revised deviation |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: |\n`;
for (const c of cases) {
  const [b, r] = runs.map(run => run.records.find(v => v.id === c.id)!);
  report += `| ${c.id} | ${b!.wordCount} | ${c.publishedOverall ?? "not rated"} | ${b!.feedback?.overallBand ?? "failed"} | ${r!.feedback?.overallBand ?? "failed"} | ${b!.overallDeviation == null ? "n/a" : sign(b!.overallDeviation)} | ${r!.overallDeviation == null ? "n/a" : sign(r!.overallDeviation)} |\n`;
}
report += `\n## Criterion-level diagnostics (not examiner criterion errors)\n\nOrder: TA/TR, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy.\n\n| Phase | Criterion | Mean criterion minus published overall (diagnostic only) | Mean absolute distance outside analyst comment range |\n| --- | --- | ---: | ---: |\n`;
for (const m of metrics) for (const c of m.criteria) {
  report += `| ${m.phase} | ${["TA/TR", "CC", "LR", "GRA"][c.criterionIndex]} | ${fmt(c.meanCriterionMinusPublishedOverall)} | ${fmt(c.meanAbsoluteCommentRangeDistance)} |\n`;
}
report += `\n### Per-input detail\n\n| Input | Analyst ranges (TA/TR, CC, LR, GRA) | Baseline bands | Revised bands | Baseline signed range distances | Revised signed range distances |\n| --- | --- | --- | --- | --- | --- |\n`;
for (const c of cases) {
  const [b, r] = runs.map(run => run.records.find(v => v.id === c.id)!);
  report += `| ${c.id} | ${c.commentRanges?.map(v => v.join("–")).join(", ") ?? "not rated"} | ${b!.feedback?.criteria.map(v => v.band).join(", ") ?? "failed"} | ${r!.feedback?.criteria.map(v => v.band).join(", ") ?? "failed"} | ${b!.commentRangeDistance?.map(sign).join(", ") ?? "n/a"} | ${r!.commentRangeDistance?.map(sign).join(", ") ?? "n/a"} |\n`;
}
report += `\n## Source and transcription notes\n\n`;
for (const c of cases) {
  report += `- **${c.id}**: ${c.sourceLocation}; ${c.source}. ${c.notes ?? ""}\n`;
}
report += `\n## Reproducing this work\n
Raw responses, input hashes, prompt hashes, validation decisions and numeric
diagnostics are in artifacts/api-server/src/benchmarks/results/.
Do not rerun paid assessments as part of a build or test.
The runner's revised phase uses the CURRENT production prompt; reproducing the
historical candidate requires the archived tested-revised-prompts.json instead.

Offline tests (no paid calls):

    cd artifacts/api-server
    ../../scripts/node_modules/.bin/tsx --test src/benchmarks/rubric.test.ts
    ../../scripts/node_modules/.bin/tsx src/benchmarks/summarise.ts

A fresh PAID run needs new explicit owner approval, enough existing daily capacity,
and the managed API workflow stopped to avoid parallel ledger access. The runner
refuses existing result files to prevent accidental repeat spending. Archive old
results deliberately, never delete/reset the usage ledger. Then run one phase:

    ../../scripts/node_modules/.bin/tsx src/benchmarks/run.ts --consent-paid --api-stopped --phase=baseline

For the revised phase use --phase=revised, then restart the managed API workflow.
Do not increase limits, swap models, retry failed calls or publish without approval.
`;
const docsDir = resolve(import.meta.dirname, "../../../ielts-writing/docs");
mkdirSync(docsDir, { recursive: true });
writeFileSync(resolve(docsDir, "scoring-benchmark.md"), report);
writeFileSync(resolve(resultsDir, "metrics.json"), JSON.stringify(metrics, null, 2));
process.stdout.write(JSON.stringify(metrics, null, 2) + "\n");