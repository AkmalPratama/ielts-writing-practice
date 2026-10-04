import { Router, type IRouter, type Request, type Response } from "express";
import { AssessWritingBody, GenerateWritingTaskBody, GetAiStatusResponse, GetPracticeTasksResponse } from "@workspace/api-zod";
import { practiceTasks } from "../lib/practice-tasks";
import { assessEssay, generateTask, MODEL } from "../lib/writing-ai";
import { generatedTasks, remainingRequests, WritingError } from "../lib/writing-state";

const router: IRouter = Router();
const costNotice = "OpenAI GPT-5 nano via Replit AI Integrations; billed to the owner's Replit credits. Listed rates: $0.05/1M input tokens and $0.40/1M output tokens (including reasoning). Maximum 20 AI attempts per day across this app, resetting at midnight Asia/Jakarta. Failed attempts count. This is not a dollar spending cap.";
function failure(req: Request, res: Response, error: unknown) {
  const status = error instanceof WritingError ? error.status : 502;
  // Do not log raw provider errors: they can contain submitted essay text.
  req.log.warn({ status, errorType: error instanceof Error ? error.name : "unknown" }, "Writing AI request failed; no retry");
  res.status(status).json({ error: error instanceof WritingError ? error.message : "The AI service could not complete the request. No automatic retry was made. Check availability and remaining usage before trying again." });
}
router.get("/writing/tasks", async (req, res): Promise<void> => {
  try { res.json(GetPracticeTasksResponse.parse([...practiceTasks, ...await generatedTasks()])); }
  catch (e) { failure(req, res, e); }
});
router.get("/writing/ai-status", async (_req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  try {
    res.json(GetAiStatusResponse.parse({
      enabled: true, provider: "OpenAI via Replit AI Integrations", model: MODEL,
      message: `Live AI is enabled. ${await remainingRequests()} of 20 requests remain today. IELTS bands are practice estimates, not official scores. OpenAI marks this model as deprecated; no automatic model substitution.`,
      costNotice,
    }));
  } catch {
    res.json(GetAiStatusResponse.parse({ enabled: false, provider: "OpenAI via Replit AI Integrations", model: MODEL, message: "AI is blocked because its usage database could not be read.", costNotice }));
  }
});
router.post("/writing/generate", async (req, res): Promise<void> => {
  const parsed = GenerateWritingTaskBody.safeParse(req.body);
  if (!parsed.success || parsed.data.consent !== true) {
    res.status(400).json({ error: "Select a module and task and explicitly consent to paid AI processing." }); return;
  }
  try { res.json(await generateTask(parsed.data.module, parsed.data.task)); }
  catch (e) { failure(req, res, e); }
});
router.post("/writing/feedback", async (req, res): Promise<void> => {
  const parsed = AssessWritingBody.safeParse(req.body);
  if (!parsed.success || parsed.data.consent !== true || !parsed.data.essay.trim()) {
    res.status(400).json({ error: "Enter an essay of at most 20,000 characters and explicitly consent to paid AI processing." }); return;
  }
  try {
    const task = [...practiceTasks, ...await generatedTasks()].find(t => t.id === parsed.data.taskId);
    if (!task) { res.status(400).json({ error: "That task is unavailable. Choose a task from the library." }); return; }
    res.json(await assessEssay(task, parsed.data.essay));
  } catch (e) { failure(req, res, e); }
});
export default router;