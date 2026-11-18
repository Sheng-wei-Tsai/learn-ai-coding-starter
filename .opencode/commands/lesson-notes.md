---
description: Add course notes for a submitted lesson and push them
---

Update the course notes for lesson $ARGUMENTS.

Follow the notes workflow in AGENTS.md:

1. Read `notes/README.md` and match its existing style (newest lesson first, English takeaways
   plus a short 中文摘要).
2. Insert a new section dated today, including the XP gained when it is known.
3. Cover what the lesson asked, what changed in this repo (files and behavior), the key
   takeaways, and the Chinese summary.
4. Commit as `notes: <lesson title>` and push to `origin main`.

If the lesson number is missing, infer it from the most recent lesson output in this
conversation and confirm it before writing.
