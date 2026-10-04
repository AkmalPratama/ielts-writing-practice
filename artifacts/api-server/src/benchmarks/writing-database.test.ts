/**
 * Development-only PostgreSQL checks. No provider calls or real usage-counter edits.
 * Disposable test tables are deleted in finally.
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { pool } from "@workspace/db";
import { createWritingStore, WritingError } from "../lib/writing-state";
import { practiceTasks } from "../lib/practice-tasks";

test("PostgreSQL enforces 20 reservations across concurrent stores and preserves tasks", async () => {
  if (process.env.NODE_ENV === "production") throw Error("Never run mutation tests against production");
  const suffix = randomUUID().replaceAll("-", "");
  const usage = `test_writing_usage_${suffix}`;
  const tasks = `test_writing_tasks_${suffix}`;
  try {
    await pool.query(`CREATE TABLE ${usage} (LIKE writing_ai_daily_usage INCLUDING ALL)`);
    await pool.query(`CREATE TABLE ${tasks} (LIKE writing_generated_tasks INCLUDING ALL)`);
    const query = (statement: string, values?: unknown[]) => pool.query(
      statement.replaceAll("writing_ai_daily_usage", usage).replaceAll("writing_generated_tasks", tasks), values);
    const first = createWritingStore(query);
    const second = createWritingStore(query);
    assert.equal(await first.remainingRequests(), 20);
    const results = await Promise.allSettled(Array.from({ length: 40 }, (_, i) =>
      (i % 2 ? first : second).reserveRequest()));
    assert.equal(results.filter(r => r.status === "fulfilled").length, 20);
    for (const r of results) {
      if (r.status === "rejected") assert(r.reason instanceof WritingError && r.reason.status === 429);
    }
    assert.equal(await first.remainingRequests(), 0);
    assert.equal(await second.remainingRequests(), 0);
    const task = { ...practiceTasks[0]!, id: `test-${suffix}`, source: "ai" as const };
    await first.storeTask(task);
    assert.deepEqual(await second.generatedTasks(), [task]);
    // Move the disposable exhausted row to a past day: today now has full capacity.
    await pool.query(`UPDATE ${usage} SET day = '2000-01-01'`);
    assert.equal(await first.remainingRequests(), 20);
    await second.reserveRequest();
    assert.equal(await first.remainingRequests(), 19);
  } finally {
    await pool.query(`DROP TABLE IF EXISTS ${tasks}`);
    await pool.query(`DROP TABLE IF EXISTS ${usage}`);
    await pool.end();
  }
});