# learn-ai-coding-starter

## Run and verify

- Use `uv` from the repo root; `.python-version` pins Python 3.13.
  `uv.lock` is Git-tracked but excluded from ordinary search by `.ignore`.
- Run: `uv run sloperator.py examples/hello.slop`. Insert `--check` before the filename to tokenize and parse without evaluating.
- Focused test: `uv run pytest -q tests/test_evaluator.py -k <pattern>`.
  Full checks: `uv run pytest -q`, `uv run ruff format --check`, `uv run ruff check`, `uv run ty check`.

## Interpreter and playground

- `sloperator.py` delegates to `sloperator/runner.py`. Use `run_source()` for end-to-end
  language tests: it runs lexer → parser → evaluator and returns `stdout`, `stderr`,
  and `exit_code` without a subprocess.
- `docs/spec.md` defines language behavior; update it and add tests for language changes.
  `tests/test_examples.py` runs every `examples/*.slop` and requires nonempty stdout with no errors.
- `uv run playground/server.py [port]` serves the editor on localhost (default 8080).
  `POST /run` invokes the CLI with a five-second timeout and appends results to root-level `logs/runs.log`.
- OpenCode's `run_slop` tool is registered by `.opencode/plugins/run-slop.ts`.
  It runs the CLI from the project root with `uv run --no-active`; use the CLI directly if the tool isn't loaded.

## Lesson runs

- Run the requested `bootdev run` command verbatim from the repo root. Never add `-s`;
  without it, tell the user the result wasn't recorded and that `-s` submits for credit.
- If any step fails, report it and stop before writing notes or pushing.
- On success, prepend an entry after the intro in `notes/README.md`. Use the CLI's
  lesson number and title: `## <number> — <title> · YYYY-MM-DD · +<XP> XP`.
  Omit XP for check-only runs. Cover the task, files and behavior changed, English
  `**Key takeaways**`, and a short `**中文摘要**`. `/lesson-notes <lesson>` runs this workflow on demand.
- Commit the lesson changes and notes as `notes: <lesson title>` and push to `origin main`. Never push to `upstream`, the Boot.dev starter.

## Chapter study guides

- When the user pastes a chapter curriculum, write `notes/chapters/<kebab-case-title>.md`,
  commit as `notes: <chapter title> chapter guide`, and push to `origin main`.
- Keep it readable in one sitting: thesis and mental model, command/rule cheat sheet,
  tricky details and repo pitfalls, spaced review and active-recall questions with hidden
  answers, short 中文摘要, and mnemonic.
