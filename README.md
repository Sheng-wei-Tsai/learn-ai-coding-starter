# Sloperator

A tree-walking interpreter for SlopLang, written in Python.

## Quick Start

```bash
uv run sloperator.py examples/fib.slop         # run a program
uv run sloperator.py --check examples/fib.slop # syntax check only
uv run playground/server.py                   # playground at http://localhost:8080
```

## Validation

```bash
uv run pytest -q          # tests
uv run ruff format --check # formatting
uv run ruff check         # linting
uv run ty check           # type checking
```

## Language

See the [SlopLang specification](docs/spec.md).

## Layout

- `sloperator.py` — command-line entry point.
- `sloperator/` — lexer, parser, evaluator, and runner.
- `examples/` — sample programs.
- `tests/` — pytest suite.
- `playground/` — web server and editor.
