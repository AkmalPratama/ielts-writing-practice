/**
 * Manual PAID benchmark. Database reservations share the environment's daily cap.
 * Run from artifacts/api-server with --consent-paid --api-stopped --phase=baseline|revised.
 * Six calls per phase, zero retries. Never invoked by dev/build/test scripts.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { batchProcess } from "@workspace/integrations-openai-ai-server/batch";
import { assessEssayWithPrompt, MODEL } from "../lib/writing-ai";
import { remainingRequests } from "../lib/writing-state";
import { assessmentPrompt, evidenceIsExact, validateAssessment, validateFeedbackItems, wordCount } from "../lib/writing-rubric";
import { baselinePrompt } from "./baseline-prompt";
import { cases } from "./cases";

const phase = process.argv.find(a => a.startsWith("--phase="))?.split("=")[1];
if (!["baseline", "revised"].includes(phase ?? "") ||
  !process.argv.includes("--consent-paid") || !process.argv.includes("--api-stopped") ||
  !existsSync("src/benchmarks/cases.ts")) {
  throw new Error("Run from artifacts/api-server, after explicit paid approval and stopping its workflow, with --consent-paid --api-stopped --phase=baseline|revised.");
}
const outDir = resolve("src/benchmarks/results");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, `${phase}.json`);
if (existsSync(outPath)) throw new Error("Results already exist. Refusing an accidental paid rerun.");
if (await remainingRequests() < cases.length) throw new Error("Not enough requests remain; daily cap unchanged.");
const records: object[] = [];
const results = { phase, model: MODEL, startedAt: new Date().toISOString(),
  reasoningEffort: "low", maxCompletionTokens: 8192, retries: 0,
  initialRemaining: await remainingRequests(), records };
// Persist before and after every call so interruption cannot cause a silent rerun.
writeFileSync(outPath, JSON.stringify(results, null, 2));
await batchProcess(cases, async c => {
  const system = phase === "baseline" ? baselinePrompt(c.task) : assessmentPrompt(c.task);
  const record: Record<string, unknown> = {
    id: c.id, wordCount: wordCount(c.essay), publishedOverall: c.publishedOverall,
    promptSha256: createHash("sha256").update(system).digest("hex"),
    inputSha256: createHash("sha256").update(JSON.stringify({task: c.task, essay: c.essay})).digest("hex"),
  };
  try {
    // Reference scores/comments NEVER go to the model.
    const feedback = await assessEssayWithPrompt(c.task, c.essay, system, phase === "revised");
    const exactEvidence = feedback.criteria.map(v => evidenceIsExact(c.essay, v.evidence));
    let productionValid = true;
    try {
      validateAssessment(c.task, c.essay, feedback.criteria);
      validateFeedbackItems(feedback);
    } catch { productionValid = false; }
    Object.assign(record, {
      feedback, exactEvidence, productionValid,
      overallDeviation: c.publishedOverall === null ? null : feedback.overallBand - c.publishedOverall,
      // Diagnostic spread ONLY; the published overall is NOT an individual criterion score.
      criterionMinusPublishedOverall: c.publishedOverall === null ? null :
        feedback.criteria.map(v => v.band - c.publishedOverall!),
      // Quantifies alignment to PREDECLARED analyst ranges from examiner prose, not accuracy.
      commentRangeDistance: c.commentRanges === null ? null : feedback.criteria.map((v, i) => {
        const [lo, hi] = c.commentRanges![i]!;
        return v.band < lo ? v.band - lo : v.band > hi ? v.band - hi : 0;
      }),
    });
  } catch {
    // No provider errors/body logging and NO retry, including failures.
    record.error = "Assessment failed; attempt not retried. Inspect availability or output validation separately.";
  }
  records.push(record);
  writeFileSync(outPath, JSON.stringify({ ...results, finalRemaining: await remainingRequests() }, null, 2));
  process.stdout.write(`${phase}: ${c.id}: ${record.error ? "failed" : "recorded"}; ${await remainingRequests()} requests remain\n`);
  await new Promise(r => setTimeout(r, 1000));
}, { concurrency: 1, retries: 0 });
// Verify that frozen output can be read back without issuing another request.
JSON.parse(readFileSync(outPath, "utf8"));