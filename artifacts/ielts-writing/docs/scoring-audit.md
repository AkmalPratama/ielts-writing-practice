# Quotations, examiner comments and remaining scoring risks

## Results and interpretation

Twelve approved GPT-5 nano attempts were completed: six baseline and six revised.
The app's ledger advanced from 8 to 20; no retry or extra call was made.
The four published answers cover both modules and both tasks. The synthetic
answers test wholly off-topic writing and a 15-word letter. Historical examiner
bands range from 5 to 7.5 in the final published set.

**The paid-tested candidate is better on some checks, not reliably calibrated.**
Raw overall MAE changed from 0.875 to 0.625 bands, with 2/4 then 3/4 raw estimates
within half a band. Signed mean deviation remained -0.625: the under-scoring bias
did not disappear. Two revised published-answer outputs would be rejected for
inexact quotations, so raw score closeness is not delivered-feedback reliability.
The final task-specific prompt refinements were made afterwards and have only
offline checks, not a fresh paid comparison.

True numeric per-criterion error could not be measured: the official sources
publish only task overall bands and prose comments. The companion report gives
criterion-minus-overall diagnostic spreads and distances to predeclared **analyst**
ranges inferred from comments. Those are not examiner criterion scores.

## Quotation audit

Baseline exact contiguous evidence fields: **14/24**. The ten failures mainly
concatenated several individually real excerpts with quotation marks, semicolons,
“and”, or interpretation. This does not mean ten invented quotations; it means
ten fields fail the single-contiguous-quote contract.

Revised exact evidence fields: **22/24**. Both failures changed case:

- Health essay, Lexical Resource: model used “they like …” where the essay has
  “They like …”.
- Care essay, Lexical Resource: model used “The old Peoples …” where the
  essay has “the old Peoples …” within a longer sentence.

Both full responses are rejected by the production validator. No case correction,
replacement evidence, silent repair, substitute score or automatic retry is used.
Only layout whitespace and one surrounding pair of quotation marks are ignored.

### Presence is not evidential support

The following concerns require judgment and are **not** solved by substring checks:

| Input | Baseline comment/quote audit | Paid-tested revised comment/quote audit |
| --- | --- | --- |
| Academic process | The introductory definition is good evidence of the absent overview. Calling chronological progression “erratic” conflicts with the examiner's clear-progression comment. It incorrectly calls a 156-word answer below 150. | Missing overview is identified and the task overall moves from 4 to the published 5. Coherence 5 is closer to the examiner's prose. However, “untill the clay level.” mainly demonstrates a spelling error, not grammatical range; the explanation mentions “drier”, absent from the essay, and overstates sequencing problems. |
| Academic health | Position is recognised, but the four scores substantially underrate the published 7.5. Accurate complex sentences are quoted while claiming grammatical errors, without showing those errors. External-source/data absence is mentioned despite not being required. | Overall remains 6, still 1.5 bands low. It wrongly asks for an overview-style paragraph. Lexical/GRA evidence points to spelling and word choice, but does not justify the claimed frequency/impact of grammatical errors. Strengths contain blank/punctuation/serialization fragments; the final sanitizer rejects such output as well as its case-mismatched quote. |
| General letter | Purpose and requested room are recognised. It wrongly says the 140-word letter meets 150, and gives blank advice. Grammar 5.5 is above the conservative analyst range derived from the examiner's frequent-error comment. | Word count is correctly recognised; the estimate moves from 6 to 5 against the published 5.5. Purpose, problems and accommodation request are covered in the explanation. All quotes match, with a run-on sentence providing genuine grammatical evidence. Some comments are still more severe than the examiner's judgment. |
| General care | Recognises relevant care/funding ideas but overstates missing position; the examiner says the view is apparent. Several evidence fields concatenate snippets. | Correctly flags 220 words and weak development. Overall stays 4.5 against the published 5. The “If they could …” quote supports ambiguity but is weak evidence for the entire task response; the lexical case mismatch rejects this response. Six improvements also violate the final 3–5-item check. |
| Synthetic off-topic | Correctly identifies the unrelated hobby, but gives all four criteria 3. It claims no complex structures while quoting an “Although …” subordinate clause. | Separates scores to 2.5/3/4/4, but still ignores the prompt's wholly-unrelated TR 1 guidance and the CC low-relevance descriptor. Linguistic range is still under-described. This is a failed rubric stress check, not an examiner-scored overall comparison. |
| Synthetic 15-word letter | Gives 2 in every criterion despite the public 20-word rule. Some praise/advice is generic. | Gives 1 in every criterion and no unwarranted strengths: the short-answer score check passes. However, advice wrongly requests addresses/dates and the wrong conventional closing for “Dear Sir or Madam”. The final task-specific guidance explicitly corrects those instructions, without claiming a paid retest. |

## Criterion-level trends

Mean absolute distances **outside analyst comment ranges**, baseline → candidate:

- Task Achievement/Response: 0.25 → 0.375, worse.
- Coherence and Cohesion: 0.50 → 0.25, better.
- Lexical Resource: 0.125 → 0.25, worse.
- Grammatical Range and Accuracy: 0.50 → 0.375, better.

These do not establish criterion accuracy. In particular, matching an overall
band can conceal a different or wrong criterion profile. The higher-band essay
remains under-scored and the off-topic test remains non-compliant.

## Changes and their verification status

Paid-tested candidate changes: explicit public descriptor anchors, supplied word
counts, independent criteria, the 20-word rule, stronger relevance/overview
guidance, no external-source requirement, and one exact quote per criterion.

Production safeguards checked offline:

- Reject invalid criterion names/order, band range/steps and contradictory
  20-word scores.
- Reject quotes absent from the submitted essay; never fabricate replacements.
- Reject empty/punctuation-only strengths or advice and invalid item counts.
- Give only the active task's instructions, keeping letter and visual-report
  conventions out of Task 2; explicitly exclude letter addresses/dates.
- Preserve explicit cost/privacy consent, GPT-5 nano, the 20-attempt Jakarta cap,
  failed-attempt accounting and zero SDK/frontend retries.

No model upgrade, storage purchase or deployment was made. The request cap is
not a dollar cap. Actual provider token usage was not captured, so the initial
cost estimate is not reported as a measured bill.

## What would establish stronger evidence

A fresh owner-approved comparison of the final prompt on a held-out set with
independently assigned criterion scores, broader bands, multiple visual/task
types and repeated independent assessments. Such a study must budget repeated
calls explicitly, use the existing daily cap and never retry failures
automatically. Until then, use this app for uncertain practice feedback, not an
official score or a dependable prediction.

Sources, source-page locations, transcription limitations, raw responses and
reproduction instructions are in [the benchmark report](scoring-benchmark.md).