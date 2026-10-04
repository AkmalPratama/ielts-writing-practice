---
name: Generated client DOM types
description: Compiler-library requirement for current Orval fetch output
---

Include iterable DOM definitions when configuring the generated API client.

**Why:** Modern Orval fetch generation uses Headers.entries in mutation request helpers. A plain DOM compiler library can compile queries but fail as soon as mutations are generated.

**How to apply:** Preserve dom.iterable when updating the client compiler configuration or regenerating a client with mutation endpoints.