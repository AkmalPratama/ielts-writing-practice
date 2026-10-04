import { sql } from "drizzle-orm";
import { check, date, integer, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const writingUsageTable = pgTable("writing_ai_daily_usage", {
  day: date("day", { mode: "string" }).primaryKey(),
  requests: integer("requests").notNull(),
}, (t) => [check("writing_daily_limit", sql`${t.requests} >= 0 AND ${t.requests} <= 20`)]);
export const insertWritingUsageSchema = createInsertSchema(writingUsageTable);
export type WritingUsage = typeof writingUsageTable.$inferSelect;
export type InsertWritingUsage = typeof writingUsageTable.$inferInsert;