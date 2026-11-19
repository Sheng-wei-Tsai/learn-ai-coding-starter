# learn-ai-coding-starter

SlopLang interpreter built while following Boot.dev's **Learn AI Coding** course.

- `origin` — this repo (personal, published).
- `upstream` — `bootdotdev/learn-ai-coding-starter` (course starter; never push to it).

## Stack and commands

Python 3.13 managed by `uv`, no third-party runtime dependencies.

- Test: `uv run pytest -q`
- Format check: `uv run ruff format --check`
- Lint: `uv run ruff check`
- Run a program: `uv run sloperator.py examples/hello.slop`

Layout: `sloperator/{lexer,parser,evaluator}/`, `sloperator/runner.py`, `tests/`, `examples/`,
`docs/spec.md`, `notes/`.

## Lesson runs

When the user asks to run a lesson with `bootdev run <uuid>` (for example
"Please run `bootdev run …` from the project root"), run the command exactly as given, from the
project root. Never add `-s` yourself: without it the CLI only checks the lesson. If the pasted
command had no `-s`, say the result was not recorded and remind the user to add `-s` for course
credit.

If any step fails, report the failures and stop; do not write notes or push.

When every step passes, write the notes and push:

1. Insert a new section at the top of `notes/README.md`, below the intro and above the previous
   newest lesson.
2. Each section starts with `## <number> — <title> · YYYY-MM-DD · +XP` (omit `+XP` when the run
   was not submitted, so the gain is unknown), then covers what the lesson asked, what changed
   in this repo (files and behavior), `**Key takeaways**` in English, and a short `**中文摘要**`.
3. Commit the lesson's code changes plus the notes as `notes: <lesson title>`, then push to
   `origin main`.

Run `/lesson-notes <lesson>` to do this on demand.

## Conventions

- `docs/spec.md` is the source of truth for language behavior; update it with any language change.
- Every language change ships with tests in `tests/`. Programs in `examples/` must run cleanly,
  which `tests/test_examples.py` enforces.
