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

## Course notes workflow

After every successful lesson submission (`bootdev run -s ...`):

1. Insert a new section at the top of `notes/README.md`, below the intro and above the previous
   newest lesson.
2. Each section starts with `## <number> — <title> · YYYY-MM-DD · +XP`, then covers what the
   lesson asked, what changed in this repo (files and behavior), `**Key takeaways**` in
   English, and a short `**中文摘要**`.
3. Commit as `notes: <lesson title>` and push to `origin main`.

Run `/lesson-notes <lesson>` to do this on demand.

## Conventions

- `docs/spec.md` is the source of truth for language behavior; update it with any language change.
- Every language change ships with tests in `tests/`. Programs in `examples/` must run cleanly,
  which `tests/test_examples.py` enforces.
