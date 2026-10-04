import assert from "node:assert/strict";
import { test } from "node:test";
import { assessmentPrompt, criterionNames, evidenceIsExact, validateAssessment, validateFeedbackItems, wordCount } from "../lib/writing-rubric";
import { cases } from "./cases";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("evidence permits layout whitespace and outer quotes, never invented/corrected text", () => {
  assert(evidenceIsExact("I has\nan apple.", '"I has an apple."'));
  assert(!evidenceIsExact("I has an apple.", "I have an apple."));
  assert(!evidenceIsExact("I has an apple.", "i has an apple."));
  assert(!evidenceIsExact("I has an apple.", "I has ... apple."));
  assert(!evidenceIsExact("I has an apple.", ""));
  assert(!evidenceIsExact("I has an apple.", "NO_QUOTABLE_EVIDENCE"));
  assert(evidenceIsExact("", "NO_QUOTABLE_EVIDENCE"));
});
const essay = "Please change my room.";
const criteria = criterionNames(1).map(name => ({ name, band: 1, evidence: essay }));
test("validates criterion order, score steps, range, quotations and official short-answer rule", () => {
  validateAssessment({task: 1}, essay, criteria);
  for (const band of [NaN, -1, 10, 1.25, 6]) {
    assert.throws(() => validateAssessment({task: 1}, essay, [{...criteria[0]!, band}, ...criteria.slice(1)]));
  }
  assert.throws(() => validateAssessment({task: 2}, essay, criteria));
  assert.throws(() => validateAssessment({task: 1}, essay, criteria.slice(1)));
  assert.throws(() => validateAssessment({task: 1}, essay,
    [{...criteria[0]!, evidence: "invented"}, ...criteria.slice(1)]));
});
test("benchmark covers both modules/tasks; stress tests have no fabricated examiner labels", () => {
  assert.deepEqual(new Set(cases.filter(c => c.publishedOverall !== null).map(c => `${c.task.module}-${c.task.task}`)),
    new Set(["academic-1", "academic-2", "general-1", "general-2"]));
  assert.equal(wordCount(cases.find(c => c.id === "synthetic-very-short")!.essay), 15);
  assert(cases.filter(c => c.id.startsWith("synthetic")).every(c => c.publishedOverall === null && c.commentRanges === null));
  assert(cases.some(c => c.publishedOverall !== null && wordCount(c.essay) < c.task.minWords));
});
test("rubric includes descriptor anchors, task-specific coverage, no arbitrary shortfall deductions", () => {
  const prompt = assessmentPrompt({task: 1, module: "academic"});
  for (const text of ["May 2023", "20 words or fewer", "ALL four", "no invented fixed deduction",
    "process overview", "EXACT substring"]) {
    assert(prompt.toLowerCase().includes(text.toLowerCase()), text);
  }
  const letter = assessmentPrompt({task: 1, module: "general"});
  assert(letter.includes("three bullet points"));
  assert(letter.includes("Do NOT require addresses or dates"));
  assert(!letter.includes("A process overview identifies"));
  const essay = assessmentPrompt({task: 2, module: "academic"});
  assert(essay.includes("Wholly unrelated content"));
  assert(essay.includes("does NOT require an Academic Task 1 overview"));
  assert(!essay.includes("Check each of the three bullet points"));
});

test("20-word boundary applies, 21-word answers are not blanket capped", () => {
  const twenty = Array(20).fill("word").join(" ");
  const twentyOne = `${twenty} word`;
  const scored = (band: number) => criterionNames(1).map(name => ({name, band, evidence: "word"}));
  assert.equal(wordCount(twenty), 20);
  validateAssessment({task: 1}, twenty, scored(1));
  assert.throws(() => validateAssessment({task: 1}, twenty, scored(1.5)));
  validateAssessment({task: 1}, twentyOne, scored(6.5));
});

test("database usage reservations are awaited, limited and fail closed", async () => {
  const { createWritingStore, WritingError } = await import("../lib/writing-state");
  let count = 19;
  const store = createWritingStore(async statement => {
    assert(statement.includes("Asia/Jakarta"));
    if (statement.includes("INSERT")) {
      assert(statement.includes("ON CONFLICT"));
      assert(statement.includes("WHERE writing_ai_daily_usage.requests < 20"));
      if (count >= 20) return { rows: [] };
      return { rows: [{ requests: ++count }] };
    }
    return { rows: [{ requests: count }] };
  });
  assert.equal(await store.remainingRequests(), 1);
  await store.reserveRequest();
  assert.equal(await store.remainingRequests(), 0);
  await assert.rejects(store.reserveRequest(), (e: unknown) => e instanceof WritingError && e.status === 429);
  assert.equal(count, 20);
  const unavailable = createWritingStore(async () => { throw Error("Database down"); });
  await assert.rejects(unavailable.reserveRequest(), (e: unknown) => e instanceof WritingError && e.status === 503);
  const corrupt = createWritingStore(async () => ({ rows: [{ requests: 21 }] }));
  await assert.rejects(corrupt.remainingRequests(), (e: unknown) => e instanceof WritingError && e.status === 503);
});

test("empty/junk feedback and invalid item counts fail rather than being silently displayed", () => {
  const valid = {strengths: ["Clear purpose"], improvements: ["Develop your ideas", "Check verb forms", "Use clear paragraphs"]};
  validateFeedbackItems(valid);
  validateFeedbackItems({...valid, strengths: []});
  for (const strengths of [[" "], ["],"], ["improvements=[ "], Array(5).fill("Clear purpose")]) {
    assert.throws(() => validateFeedbackItems({...valid, strengths}));
  }
  assert.throws(() => validateFeedbackItems({...valid, improvements: ["Check grammar"]}));
  assert.throws(() => validateFeedbackItems({...valid, improvements: Array(6).fill("Check verb forms")}));
});

test("saved paid results reproduce exact-evidence checks and preserve the tested prompt hashes", () => {
  const base = new URL("./results/", import.meta.url);
  const tested = JSON.parse(readFileSync(new URL("tested-revised-prompts.json", base), "utf8"));
  for (const phase of ["baseline", "revised"]) {
    const run = JSON.parse(readFileSync(new URL(`${phase}.json`, base), "utf8"));
    assert.equal(run.records.length, cases.length);
    assert.equal(run.model, "gpt-5-nano");
    assert.equal(run.retries, 0);
    assert.equal(run.initialRemaining - run.finalRemaining, 6);
    for (const c of cases) {
      const record = run.records.find((r: {id: string}) => r.id === c.id);
      assert(record.feedback);
      assert.deepEqual(record.exactEvidence, record.feedback.criteria.map((v: {evidence: string}) => evidenceIsExact(c.essay, v.evidence)));
      assert.equal(record.inputSha256, createHash("sha256").update(JSON.stringify({task: c.task, essay: c.essay})).digest("hex"));
      if (phase === "revised") {
        assert.equal(record.promptSha256, createHash("sha256").update(tested[`task${c.task.task}`]).digest("hex"));
      }
    }
  }
});