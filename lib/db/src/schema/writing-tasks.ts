import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const writingTasksTable = pgTable("writing_generated_tasks", {
  id: text("id").primaryKey(),
  task: jsonb("task").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const insertWritingTaskSchema = createInsertSchema(writingTasksTable).omit({ createdAt: true });
export type WritingTask = typeof writingTasksTable.$inferSelect;
export type InsertWritingTask = typeof writingTasksTable.$inferInsert;