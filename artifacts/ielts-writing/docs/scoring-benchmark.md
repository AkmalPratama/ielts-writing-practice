# IELTS scoring benchmark

## Scope and safeguards

Run dates (UTC): baseline: 2026-10-03T05:42:36.598Z; revised: 2026-10-03T05:44:56.523Z.
Model: **gpt-5-nano**, low reasoning, maximum 8192 completion tokens per attempt.
Owner approved up to 16 paid verification calls after a cost explanation.
Only 12 remained in the existing Jakarta ledger, so the batch was reduced to
six inputs assessed once with each prompt. Attempts used:
**12**. No retries, model changes, cap increases,
paid storage or publishing. The API workflow was stopped while the single-process
benchmark used the same durable preview ledger. No learner essays were used.

The four published answers cover Academic and General Training, Tasks 1 and 2.
The additional off-topic and 15-word answers are ORIGINAL SYNTHETIC stress tests,
not examiner-rated examples. Neither has an invented examiner overall band.
Published bands in the final set range from 5 to 7.5.
Original plans for a school-travel chart were replaced with a process whose full
source diagram could be visually verified.

## What the numbers mean

- Overall deviation = rounded practice estimate minus published **task overall** band.
  MAE = mean absolute overall deviation, over successful published-answer assessments only.
  These are RAW model scores, including responses that the production validator would
  reject. They are not a measure of delivered feedback or its availability.
- **Individual examiner criterion bands are not published in these sources.**
  True per-criterion error/MAE cannot be measured from them.
- Criterion-minus-overall is reported as a diagnostic spread, NOT criterion accuracy.
- Analyst comment ranges were declared in cases.ts before the calls, by interpreting
  the examiner's prose using the public descriptors. Signed range distance is zero
  inside that range, otherwise the signed difference to its nearest endpoint.
  These ranges are NOT examiner ratings or independent calibration targets.
  Mean absolute range distance quantifies alignment with this analyst interpretation only.
- Exact evidence checks ignore layout whitespace and a single outer quote pair.
  Spelling, case and punctuation are not corrected. Quote existence does not prove
  that the explanation supports its band: see the separate human-readable audit.
- One stochastic response per input/prompt, a very small non-random set, historical
  examiner ratings, handwritten transcription and text-encoded visual input:
  **no accuracy guarantee, significance claim, confidence interval or official score**.
  The same inputs were used to develop/check the prompt, not a held-out test.

## Final offline-only follow-up changes

The tables below compare the frozen baseline against the PAID-TESTED revised
candidate. Its exact system prompts are archived in tested-revised-prompts.json
and verified against the recorded hashes by offline tests.

After those 12 attempts exhausted the daily allowance, final production guidance
was separated by active task type to prevent Task 1 overview requirements leaking
into Task 2, and to remind the letter assessor that addresses/dates are not required.
Those final prompt refinements were **not paid-tested**; do not attribute the
measured improvement to this final version. A deterministic feedback-item check
also now rejects blank/punctuation-only items and invalid counts, rather than
showing malformed model output. No new call was made for these changes.

## Overall comparison (raw candidate outputs, before rejection)

| Phase | Published answers assessed | Overall MAE | Signed mean deviation | Within ±0.5 | Exact quotations | Accepted by current validator | Failed attempts |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline | 4 | 0.88 | -0.63 | 2/4 | 14/24 | 2/6 | 0 |
| revised | 4 | 0.63 | -0.63 | 3/4 | 22/24 | 4/6 | 0 |

| Input | Words | Published task overall | Baseline | Revised | Baseline deviation | Revised deviation |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| academic-task1-process-band5 | 156 | 5 | 4 | 5 | -1 | 0 |
| academic-task2-health-band7_5 | 375 | 7.5 | 6 | 6 | -1.5 | -1.5 |
| general-task1-letter-band5_5 | 140 | 5.5 | 6 | 5 | +0.5 | -0.5 |
| general-task2-care-band5 | 220 | 5 | 4.5 | 4.5 | -0.5 | -0.5 |
| synthetic-off-topic | 119 | not rated | 3 | 3.5 | n/a | n/a |
| synthetic-very-short | 15 | not rated | 2 | 1 | n/a | n/a |

## Criterion-level diagnostics (not examiner criterion errors)

Order: TA/TR, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy.

| Phase | Criterion | Mean criterion minus published overall (diagnostic only) | Mean absolute distance outside analyst comment range |
| --- | --- | ---: | ---: |
| baseline | TA/TR | -0.38 | 0.25 |
| baseline | CC | -0.75 | 0.50 |
| baseline | LR | -0.63 | 0.13 |
| baseline | GRA | -1.00 | 0.50 |
| revised | TA/TR | -0.63 | 0.38 |
| revised | CC | -0.63 | 0.25 |
| revised | LR | -0.75 | 0.25 |
| revised | GRA | -1.13 | 0.38 |

### Per-input detail

| Input | Analyst ranges (TA/TR, CC, LR, GRA) | Baseline bands | Revised bands | Baseline signed range distances | Revised signed range distances |
| --- | --- | --- | --- | --- | --- |
| academic-task1-process-band5 | 4–5, 5–6, 4–5, 4–5 | 4.5, 4, 4, 4 | 5, 5, 5, 4 | 0, -1, 0, 0 | 0, 0, 0, 0 |
| academic-task2-health-band7_5 | 7–8, 7–8, 7–8, 7–8 | 6.5, 6, 6.5, 5.5 | 6, 6, 6, 5.5 | -0.5, -1, -0.5, -1.5 | -1, -1, -1, -1.5 |
| general-task1-letter-band5_5 | 5–6, 5–6, 5–6, 4–5 | 6, 6, 5.5, 5.5 | 5, 5, 5, 5 | 0, 0, 0, +0.5 | 0, 0, 0, 0 |
| general-task2-care-band5 | 5–6, 4–5, 4–5, 4–5 | 4.5, 4, 4.5, 4 | 4.5, 4.5, 4, 4 | -0.5, 0, 0, 0 | -0.5, 0, 0, 0 |
| synthetic-off-topic | not rated | 3, 3, 3, 3 | 2.5, 3, 4, 4 | n/a | n/a |
| synthetic-very-short | not rated | 2, 2, 2, 2 | 1, 1, 1, 1 | n/a | n/a |

## Source and transcription notes

- **academic-task1-process-band5**: Task 1C, Script A, pp. 5 and 13; https://ielts.org/cdn/Sample-tests/ielts-academic-writing-sample-tasks-2023.pdf. Handwritten script visually transcribed; original paragraph breaks retained. Cooling time read as 48-77; handwriting ambiguity is a limitation. Diagram encoded as verified ordered steps, with alternatives and units retained.
- **academic-task2-health-band7_5**: Part 2, Candidate Response 2, p. 5; https://ielts.org/cdn/computer-delivered-sample-tests-academic-writing/ielts-academic-writing-example-responses-to-parts-1-and-2-with-band-scores-and-examiner-comments.pdf. Prompt also corroborated at https://ted-ielts.com/health-essay/; apostrophes normalised to ASCII, spelling/grammar preserved.
- **general-task1-letter-band5_5**: Task 1, Script A, p. 2; https://ielts.org/cdn/computer-delivered-sample-tests-general-training-writing/ielts-general-training-writing-example-responses-to-parts-1-and-2-with-band-scores-and-examiner-comments.pdf. Question verified in https://ielts.org/cdn/Sample-tests/ielts-general-training-writing-sample-tasks-2023.pdf p. 3.
- **general-task2-care-band5**: Task 2, Script A, p. 3; https://ielts.org/cdn/computer-delivered-sample-tests-general-training-writing/ielts-general-training-writing-example-responses-to-parts-1-and-2-with-band-scores-and-examiner-comments.pdf. Question verified in the General Training 2023 sample tasks p. 5; apostrophes normalised to ASCII.
- **synthetic-off-topic**: Not examiner-rated; Original synthetic stress test. 
- **synthetic-very-short**: Not examiner-rated; Original synthetic stress test. 

## Reproducing this work

Raw responses, input hashes, prompt hashes, validation decisions and numeric
diagnostics are in artifacts/api-server/src/benchmarks/results/.
Do not rerun paid assessments as part of a build or test.
The runner's revised phase uses the CURRENT production prompt; reproducing the
historical candidate requires the archived tested-revised-prompts.json instead.

Offline tests (no paid calls):

    cd artifacts/api-server
    ../../scripts/node_modules/.bin/tsx --test src/benchmarks/rubric.test.ts
    ../../scripts/node_modules/.bin/tsx src/benchmarks/summarise.ts

A fresh PAID run needs new explicit owner approval, enough existing daily capacity,
and the managed API workflow stopped to avoid parallel ledger access. The runner
refuses existing result files to prevent accidental repeat spending. Archive old
results deliberately, never delete/reset the usage ledger. Then run one phase:

    ../../scripts/node_modules/.bin/tsx src/benchmarks/run.ts --consent-paid --api-stopped --phase=baseline

For the revised phase use --phase=revised, then restart the managed API workflow.
Do not increase limits, swap models, retry failed calls or publish without approval.
