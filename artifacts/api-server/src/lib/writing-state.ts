import { pool } from "@workspace/db";
import { GetPracticeTasksResponse, GenerateWritingTaskResponse } from "@workspace/api-zod";

export class WritingError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
type Query = (statement: string, values?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
const today = "(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date";

/** Query injection is only for offline tests, never exposed as an HTTP option. */
export function createWritingStore(query: Query) {
  async function available<T>(operation: () => Promise<T>): Promise<T> {
    try { return await operation(); }
    catch (e) {
      if (e instanceof WritingError) throw e;
      throw new WritingError(503, "AI is blocked because its database is unavailable or returned invalid data. No automatic retry was made.");
    }
  }
  return {
    generatedTasks: () => available(async () => {
      const result = await query("SELECT task FROM writing_generated_tasks ORDER BY created_at, id");
      return GetPracticeTasksResponse.parse(result.rows.map(r => r.task));
    }),
    remainingRequests: () => available(async () => {
      const result = await query(`SELECT requests FROM writing_ai_daily_usage WHERE day = ${today}`);
      const count = result.rows[0]?.requests ?? 0;
      if (typeof count !== "number" || !Number.isInteger(count) || count < 0 || count > 20) {
        throw new Error("Invalid request count");
      }
      return 20 - count;
    }),
    reserveRequest: () => available(async () => {
      // One atomic statement serializes conflicting increments across all instances.
      // Commit the reservation BEFORE making a provider call; failed attempts count.
      const result = await query(`
        INSERT INTO writing_ai_daily_usage (day, requests) VALUES (${today}, 1)
        ON CONFLICT (day) DO UPDATE
          SET requests = writing_ai_daily_usage.requests + 1
          WHERE writing_ai_daily_usage.requests < 20
        RETURNING requests`);
      if (!result.rows.length) {
        throw new WritingError(429, "The app's 20-request daily AI limit has been reached. It resets at midnight Asia/Jakarta. Sample practice is still available.");
      }
    }),
    storeTask: (task: ReturnType<typeof GenerateWritingTaskResponse.parse>) => available(async () => {
      const valid = GenerateWritingTaskResponse.parse(task);
      await query("INSERT INTO writing_generated_tasks (id, task) VALUES ($1, $2::jsonb)", [valid.id, JSON.stringify(valid)]);
    }),
  };
}
const store = createWritingStore((statement, values) => pool.query(statement, values));
export const { generatedTasks, remainingRequests, reserveRequest, storeTask } = store;