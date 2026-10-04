import { randomUUID } from "node:crypto";
import { z } from "zod/v4";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { AssessWritingResponse, GenerateWritingTaskResponse } from "@workspace/api-zod";
import { reserveRequest, storeTask, WritingError } from "./writing-state";
import { assessmentPrompt, criterionNames, validateAssessment, validateFeedbackItems, wordCount } from "./writing-rubric";

export const MODEL = "gpt-5-nano";
const text = z.string();
const taskOutput = z.object({
  title: text, category: text, prompt: text,
});
const letterOutput = z.object({
  title: text, scenario: text, recipient: text,
  requirement1: text, requirement2: text, requirement3: text,
});
const row = z.object({ label: text, earlier: z.number(), later: z.number() });
const academicOutput = z.object({
  title: text, prompt: text, instructions: text, visualTitle: text,
  earlierPeriod: text, laterPeriod: text,
  row1: row, row2: row, row3: row,
});
const feedbackOutput = z.object({
  summary: text,
  criteria: z.array(z.object({
    name: text, band: z.number(), explanation: text, evidence: text,
  })),
  strengths: z.array(text),
  improvements: z.array(text),
});
async function request<T extends z.ZodType>(schema: T, system: string, input: string): Promise<z.infer<T>> {
  await reserveRequest();
  const result = await openai.chat.completions.create({
    model: MODEL,
    reasoning_effort: "low",
    max_completion_tokens: 8192,
    response_format: zodResponseFormat(schema, "writing_result"),
    messages: [{ role: "system", content: system }, { role: "user", content: input }],
    store: false,
  }, { maxRetries: 0, timeout: 90_000 });
  const choice = result.choices[0];
  if (choice?.finish_reason !== "stop" || !choice.message.content || choice.message.refusal) {
    throw new WritingError(502, "The AI did not return a complete result. This attempt counts toward the daily limit; nothing was retried.");
  }
  return schema.parse(JSON.parse(choice.message.content));
}
export async function generateTask(module: "academic" | "general", task: 1 | 2) {
  const output = module === "academic" && task === 1 ? await (async () => {
    // Use a non-null, fixed-row schema so every generated visual has usable data.
    const data = await request(academicOutput,
      "Create one realistic original IELTS Academic Task 1 table exercise comparing three meaningfully named categories across two actual calendar years. Use a specific real-world subject such as transport, employment, energy or tourism. Never use placeholders such as Category A or Earlier period. Return a clear question, standard report instructions, a visual title that includes meaningful units, two specific years, and three distinct labeled rows of plausible numeric data. The prompt must refer to this table, not a different visual. This is original practice, not an official question. Do not give an answer.",
      "Generate an Academic Task 1 table with numeric comparisons.");
    const rows = [data.row1, data.row2, data.row3];
    return {
      title: data.title, category: "Table", prompt: data.prompt, instructions: data.instructions,
      visual: {
        kind: "table" as const, title: data.visualTitle, labels: rows.map(r => r.label),
        series: [
          { name: data.earlierPeriod, values: rows.map(r => r.earlier) },
          { name: data.laterPeriod, values: rows.map(r => r.later) },
        ],
        steps: [], before: [], after: [],
      },
    };
  })() : task === 1 ? await (async () => {
    const data = await request(letterOutput,
      "Create one original IELTS General Training Task 1 letter question. Give a concrete everyday scenario, name whom to write to, and supply exactly three specific content points the learner must cover. The requirements are instructions about letter content, not instructions to put bullet points in the answer. Be specific and realistic; never include an answer.",
      "Generate a new General Training letter practice question.");
    return {
      title: data.title, category: "Letter", visual: null,
      prompt: `${data.scenario}\n\nWrite a letter to ${data.recipient}. In your letter:\n• ${data.requirement1}\n• ${data.requirement2}\n• ${data.requirement3}`,
      instructions: "Write at least 150 words. You do not need to write any addresses. Begin your letter appropriately for the recipient.",
    };
  })() : {
    ...await request(taskOutput,
      "Create one realistic original IELTS Writing Task 2 essay question. Include a clear statement about a specific topic and a precise question such as discuss both views and give your opinion, agree/disagree, advantages/disadvantages, or causes/solutions. Supply a short title and broad topic category. Do not include an answer or tell the learner to write a letter. It must be original practice, not an official question.",
      JSON.stringify({ module, task })),
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    visual: null,
  };
  if (module === "academic" && task === 1) {
    const v = output.visual;
    if (!v || v.labels.length !== 3 || new Set(v.labels).size !== 3 || !v.series.length ||
      v.series.some(s => s.values.length !== v.labels.length)) {
      throw new WritingError(502, "The AI returned incomplete visual data. Nothing was retried.");
    }
  }
  const result = GenerateWritingTaskResponse.parse({
    ...output, visual: module === "academic" && task === 1 ? output.visual : undefined,
    id: `ai-${randomUUID()}`, module, task, source: "ai",
    minWords: task === 1 ? 150 : 250, minutes: task === 1 ? 20 : 40,
  });
  await storeTask(result);
  return result;
}
/** Internal benchmark seam; never exposed as an HTTP prompt override. */
export async function assessEssayWithPrompt(
  task: ReturnType<typeof GenerateWritingTaskResponse.parse>, essay: string, system: string,
  includeWordCount = true,
) {
  const names = criterionNames(task.task);
  const result = await request(feedbackOutput, system,
    JSON.stringify({ task, essay, ...(includeWordCount ? { wordCount: wordCount(essay) } : {}) }));
  if (result.criteria.length !== 4 || result.criteria.some((c, i) => c.name !== names[i] || c.band < 0 || c.band > 9 || !Number.isInteger(c.band * 2))) {
    throw new WritingError(502, "The AI returned invalid rubric scores. Nothing was retried.");
  }
  const average = result.criteria.reduce((n, c) => n + c.band, 0) / 4;
  return AssessWritingResponse.parse({ ...result, overallBand: Math.round(average * 2) / 2, sample: false });
}

export async function assessEssay(task: ReturnType<typeof GenerateWritingTaskResponse.parse>, essay: string) {
  const result = await assessEssayWithPrompt(task, essay, assessmentPrompt(task));
  try {
    validateAssessment(task, essay, result.criteria);
    validateFeedbackItems(result);
  }
  catch {
    throw new WritingError(502, "The AI returned unsupported evidence, inconsistent rubric scores or malformed feedback. This attempt counts toward the daily limit; nothing was retried.");
  }
  return result;
}