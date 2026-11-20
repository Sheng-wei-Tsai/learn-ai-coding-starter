# Course Notes

Notes and key takeaways from Boot.dev's **Learn AI Coding** course, kept newest-first.
Each entry records what the lesson asked, what changed in this repo, and what to remember.

Workflow: after every passing lesson run, a new section is added here and pushed.
See `AGENTS.md` for the rule, or run `/lesson-notes` to do it on demand.

Chapter study guides (mental models, cheat sheets, self-tests) live in [`chapters/`](chapters/).

---

## 4.8 — Speech to Text · 2026-11-20 · +128 XP

**What the lesson asked:** create `examples/countdown.slop` from a *dictated* instruction —
SlopLang that prints 3, 2, 1 on separate lines, then prints `liftoff`. Review the transcription
before sending it.

**What changed:**

- `examples/countdown.slop` — `slop n = 3✨`, `ralph n > 0` printing then decrementing, and a final
  `hallucinate(“liftoff”)✨`.
- Initially committed with `later` as the last line (`682ae09`); the lesson's output check caught it,
  and `8e77b18` corrected the word.

**Key takeaways**

- Speech-to-text fails *quietly* on rare words: `liftoff` became `later` — a real English word, so
  nothing looked garbled and no spellcheck fired. The damage showed up only as wrong output.
- Reading the transcription back is not the same as trusting it. I flagged `later` as the one risky
  word and still shipped it; the honest move was to ask before sending, not after.
- The lesson check was the actual reviewer: it compared stdout against `3 / 2 / 1 / liftoff` and
  failed on a single word. Executable expected output catches transcription errors that prose
  review waves through.
- A countdown needs no `for` loop: a `slop` counter with `ralph n > 0` and `n = n - 1` is idiomatic
  here, and `hallucinate(number)` prints digits bare.
- A failing lesson step means stop — no notes, no push — then fix and resubmit. The second run
  passed both steps and gained the XP.

**中文摘要**

课程要求根据**语音转写**的指令创建 `examples/countdown.slop`：打印 3、2、1 再打印 `liftoff`。
转写把 `liftoff` 听成了 `later`，而 `later` 是合法英文单词，所以没有任何乱码或拼写提示，错误
只体现在输出上。第一次提交因此失败；改成 `liftoff` 后重新提交通过。教训：语音转写对生僻词是
**静默出错**，回读转写文本时要主动质疑可疑词，最好直接问；可执行的期望输出才是真正的校对。
实现上用 `ralph n > 0` 递减计数即可，不需要 `for`。

---

## 4.6 — Queueing · 2026-11-20 · +128 XP

**What the lesson asked:** `hallucinate(1 / 0)✨` crashed with a Python traceback. It had to become a
SlopLang runtime error reading `division by zero`, keep the correct line number while preserving
output printed before the failure, and ship with a test. The lesson's prompt-box skill was
**queueing**: `Ctrl+X` then `Enter` holds a prompt until the running turn finishes, instead of
`Enter` alone, which steers it.

**What changed:**

- `sloperator/evaluator/interpreter.py` — the `TokenType.SLASH` branch now checks the right operand
  before calling `truncating_divide` and raises `SlopRuntimeError(operator.line, "division by
  zero")`.
- `tests/test_errors.py` — one parametrized row, `("hallucinate(1 / 0)✨", "runtime", 1, "division
  by zero")`; suite 128 → 129.

**Key takeaways**

- `ZeroDivisionError` is not a `SlopError`, so it slipped straight through `run_program`'s
  `except SlopError` and escaped as a traceback. The interpreter's contract is "only SlopLang
  errors leave the evaluator" — every new arithmetic path has to uphold it.
- The guard belongs in `binary`, not inside `truncating_divide`: only the caller holds the operator
  token, and the diagnostic needs that token's line.
- Ordering the guard after the numeric-operand check keeps `"a" / 0` a type error rather than
  mislabelling it as division by zero — the first invalid thing wins.
- A parametrized error-table test is the cheap way to pin kind, line, message, and exit code at
  once. Because the table runs through `run_source`, an escaping Python exception fails the test
  instead of hiding behind a caught error.
- `Enter` while the agent works **steers**; `Ctrl+X` then `Enter` **queues**. Same key, two
  intents — steering changes the current turn, queueing waits its turn.

**中文摘要**

`1 / 0` 之前抛出 Python 的 `ZeroDivisionError`，它不属于 `SlopError`，所以绕过 `run_program` 的
捕获变成 traceback。修复方式是在 `binary` 的除法分支里先检查除数为零，用运算符所在行号抛出
`SlopLang runtime error at line 1: division by zero`；放在调用处而不是 `truncating_divide`
内部，是因为只有调用方持有 token 的行号。参数化错误测试表一次性校验类型、行号、消息和退出码。
同时记住提示框的区别：agent 运行中按 `Enter` 是**转向**，`Ctrl+X` 再 `Enter` 才是**排队**。

---

## 4.5 — The Prompt Box · 2026-11-20 · +328 XP

**What the lesson asked:** create `examples/doubling.slop` that doubles the number 13 and prints
26, using the prompt box properly — attach `docs/spec.md` and `examples/hello.slop` with `@`,
write a multiline prompt with the task separated from its expected output, then verify with shell
mode.

**What changed:**

- `examples/doubling.slop` — `clanker double(number)` shipping `number * 2`, called once with 13.
- `notes/chapters/the-prompt-box.md` — the chapter study guide this lesson belongs to.
- Included in `notes: The Prompt Box chapter guide` (`b3feb63`).

**Key takeaways**

- Attaching exact sources beats describing them; `@docs/spec.md` removed any guesswork about
  terminators, comment syntax, or statement shape.
- The `Expected output: 26` block is what made verification possible. The sample snippet printed
  42 from 21, so without a written target it would have been easy to reproduce 42 by habit.
- Changing the input from 21 to 13 is deliberate: it forces you to understand the code rather than
  transcribe it.
- Shell mode (`!` command) turns a claim into evidence, and its output joins the session, so the
  next prompt can refer to the real result.
- `--check` first, then run, then the full suite — three cheap layers instead of one trusting one.

**中文摘要**

用 `@` 附加 `docs/spec.md` 与 `examples/hello.slop` 提供准确上下文，多行提示把任务与预期输出
（13 → 26）分开，再用 shell 模式运行确认输出。把示例里的 21 改成 13 是为了避免照抄，真正理解
`clanker` + `ship` 的组合；最后用 `--check`、实际运行和完整测试三层确认。

---

## 4.4 — Steering · 2026-11-19 · +326 XP

**What the lesson asked:** add a CLI flag that validates a file's syntax without executing it.
Partway through, the request was steered: use `--check` instead of the originally named
`--validate`.

**What changed:**

- `sloperator/runner.py` — new `check_program()` that tokenizes and parses without touching the
  interpreter, plus a shared `raise_recursion_limit()` so check mode is as safe as a real run.
- `sloperator.py` — parses `--check` before the path; exit `0` valid, `1` lexical/syntax error on
  stderr, `2` unreadable file or bad usage. Success prints nothing.
- `tests/test_cli.py` — four cases: valid file, syntax error proven not to execute, runtime error
  still accepted, missing filename.
- `docs/spec.md` and `README.md` — one line documenting the flag beside the run command.

**Key takeaways**

- Steering is cheap when it arrives before code is written: the flag name changed and nothing had
  to be undone. Read the steer as a correction to the requirement, not to the task.
- "Check" means lex and parse only. A program with an undefined variable is syntactically valid,
  so it must pass — mixing in runtime checks would make the flag a different feature.
- Silent success plus meaningful exit codes is what makes a validator usable in scripts and
  pre-commit hooks.
- Proving "does not execute" needs a program that prints *before* the syntax error, then asserting
  stdout is empty. Exit code alone can't distinguish "not run" from "ran and failed".
- Sharing the recursion guard kept check mode from being accidentally weaker than a real run on
  deeply nested input.

**中文摘要**

新增 `--check` 参数：只做词法与语法分析、不执行程序，语法正确返回 0，语法错误返回 1 并输出
原有错误格式。中途收到 steering 消息把 `--validate` 改名为 `--check`，因为当时还没写代码，
改名没有返工成本。验证「不执行」时必须用先打印再报错的程序，断言 stdout 为空。

---

## 4.2 — Plan Agent · 2026-11-18 · +387 XP

**What the lesson asked:** add `loadbearing` to SlopLang — an immutable variable declaration
(`const`-like). It must require an initializer, share `slop`'s scoping rules, forbid
reassignment with `cannot assign to loadbearing '<name>'`, and forbid same-scope redeclaration.
Plan the work before touching code, and document it in the spec.

**What changed:**

- `lexer/tokens.py` — new `TokenType.LOADBEARING` and a `KEYWORDS` entry.
- `parser/parser.py` — `declaration()` matches either keyword and passes `mutable` into
  `var_decl`, so one code path serves both declarations.
- `evaluator/environment.py` — `Binding` gained a `loadbearing` flag; `assign` chooses the
  message between `cannot assign to loadbearing 'X'` and the existing immutable-binding text.
- `evaluator/interpreter.py` — `VarDecl` declares with `loadbearing=not mutable`.
- `docs/spec.md` — keyword table, Variables section, grammar rule, error example.
- `examples/loadbearing.slop` — runnable demo; `tests/` grew from 111 to 123 tests.

**Key takeaways**

- The `Environment` already enforced same-scope redeclaration, so a new declaration keyword
  reused that rule for free — check what the runtime already guarantees before adding checks.
- One `VarDecl` node with a `mutable` flag is cheaper than a parallel AST node; the distinction
  only matters where behavior differs (rebinding and the error message).
- Two kinds of immutability (loadbearing vs clanker/builtin) meant two messages. Reusing one
  generic message would have made `f = 2` claim it was a loadbearing.
- Shadowing an outer `loadbearing` in an inner scope is legal; assigning to it is not. Scope
  lookup decides which of those happens.
- Planning first surfaced the real open questions — message wording, redeclare behavior, doc
  scope — instead of inventing answers mid-implementation.

**中文摘要**

实现了 `loadbearing` 不可变变量：必须有初始值，作用域规则与 `slop` 相同，外层常量可以在内层
被遮蔽，但重新赋值会报 `cannot assign to loadbearing 'X'`，同作用域重复声明沿用原有错误信息。
关键点是复用已有的 `Environment.declare` 重声明检查，用 `VarDecl.mutable` 区分两种声明，
并让 `Binding` 记录类型以区分 loadbearing 与 clanker 的报错文案。

---

## 4.1 — Prompting · 2026-11-17 · +187 XP

**What the lesson asked:** make `\t` in `examples/tab.slop` print a real tab instead of the
letter `t`, then prove it with tests.

**What changed:**

- `lexer/scanner.py` — `ESCAPES["t"]` was `"t"`; corrected to `"\t"`.
- `examples/tab.slop` — created the demo program `hallucinate(“name\tscore”)✨`.
- `tests/test_lexer.py` — one test covering all four escapes in a single assertion.

**Key takeaways**

- A hand-written escape table is a map from source characters to output characters; a typo in
  the value looks like valid code and silently emits the wrong character.
- The spec already documented `\t`, so the docs were the source of truth and the code was
  wrong — read the spec before assuming behavior is unspecified.
- Verify byte-level output (`od -c`) when the bug is about invisible characters; eyeballing
  terminal output hides tabs versus spaces.

**中文摘要**

转义表里 `"t": "t"` 写错，导致 `\t` 输出字母 t，改成 `"\t"` 即可。规范本来就写明支持 `\t`，
所以以文档为准。用 `od -c` 确认输出的是真正的制表符，并补充了覆盖四种转义的词法测试。

---

## 3.6 — Tool Permissions · 2026-11-17 · +124 XP

**What the lesson asked:** allow `run_slop` and `bootdev run` while requiring approval for every
other shell command, with the broad rule before the exceptions.

**What changed:**

- `opencode.jsonc` — `permissions` array: `shell *` → `ask`, then `bootdev run *` → `allow`, then
  `run_slop` → `allow`.

**Key takeaways**

- Permission rules are evaluated in order and **the last match wins**, so narrow exceptions must
  come after the broad rule they override.
- A plugin tool's permission action is its `options.permission` or, by default, its tool ID —
  a tool named `run_slop` is allowed with `{ "action": "run_slop" }`.
- A shell pattern ending in ` *` also matches the bare command, so `bootdev run *` covers
  `bootdev run` with no arguments.
- Approvals are per request unless the user picks "always"; saved approvals are project-scoped
  `allow` rules that never override a configured `deny`.

**中文摘要**

权限规则按顺序匹配、最后一条生效，所以先写宽泛的 `shell *` → `ask`，再写 `bootdev run *` 与
`run_slop` 的放行。插件工具的权限动作默认就是工具名。结尾带 ` *` 的模式也能匹配不带参数的命令。

---

## 3.5 — Create a Custom Tool · 2026-11-17 · +249 XP

**What the lesson asked:** build an OpenCode plugin tool that runs a SlopLang file with
Sloperator and returns stdout, stderr, and the exit code as JSON.

**What changed:**

- `.opencode/plugins/run-slop.ts` — `Plugin.define` plus `ctx.tool.transform(editor =>
  editor.add({ ... }))`, with a JSON-schema input of `{ path: string }`.
- `.opencode/package.json` + `bun.lock` — pinned `@opencode/plugin@2.0.3`.
- `.gitignore` — `node_modules/` so installed deps stay out of version control.

**Key takeaways**

- Any `.ts` file under `.opencode/plugins/` loads automatically; published packages need an
  entry in `plugins`.
- `options: { codemode: false }` keeps the tool a normal JSON tool call instead of exposing it
  through Code Mode.
- Run child processes with `cwd` set to `ctx.location.project.directory` so tools behave the
  same no matter where the caller's working directory points.
- Return the same JSON shape for failure and success (here `exitCode: -1` on spawn errors) so
  the model always gets parseable output.
- Verify a plugin outside OpenCode first: import the module in Bun, call `setup` with a stub
  context, and invoke the tool directly.

**中文摘要**

在 `.opencode/plugins/` 下写插件即可自动加载；用 `Plugin.define` + `ctx.tool.transform` 注册
工具，`codemode: false` 让模型直接调用。执行子进程时把 `cwd` 固定为项目根目录，成功和失败
返回相同的 JSON 结构，便于模型解析。先在 Bun 里用桩上下文验证，再交给 OpenCode 实测。
