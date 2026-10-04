---
name: IELTS scoring validation
description: Limits of published-score benchmarks and non-negotiable verification safeguards.
---

Do not infer official per-criterion scores from a published overall task band or examiner prose. Report overall deviations separately from any explicitly labeled analyst criterion ranges.

**Why:** Official IELTS sample-response documents provide overall task bands and qualitative comments, not numeric criterion labels. Assigning each criterion that same overall band would create misleading accuracy claims.

**How to apply:** Use independently examiner-scored criterion labels for genuine criterion error metrics. Small prompt-tuning sets and exact quotation matching do not establish score accuracy; explain both limits to learners.

Apply the public May 2023 descriptor's Band 1 rule for responses of 20 words or fewer across all four criteria; do not invent a fixed penalty for longer under-length answers.

**Why:** The initial generic prompt missed the explicit short-answer rule and sometimes miscounted answers. Descriptor-based constraints are distinct from arbitrary penalties.

**How to apply:** Supply a reproducible word count, preserve task-specific descriptor guidance and reject contradictory results rather than silently adjusting them.

Paid verification requires explicit cost approval and shares the existing Jakarta daily cap. Never reset the ledger for testing, change the model, retry automatically, add paid storage or publish without separate approval.

**Why:** The user expressly constrained verification spending and deployment scope.

**How to apply:** Reduce the batch to remaining capacity and use the same database-backed reservation path as the app. Do not revive the old file ledger or bypass accounting with a standalone benchmark. Keep development verification separate from production usage.