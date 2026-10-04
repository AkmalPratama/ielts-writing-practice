import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import {
  useAssessWriting,
  useGenerateWritingTask,
  useGetAiStatus,
  useGetPracticeTasks,
  type PracticeTask,
  type WritingFeedback,
} from '@workspace/api-client-react';
import { Shell, DISCLAIMER } from '@/components/shell';
import { TaskVisualView } from '@/components/task-visual';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { countWords, loadDrafts, saveDrafts, SAMPLE_FEEDBACK } from '@/lib/practice-data';

const btn =
  'inline-flex items-center justify-center rounded-md px-3.5 min-h-[44px] text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary/90`;
const btnGhost = `${btn} border bg-card hover:bg-secondary`;
const sel =
  'min-h-[44px] w-full rounded-md border border-input bg-card px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

type Confirm = null | 'clear' | 'reset' | 'ai-generate' | 'ai-feedback';
type Notice = null | 'setup-feedback' | 'setup-generate' | 'sample';

export default function Practice() {
  const tasksQ = useGetPracticeTasks();
  const statusQ = useGetAiStatus();
  const generate = useGenerateWritingTask({ mutation: { retry: false } });
  const assess = useAssessWriting({ mutation: { retry: false } });

  const [extra, setExtra] = useState<PracticeTask[]>([]);
  const [module, setModule] = useState('all');
  const [taskNo, setTaskNo] = useState('all');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>(() => loadDrafts());
  const [storageOk, setStorageOk] = useState(true);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const all = useMemo(() => Array.from(new Map([...(tasksQ.data ?? []), ...extra].map(t => [t.id, t])).values()), [tasksQ.data, extra]);
  const categories = useMemo(() => Array.from(new Set(all.map((t) => t.category))).sort(), [all]);
  const filtered = useMemo(
    () =>
      all.filter(
        (t) =>
          (module === 'all' || t.module === module) &&
          (taskNo === 'all' || String(t.task) === taskNo) &&
          (category === 'all' || t.category === category),
      ),
    [all, module, taskNo, category],
  );
  const current = filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null;
  const aiEnabled = !!statusQ.data?.enabled;

  // timer
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const curId = current?.id;
  const curMinutes = current?.minutes ?? 0;
  useEffect(() => {
    setLeft(curMinutes * 60);
    setRunning(false);
    setFeedback(null);
    setAiError(null);
  }, [curId, curMinutes]);
  useEffect(() => {
    if (!running) return;
    const i = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(i);
  }, [running]);

  const essay = current ? (drafts[current.id] ?? '') : '';
  const activeAnswer = useRef({ id: current?.id, essay });
  activeAnswer.current = { id: current?.id, essay };
  const words = countWords(essay);

  const persist = useCallback((next: Record<string, string>) => {
    setStorageOk(saveDrafts(next));
  }, []);
  const setEssay = (text: string) => {
    if (!current) return;
    const next = { ...drafts, [current.id]: text };
    setDrafts(next);
    setFeedback(null);
    persist(next);
  };
  const removeDraft = () => {
    if (!current) return;
    setFeedback(null);
    const next = { ...drafts };
    delete next[current.id];
    setDrafts(next);
    setStorageOk(saveDrafts(next));
  };

  const nextSample = () => {
    if (!filtered.length) return;
    const idx = filtered.findIndex((t) => t.id === current?.id);
    setSelectedId(filtered[(idx + 1) % filtered.length].id);
  };

  const exportText = () => {
    if (!current) return;
    const blob = new Blob([`${current.title}\n\n${essay}\n\n(${words} words)`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ielts-${current.module}-task${current.task}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const runGenerate = async () => {
    setConfirm(null);
    setAiError(null);
    try {
      const t = await generate.mutateAsync({
        data: {
          module: current?.module ?? 'academic',
          task: (current?.task ?? 2) as 1 | 2,
          consent: true,
        },
      });
      setExtra((e) => [...e, t]);
      setModule(t.module);
      setTaskNo(String(t.task));
      setCategory('all');
      setSelectedId(t.id);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'The AI request failed. Nothing was retried.');
    } finally {
      void statusQ.refetch();
    }
  };
  const runAssess = async () => {
    setConfirm(null);
    setAiError(null);
    if (!current) return;
    const submittedId = current.id;
    const submittedEssay = essay;
    try {
      const result = await assess.mutateAsync({ data: { taskId: submittedId, essay: submittedEssay, consent: true } });
      if (activeAnswer.current.id === submittedId && activeAnswer.current.essay === submittedEssay) {
        setFeedback(result);
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'The AI request failed. Nothing was retried.');
    } finally {
      void statusQ.refetch();
    }
  };

  const onFeedback = () => (aiEnabled ? setConfirm('ai-feedback') : setNotice('setup-feedback'));
  const onGenerate = () => (aiEnabled ? setConfirm('ai-generate') : setNotice('setup-generate'));

  if (tasksQ.isLoading) {
    return (
      <Shell>
        <div className="max-w-[1400px] mx-auto p-4 grid lg:grid-cols-2 gap-6" data-testid="loading-tasks">
          <Skeleton className="h-[480px]" />
          <Skeleton className="h-[480px]" />
        </div>
      </Shell>
    );
  }
  if (tasksQ.isError) {
    return (
      <Shell>
        <div className="max-w-md mx-auto p-8 text-center space-y-4" data-testid="error-tasks">
          <h1 className="display text-2xl">The task library did not load</h1>
          <p className="reading text-sm text-muted-foreground">Check your connection and try again. Your drafts are safe in this browser.</p>
          <button className={btnPrimary} onClick={() => tasksQ.refetch()} data-testid="button-retry-tasks">
            Retry
          </button>
        </div>
      </Shell>
    );
  }

  const short = current ? words < current.minWords : false;
  const pct = current ? Math.min(100, (words / current.minWords) * 100) : 0;
  const aiBusy = generate.isPending || assess.isPending;

  return (
    <Shell>
      <div className="max-w-[1400px] mx-auto px-4 py-5 space-y-4">
        {aiEnabled && (
          <p className="text-sm text-muted-foreground" data-testid="status-ai-live">
            {statusQ.data?.message}
          </p>
        )}
        {!storageOk && (
          <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 text-sm p-3" data-testid="warning-storage">
            Your browser blocked saving, so this draft is not stored. Use Export text to keep a copy before leaving.
          </div>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-2 rise" aria-label="Task selection">
          <select className={sel} value={module} onChange={(e) => setModule(e.target.value)} aria-label="Module" data-testid="select-module">
            <option value="all">All modules</option>
            <option value="academic">Academic</option>
            <option value="general">General Training</option>
          </select>
          <select className={sel} value={taskNo} onChange={(e) => setTaskNo(e.target.value)} aria-label="Task" data-testid="select-task">
            <option value="all">Task 1 and 2</option>
            <option value="1">Task 1</option>
            <option value="2">Task 2</option>
          </select>
          <select className={sel} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" data-testid="select-category">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={sel}
            value={current?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label="Choose task"
            data-testid="select-prompt"
          >
            {filtered.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
                {drafts[t.id] ? ' (draft)' : ''}
              </option>
            ))}
          </select>
        </section>

        {!current ? (
          <div className="rounded-lg border border-dashed p-10 text-center space-y-3" data-testid="empty-tasks">
            <p className="display text-xl">No task matches those filters</p>
            <button
              className={btnGhost}
              onClick={() => {
                setModule('all');
                setTaskNo('all');
                setCategory('all');
              }}
              data-testid="button-clear-filters"
            >
              Show all tasks
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-5 items-start">
            <section key={current.id} className="rise space-y-4 lg:sticky lg:top-[72px] lg:max-h-[calc(100dvh-90px)] lg:overflow-y-auto lg:pr-2" aria-label="Task">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  {current.module === 'academic' ? 'Academic' : 'General'} Task {current.task}
                </span>
                <span className="px-2 py-1 rounded-full bg-secondary">{current.category}</span>
                <span className="px-2 py-1 rounded-full bg-secondary" data-testid="text-source">
                  {current.source === 'ai' ? 'AI generated' : 'Curated sample'}
                </span>
              </div>
              <h1 className="display text-2xl sm:text-3xl" data-testid="text-task-title">
                {current.title}
              </h1>
              <div className="reading text-[17px] leading-[1.75] rounded-lg bg-card border p-5 whitespace-pre-line" data-testid="text-prompt">
                {current.prompt}
              </div>
              {current.visual && <TaskVisualView visual={current.visual} />}
              <p className="reading text-sm text-muted-foreground">{current.instructions}</p>
              <p className="text-sm">
                Write at least <b>{current.minWords}</b> words in about <b>{current.minutes}</b> minutes.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className={btnGhost} onClick={nextSample} data-testid="button-next-sample">
                  Next sample
                </button>
                <button className={btnGhost} onClick={onGenerate} disabled={aiBusy} data-testid="button-generate">
                  {generate.isPending ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              {!aiEnabled && (
                <p className="text-xs text-muted-foreground" data-testid="text-ai-off">
                  AI generation is switched off. Use Next sample for a fresh prompt.
                </p>
              )}
            </section>

            <section className="rise space-y-3" aria-label="Your writing">
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`display text-3xl tabular-nums ${left === 0 ? 'text-destructive' : ''}`}
                    data-testid="text-timer"
                    aria-live="off"
                  >
                    {fmt(left)}
                  </span>
                  <button className={btnGhost} onClick={() => setRunning((r) => !r)} disabled={left === 0} data-testid="button-timer-toggle">
                    {running ? 'Pause' : left === current.minutes * 60 ? 'Start' : 'Resume'}
                  </button>
                  <button
                    className={btnGhost}
                    onClick={() => {
                      setRunning(false);
                      setLeft(current.minutes * 60);
                    }}
                    data-testid="button-timer-reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-2xl display tabular-nums" data-testid="text-word-count">
                    {words}
                  </div>
                  <div className="text-xs text-muted-foreground">words</div>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full origin-left transition-transform duration-500 ${short ? 'bg-[hsl(var(--chart-3))]' : 'bg-[hsl(var(--chart-4))]'}`}
                  style={{ transform: `scaleX(${pct / 100})` }}
                />
              </div>
              <p className="text-xs text-muted-foreground" data-testid="text-word-guidance">
                {short ? `${current.minWords - words} more words to reach the ${current.minWords}-word minimum.` : 'Minimum reached. Leave time to check your work.'}
              </p>

              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Start writing here. Your draft saves in this browser as you type."
                spellCheck={false}
                className="reading w-full min-h-[360px] lg:min-h-[520px] rounded-lg border border-input bg-card p-5 text-[17px] leading-[1.8] focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                data-testid="input-essay"
              />

              <div className="flex flex-wrap gap-2">
                <button className={btnPrimary} onClick={onFeedback} disabled={aiBusy || !essay.trim()} data-testid="button-get-feedback">
                  {assess.isPending ? 'Assessing...' : 'Get feedback'}
                </button>
                <button className={btnGhost} onClick={() => setNotice('sample')} data-testid="button-view-sample">
                  View sample feedback
                </button>
                <button className={btnGhost} onClick={exportText} disabled={!essay} data-testid="button-export">
                  Export text
                </button>
                <button className={btnGhost} onClick={() => setConfirm('clear')} disabled={!essay} data-testid="button-clear">
                  Clear draft
                </button>
                <button className={btnGhost} onClick={() => setConfirm('reset')} data-testid="button-reset-task">
                  Reset task
                </button>
              </div>
              {aiError && (
                <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 text-sm p-3" data-testid="error-ai">
                  {aiError} No retry was made.
                </div>
              )}
              {feedback && (
                <div className="rounded-lg border bg-card p-4 space-y-2 rise" data-testid="panel-feedback">
                  <p className="display text-lg">
                    {feedback.sample ? 'Sample feedback' : 'AI feedback'}: estimated band {feedback.overallBand.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
                  <p className="reading text-sm">{feedback.summary}</p>
                  <ul className="text-sm list-disc pl-5">
                    {feedback.criteria.map((c) => (
                      <li key={c.name}>
                        {c.name}: {c.band.toFixed(1)} - {c.explanation}
                        <span className="block text-muted-foreground mt-1">Evidence: {c.evidence}</span>
                      </li>
                    ))}
                  </ul>
                  <h3 className="font-semibold text-sm">Strengths</h3>
                  <ul className="text-sm list-disc pl-5">
                    {feedback.strengths.map(s => <li key={s}>{s}</li>)}
                  </ul>
                  <h3 className="font-semibold text-sm">Next improvements</h3>
                  <ul className="text-sm list-disc pl-5">
                    {feedback.improvements.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <AlertDialog open={confirm === 'clear'} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this draft?</AlertDialogTitle>
            <AlertDialogDescription>Your {words} words for this task will be deleted from this browser. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear">Keep writing</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-clear"
              onClick={() => {
                removeDraft();
                setConfirm(null);
              }}
            >
              Clear draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirm === 'reset'} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the draft and puts the timer back to {current?.minutes} minutes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-reset"
              onClick={() => {
                removeDraft();
                setRunning(false);
                setLeft(curMinutes * 60);
                setFeedback(null);
                setConfirm(null);
              }}
            >
              Reset task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirm === 'ai-generate' || confirm === 'ai-feedback'} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this to an AI provider?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === 'ai-feedback' ? 'Your essay text will leave this browser and be processed by a third party. ' : 'A request will be sent to a third party. '}
              {statusQ.data?.costNotice} It runs once, with no automatic retry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-decline-ai">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-consent-ai"
              onClick={() => (confirm === 'ai-feedback' ? runAssess() : runGenerate())}
            >
              I agree, send once
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={notice === 'setup-feedback' || notice === 'setup-generate'} onOpenChange={(o) => !o && setNotice(null)}>
        <DialogContent data-testid="dialog-ai-setup">
          <DialogHeader>
            <DialogTitle className="display">AI is switched off</DialogTitle>
            <DialogDescription asChild>
              <div className="reading space-y-2 text-sm">
                <p>
                  {statusQ.isError ? 'The AI status could not be read, so requests are blocked.' : statusQ.data?.message}
                </p>
                <p>
                  AI is currently unavailable. Your essay has not been sent by this action. Sample practice remains available.
                </p>
                <p>{notice === 'setup-generate' ? 'Use Next sample for another prompt.' : 'You can look at a labelled sample of what feedback would look like.'}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2">
            {notice === 'setup-generate' ? (
              <button
                className={btnPrimary}
                onClick={() => {
                  setNotice(null);
                  nextSample();
                }}
                data-testid="button-dialog-next-sample"
              >
                Next sample
              </button>
            ) : (
              <button className={btnPrimary} onClick={() => setNotice('sample')} data-testid="button-dialog-view-sample">
                View sample feedback
              </button>
            )}
            <Link href="/guide" className={btnGhost} data-testid="link-setup-guide">
              Read the setup guide
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notice === 'sample'} onOpenChange={(o) => !o && setNotice(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl" data-testid="dialog-sample-feedback">
          <DialogHeader>
            <p className="text-xs uppercase tracking-widest text-[hsl(var(--chart-2))] font-semibold">Sample preview, not your essay</p>
            <DialogTitle className="display">Estimated sample bands: {SAMPLE_FEEDBACK.overall.toFixed(1)}</DialogTitle>
            <DialogDescription>{SAMPLE_FEEDBACK.essayTitle}. Your writing has not been assessed. {DISCLAIMER}</DialogDescription>
          </DialogHeader>
          <blockquote className="reading text-sm border-l-4 border-[hsl(var(--chart-2))] pl-3 italic">{SAMPLE_FEEDBACK.essay}</blockquote>
          <ul className="space-y-2">
            {SAMPLE_FEEDBACK.criteria.map((c) => (
              <li key={c.name} className="rounded-md border p-3 text-sm">
                <div className="flex justify-between gap-2 font-semibold">
                  <span>{c.name}</span>
                  <span>Sample {c.band.toFixed(1)}</span>
                </div>
                <p className="reading mt-1">{c.explanation}</p>
                <p className="reading text-muted-foreground mt-1">Evidence: {c.evidence}</p>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="display text-lg mb-1">Three improvements</h3>
            <ol className="reading text-sm list-decimal pl-5 space-y-1">
              {SAMPLE_FEEDBACK.improvements.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
