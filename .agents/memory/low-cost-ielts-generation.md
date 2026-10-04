---
name: Low-cost IELTS generation
description: Reliability lessons from enabling the inexpensive IELTS model.
---

Prefer task-specific, constrained generation formats over one generic schema covering every IELTS task. Use explicit content requirements for letters and concrete numeric rows for Academic Task 1.

**Why:** During activation, the inexpensive model with minimal reasoning produced missing visual data and a letter without the three required content points. Task-specific structures with low reasoning produced usable questions without automatic retries.

**How to apply:** Preserve this constraint when broadening question generation. Validate new visual types and complete letter requirements before displaying them. A successful API response proves connectivity, not grading accuracy; benchmark scores against examiner-rated examples before making accuracy claims.