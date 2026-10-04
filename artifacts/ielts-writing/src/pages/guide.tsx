import { Link } from 'wouter';
import { useGetAiStatus } from '@workspace/api-client-react';
import { Shell, DISCLAIMER } from '@/components/shell';

const CRITERIA = [
  ['Task Achievement (Task 1) / Task Response (Task 2)', 'Task 1: do you report the key features accurately, with an overview (Academic) or a clear purpose and tone (General letter)? Task 2: do you answer every part of the question, hold a clear position and develop your ideas?'],
  ['Coherence and Cohesion', 'Logical paragraphs, one central idea each, and linking that feels natural rather than mechanical.'],
  ['Lexical Resource', 'Range and precision of vocabulary, collocation, spelling and word formation.'],
  ['Grammatical Range and Accuracy', 'A mix of simple and complex structures, and how often errors get in the way of meaning.'],
];

export default function Guide() {
  const status = useGetAiStatus();
  return (
    <Shell>
      <article className="max-w-3xl mx-auto px-4 py-10 space-y-10 rise">
        <header>
          <h1 className="display text-3xl sm:text-4xl">How the writing is judged, and how your data is handled</h1>
          <p className="reading mt-3 text-muted-foreground">{DISCLAIMER}</p>
        </header>

        <section>
          <h2 className="display text-2xl mb-3">The four criteria</h2>
          <p className="reading text-sm mb-4">Each is weighted equally and reported as a band from 0 to 9.</p>
          <dl className="space-y-3">
            {CRITERIA.map(([t, d], i) => (
              <div key={t} className="rounded-lg border bg-card p-4 flex gap-4" data-testid={`criterion-${i}`}>
                <span className="display text-2xl text-[hsl(var(--chart-2))]">{i + 1}</span>
                <div>
                  <dt className="font-semibold">{t}</dt>
                  <dd className="reading text-sm text-muted-foreground mt-1">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
          <p className="reading text-sm mt-4">
            Task 1 needs at least 150 words in about 20 minutes. Task 2 needs at least 250 words in about 40 minutes and
            counts for more of the writing score.
          </p>
        </section>

        <section data-testid="section-score-reliability">
          <h2 className="display text-2xl mb-3">How reliable are the estimates?</h2>
          <div className="reading text-sm space-y-3">
            <p>
              This is practice feedback, not an official IELTS result or a prediction of your test score.
              A small check against published examiner-rated answers cannot establish accuracy for every
              topic, band or writing style. Individual criterion scores may differ from an examiner's judgment.
            </p>
            <p>
              In a four-answer check, a tested prompt's overall estimates differed from the published bands
              by up to 1.5 bands. The batch also included two stress tests; two of its six responses had quotation
              mismatches and would not be shown. The latest task-specific prompt refinements have not yet
              had a further paid comparison.
            </p>
            <p>
              The rubric checks relevance, task coverage and the language actually demonstrated.
              Short answers provide less evidence; the public descriptors rate answers of 20 words or fewer
              at Band 1 across all four criteria. Longer answers below the minimum are assessed for their
              development and language, not given an invented fixed word-count deduction.
            </p>
            <p>
              Evidence quotations are checked against your submitted text before feedback is shown
              (ignoring layout whitespace). A matching quote does not guarantee that the AI's interpretation
              or band is correct. Unsupported quotations or inconsistent scores cause an error, not a retry.
            </p>
            <p>
              Four equally weighted criteria give the estimate for this answer only. It is rounded to the
              nearest half band for practice; it is not the combined Writing-test result.
            </p>
            <a className="underline" href="https://ielts.org/cdn/Guides/ielts-writing-band-descriptors.pdf" target="_blank" rel="noreferrer">
              Read the official public IELTS Writing Band Descriptors
            </a>
          </div>
        </section>

        <section>
          <h2 className="display text-2xl mb-3">Privacy</h2>
          <ul className="reading text-sm space-y-2 list-disc pl-5">
            <li>No accounts and no payments. Drafts are stored only in this browser's local storage.</li>
            <li>Clearing site data or switching browsers removes your drafts. Use Export text to keep a copy.</li>
            <li>Your essay is sent through Replit AI Integrations to OpenAI only when you explicitly confirm an assessment. Avoid including personal information.</li>
            <li>The app does not save essays on its server. The provider processes the submitted text under its own data policies. Only generated prompts and a daily request counter are stored in the database.</li>
          </ul>
        </section>

        <section data-testid="section-ai-setup">
          <h2 className="display text-2xl mb-3">AI setup status</h2>
          <div className="rounded-lg border bg-accent/60 p-4 reading text-sm space-y-2">
            {status.isLoading && <p>Checking status...</p>}
            {status.isError && (
              <p>
                Could not read the AI status.{' '}
                <button className="underline" onClick={() => status.refetch()} data-testid="button-retry-status">
                  Retry
                </button>
              </p>
            )}
            {status.data && (
              <>
                <p className="font-semibold">{status.data.enabled ? 'AI is enabled.' : 'AI is switched off.'}</p>
                <p>{status.data.message}</p>
                <p>{status.data.costNotice}</p>
              </>
            )}
            <p>
              The owner approved GPT-5 nano with a limit of 20 AI attempts per day across this app.
              The database counter is shared by all server instances in each environment and resets at midnight Asia/Jakarta. Failed requests count.
              This is a usage limit, not a guaranteed dollar cap.
            </p>
            <p>
              You will see a confirmation about cost and privacy before anything is sent, and
              nothing is retried automatically.
            </p>
          </div>
        </section>

        <Link href="/" className="inline-block rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm" data-testid="link-back-practice">
          Back to practice
        </Link>
      </article>
    </Shell>
  );
}
