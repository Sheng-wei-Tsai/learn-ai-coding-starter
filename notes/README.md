# Course Notes

Notes and key takeaways from Boot.dev's **Learn AI Coding** course, kept newest-first.
Each entry records what the lesson asked, what changed in this repo, and what to remember.

Workflow: after every passing lesson run, a new section is added here and pushed.
See `AGENTS.md` for the rule, or run `/lesson-notes` to do it on demand.

Chapter study guides (mental models, cheat sheets, self-tests) live in [`chapters/`](chapters/).

---

## 6.10 — Undo and Redo · 2026-11-28 · +138 XP

**What the lesson asked:** Add a unary-minus regression test, undo the addition,
then redo it and verify that the restored test passes.

**What changed:** `tests/test_unary_minus.py` checks that unary minus rejects both
boolean literals with the expected runtime error. After undo, the file was absent
and Git reported no changes under `tests/`. After redo, both cases passed.
Boot.dev passed the restored-test check and awarded 138 XP.

**Key takeaways**

- Verify undo and redo against the working tree: check that the file is gone
  after undo and rerun the test after redo.
- Checking the runtime diagnostic as well as the exit code confirms that unary
  minus rejected the boolean for the intended reason.

**中文摘要**

本課新增回歸測試，確認一元負號會拒絕兩種布林值並回報預期的執行錯誤。
復原後確認測試檔已移除，重做後兩個案例皆通過，課程獲得 138 XP。

---

## 6.9 — Configure Compaction · 2026-11-28 · +336 XP

**What the lesson asked:** Enable automatic compaction, retain 10,000 recent tokens,
and reserve a 20,000-token buffer.

**What changed:** `opencode.jsonc` now sets `compaction.auto` to `true`,
`compaction.keep.tokens` to `10000`, and `compaction.buffer` to `20000`.
The Boot.dev submission passed and awarded 336 XP.

**Key takeaways**

- `keep.tokens` controls how much recent conversation stays alongside the summary.
- `buffer` is the amount of context to leave free; a larger buffer triggers
  automatic compaction earlier.

**中文摘要**

本課在 `opencode.jsonc` 啟用自動濃縮，讓摘要保留約 10,000 個 token 的近期對話，
並預留 20,000 個 token 的上下文空間。課程檢查通過，獲得 336 XP。

---

## 6.8 — Compaction · 2026-11-27

**What the lesson asked:** Understand how OpenCode keeps long sessions going. A raw
model API can reject an oversized request; OpenCode automatically compacts the
session as it approaches the model's context limit.

**What changed:** Added these notes in `notes/README.md`; this lesson did not require
an interpreter or configuration change.

**Key takeaways**

- Compaction is lossy. OpenCode continues with a summary and some recent context.
  Earlier messages are still saved on disk, but details omitted from the summary
  may no longer be in the model's active context.
- Use `/compact` to compact manually at a natural checkpoint, such as after finishing
  a task. Tell it what to preserve: the goal, key files, constraints, decisions,
  failed attempts, and the next step.

**中文摘要**

OpenCode 接近模型的上下文上限時，會自動將對話濃縮成摘要，並保留部分近期內容。
舊訊息仍存在磁碟上，但省略的細節可能不再出現在模型的上下文中。完成一個階段後，
可用 `/compact` 手動濃縮，並指定要保留的目標、限制、決策與下一步。

---

## 6.7 — Lost in the Middle · 2026-11-27 · +136 XP

**What the lesson asked:** Put the goal and key constraints up front. The *Lost in the
Middle* study found that models often retrieve information better from the beginning or
end of a long context than from its middle.

**What changed:** `README.md` is now 32 lines, with all `uv run` commands on lines
8–19. It links to `docs/spec.md` for the language specification. The example ran and
passed syntax checking; all 139 tests, formatting, lint, and type checks passed.
The submitted lesson passed all three README checks and awarded 136 XP.

**Key takeaways**

- A large context window doesn't guarantee that every part gets used equally well.
  The effect varies by model and task, and fact retrieval differs from instruction following.
- In long prompts and reusable templates, state the goal and must-follow constraints
  first. Put supporting material after them, and consider a short reminder at the end.

**中文摘要**

模型在長上下文中，通常較容易找回開頭或結尾的資訊；效果因模型與任務而異，找資料也不同於遵循指令。
撰寫長提示時，先列目標和關鍵限制，必要時在結尾簡短提醒。本次將執行與驗證指令移到 README 前 20 行，
語言規格則直接連到 `docs/spec.md`。課程三項檢查全部通過，獲得 136 XP。

---

## 6.5 — File Watcher · 2026-11-27 · +136 XP

**What the lesson asked:** understand that OpenCode watches the filesystem so it can reload
watched skills and plugins while running, that watching cannot merge conflicting edits, and that
`watcher.ignore` in `opencode.jsonc` suppresses events for matching paths without stopping the
agent from searching or reading them. The lesson also advises leaving the option alone unless
watcher noise is actually a problem.

**What changed:**

- `opencode.jsonc` — added `"watcher": { "ignore": ["logs/**"] }` so playground run logs stop
  producing filesystem events. The pattern is root-relative, matching where the playground writes
  (`<root>/logs/runs.log`).
- Validation: the file still parses as JSONC after stripping comments, and the `watcher` block
  reads back as `{"ignore": ["logs/**"]}`. The submitted lesson passed its check (playground logs
  are excluded from the file watcher) and awarded 136 XP.

**Key takeaways**

- The watcher is a live-reload mechanism for skills and plugins, not a safety net for edits. Two
  writers touching the same file can still conflict, and edit tools fail when their expected text
  has moved — review the diff whenever you and an agent share a file.
- `watcher.ignore` is orthogonal to `.gitignore` and `.ignore`: it filters filesystem events only.
  The agent can still search and read those paths, so it is not a privacy or context control.
- Patterns are globs relative to the project root, and `**` is needed to cover nested files.
- Config is read at startup, so a watcher change applies on the next session, not immediately.
- Default to not touching this option. Add entries only for paths that genuinely churn, like
  rebuild artifacts or append-only logs.

**中文摘要**

本课讲 OpenCode 的文件监视器：它监听文件变化以便热重载 skills 和插件，但无法合并冲突编辑，
所以与 agent 同时改同一文件时要看 diff。`opencode.jsonc` 里的 `watcher.ignore` 只屏蔽文件系统
事件，不影响 agent 搜索或读取这些文件，因此不是隐私或上下文控制手段。本次为 playground 日志
加入 `logs/**`。配置在启动时读取，需重启会话生效；除非确实遇到监视噪音，否则不建议改动此项。
课程检查通过，获得 136 XP。

---

## 6.4 — Ignoring Files · 2026-11-27 · +405 XP

**What the lesson asked:** keep noisy files out of the agent's context. OpenCode's content
searches use ripgrep, which honors `.gitignore` by default, so generated output, dependency
trees, large logs, and binary blobs should be ignored the normal way. When a path needs to be
searchable despite `.gitignore`, or excluded without changing what Git tracks, add a `.ignore`
file at the project root.

**What changed:**

- `.gitignore` — added `logs/`. The playground writes run history to `<project root>/logs/runs.log`
  (`playground/server.py`), so the entry sits at the repo root rather than under `playground/`.
- `.ignore` — new file containing `uv.lock`, so ripgrep-based searches skip the ~16 KB lockfile
  while Git keeps tracking it.
- Validation: `git check-ignore -v logs/runs.log` reports the new rule, and `git ls-files uv.lock`
  still lists the lockfile. The submitted lesson passed all three checks (Git ignores playground
  logs, the lockfile is excluded from ordinary search, Git still tracks the lockfile) and awarded
  405 XP.

**Key takeaways**

- `.gitignore` is the default lever: it shapes both what Git tracks and what ripgrep searches,
  so ordinary hygiene (`.venv/`, caches, logs) covers most context bloat.
- `.ignore` is the escape hatch. It only affects search tools, never Git, which makes it the right
  place for files that must stay committed but are noise to read.
- Ignoring is a hint, not a wall: explicit file patterns can override exclusions, and the agent
  can still open an ignored file directly when it genuinely needs to.
- Put the pattern where the file actually lives. The playground's log path resolves to the project
  root, so `logs/` at the root is correct and `playground/logs/` would have been wrong.

**中文摘要**

本课讲如何避免无关文件撑爆上下文：ripgrep 默认遵守 `.gitignore`，所以构建产物、依赖目录、
大日志和二进制文件照常忽略即可。若想让被 `.gitignore` 覆盖的路径仍可被搜索，或想排除某文件
但不影响 Git 跟踪，就在项目根目录建 `.ignore`。本次在 `.gitignore` 加入 `logs/`（playground
的日志实际写在项目根目录），并新建 `.ignore` 写入 `uv.lock`，让搜索跳过锁文件而 Git 继续跟踪。
课程三项检查全部通过，获得 405 XP。

---

## 6.3 — New Sessions · 2026-11-26 · +335 XP

**What the lesson asked:** allow `hallucinate` to accept any number of arguments, print
them separated by spaces with a final newline, and print a blank line when called without
arguments. Update the tests and language specification.

**What changed:**

- `sloperator/evaluator/interpreter.py` — replaced the one-argument restriction with a
  space-joined sequence of stringified arguments followed by a newline.
- `tests/test_evaluator.py` — covered zero, one, and multiple arguments, mixed value types,
  empty strings, and the unchanged `nil` return value.
- `docs/spec.md` — documented variadic output and the blank-line case with examples.
- `README.md` — updated the quick-reference description of `hallucinate`.
- Validation: all 139 tests, formatting, and lint passed. The submitted lesson passed all
  three checks and awarded 335 XP.

**Key takeaways**

- A focused task can be verified from the current files without relying on earlier session
  history; inspect existing changes before overwriting or duplicating work.
- Joining stringified values with `" "` preserves existing value formatting and adds no
  trailing separator. Joining an empty list naturally produces the blank-line case.
- Test exact output, including spaces and newlines, and preserve return-value behavior when
  changing a built-in's accepted arguments.

**中文摘要**

本课让 `hallucinate` 支持任意数量参数：参数之间用一个空格分隔，最后换行；
没有参数时输出空行，返回值仍为 `nil`。测试涵盖混合类型、空字符串及返回值，
并同步更新规范与 README。139 项测试、格式和 lint 检查通过，课程提交获得 335 XP。

---

## 6.2 — Context As RAM · 2026-11-25 · +333 XP

**What the lesson asked:** treat the model's context window as working memory, like RAM: give the
agent relevant task details without bloating its input with unrelated information. The practical
exercise was to fix comment-related line tracking and add a regression test so `— a comment\n@`
reports a lexical error on line 2, not line 1.

**What changed:**

- `sloperator/lexer/scanner.py` — removed the comment branch's newline consumption. The regular
  newline handler now increments the line counter, including after consecutive comments.
- `tests/test_lexer.py` — added the exact reproducer to the lexical-error cases, checking the
  line number, message, and formatted error. Confirmed it failed before the fix.
- Validation: all 133 tests, formatting, lint, and type checks passed. The submitted lesson
  passed all three checks, including consecutive comments and blank lines.

**Key takeaways**

- **Context is working memory, not an archive.** Like hoarding browser tabs, retaining unrelated
  information uses capacity without helping the current task.
- The lesson's token-generation model is `input tokens → model → next token`. Irrelevant input
  can make inference slower and more expensive, confuse the model, and increase bad responses.
- Reading files, fetching web content, and using tools add data—or sometimes summaries—to
  context. Tool output is part of the memory budget, not free background activity.
- In the lesson's OpenCode interface, the right-hand sidebar's **Context** section shows usage
  in tokens and as a percentage of the model's maximum context window.
- **Optimize relevance, not just brevity.** Agents can discover files and folders, but a useful
  prompt still supplies the details needed for the task, just as when briefing a coworker.
  Here, the reproducer, expected line number, scanner path, and regression-test path were relevant.
- Exercise-specific lesson: keep newline accounting in one place and assert diagnostic locations
  in regression tests. Watching the new test fail before the fix established that it caught the bug.

**中文摘要**

把 context window 当作 RAM：它是当前任务的工作记忆，不是所有资料的仓库。读文件、抓网页、
使用工具都会把内容或摘要放进上下文；无关信息会增加延迟和成本，也可能干扰回答。课程中的
OpenCode 右侧 Context 区显示 token 用量及占上限的百分比。提示词要追求相关性，而不只是短：
像交代任务给同事一样，给足复现步骤、预期行为和相关路径，省略无关故事。本次练习修复了注释
吞掉换行导致行号错误的问题，并用回归测试验证；提交通过，获得 333 XP。

---

## 5.6 — Task Permissions · 2026-11-23 · +132 XP

**What the lesson asked:** add a project-level permission rule that denies the `subagent` action for
the `explore` resource, then confirm the child agent can no longer be launched. The lesson's fuller
example shows the general shape: a catch-all `subagent` deny, then narrower exceptions — a glob
resource like `orchestrator-*` to allow a family of subagents, and `code-reviewer` with `effect: "ask"`
to require approval.

**What changed:**

- `opencode.jsonc` — appended `{ "action": "subagent", "resource": "explore", "effect": "deny" }` to
  the `permissions` array, after the existing `shell` and `run_slop` rules.

**Key takeaways**

- Permissions are last-match-wins, so the deny has to sit *after* any broader allow that would cover it.
  Appending is the safe default; inserting above a wildcard allow silently does nothing. The lesson's
  example depends on this: the `"*"` deny comes first, then the exceptions override it.
- `resource` is a pattern, not just a name. `orchestrator-*` matches any subagent ID with that prefix,
  which is how you allow a whole family without listing each one.
- `effect` has three values, and `ask` is the middle ground: `deny` blocks outright, `allow` runs
  silently, `ask` pauses for approval. Use `ask` when the subagent is legitimate but expensive or
  consequential.
- These rules govern what an agent can invoke *automatically*. They do not stop you from launching a
  subagent yourself through the UI — so a deny is a guardrail on the model, not a hard security
  boundary against the human.
- The failure mode is clean: the tool call returns `Permission denied: subagent` and no child session
  starts. Worth verifying by actually attempting the call rather than trusting the config file — a
  typo'd action name would leave the file looking correct and the permission open.
- Denying a subagent is a context-budget decision as much as a safety one. `explore` is cheap and
  read-only, so the usual reason to block it is to force the work into the main session where you can
  see it, not to prevent damage.

**中文摘要**

在 `opencode.jsonc` 的 `permissions` 数组末尾追加
`{ "action": "subagent", "resource": "explore", "effect": "deny" }`，禁止 `explore` 子 agent。
课程示例展示了完整写法：先一条 `"*"` 的 deny 兜底，再用 `orchestrator-*` 这样的通配 resource
放行一族子 agent，用 `code-reviewer` + `effect: "ask"` 要求审批。权限规则是**最后匹配生效**，
所以 deny 必须放在更宽的 allow 之前、例外放在之后。`effect` 有三种：`deny` 直接拒绝、`allow`
静默放行、`ask` 暂停等待批准。这些规则只约束 agent 的**自动**调用，不阻止你在 UI 里手动启动
subagent——所以它是给模型的护栏，不是对人的安全边界。实际调用一次确认返回
`Permission denied: subagent`、子会话没有启动——只看配置文件不够，action 名字打错的话文件看起来
依然正确。禁止 subagent 往往是为了把工作留在主会话里可见，而不只是出于安全考虑。

---

## 5.5 — Subagents · 2026-11-23 · +198 XP

**What the lesson asked:** use a subagent to find a `LexicalError` path with no regression test, then
add that test in a new file. The lesson frames subagents as isolated child sessions that the primary
agent can spin off concurrently — built-in `general` (multi-step research and execution) and `explore`
(fast, read-only codebase/web search) — invoked autonomously as a tool or manually with `@explore …`.

**What changed:**

- `tests/test_lexer_regression.py` — new file with two tests for the `unterminated string` error raised
  at `scanner.py:127` (trailing backslash at EOF): one at the `tokenize` level, one end-to-end through
  `run_source` asserting the exact stderr line and exit code 1.

**Key takeaways**

- The point of a subagent is **isolation**, not delegation for its own sake. Every search, command, and
  intermediate thought stays in the child session; only the summary comes back. That is what keeps the
  parent's context clean enough to reason with.
- The three benefits are separable and you should pick the subagent type for the one you want:
  isolation (context hygiene), cost (the child can run a cheaper model), and speed (background calls run
  in parallel while the parent keeps working; foreground calls block).
- `explore` is read-only by design, so it is the right default for "go find X and summarize". Reach for
  `general` only when the child must actually change something.
- The subagent's headline answer was wrong: it reported "uncovered messages: none", which contradicted
  the task premise. Its own caveats section contained the real finding. Read the caveats, not just the
  summary — a subagent that answers "nothing to do" is a signal to check its reasoning, not to stop.
- The gap was not a missing *message* but a missing *site*. `unterminated string` is raised from two
  places in the scanner; only the EOF/newline one was tested through the runner. Coverage by message
  string hides duplicate raise sites.
- Test at the boundary the user sees. A lexer-level test proves the exception is raised; a
  `run_source` test proves it is caught and formatted instead of escaping as a traceback. Both are
  cheap, so keep both.
- Delegating the search was still worth it: enumerating 12 raise sites and cross-checking every test
  file is mechanical work that would have eaten main-context budget.

**中文摘要**

subagent 是主 agent 可以并发派生的专用子会话，内置 `general`（多步研究与执行）和 `explore`
（快速只读的代码库/网页探索），既能由主 agent 自动调用，也能用 `@explore …` 手动触发。核心价值是
**隔离**：搜索、命令、中间思考都留在子会话里，只有结论回到主会话，主上下文因此保持干净。三个好处
可以分开看——隔离（上下文卫生）、成本（子会话可用更便宜的模型）、速度（后台调用并行，前台调用阻塞）。
本课用 subagent 找出没有回归测试的 `LexicalError` 路径，再新建测试文件补上。subagent 的结论
"没有未覆盖的消息" 与任务前提矛盾，真正的线索藏在它自己的 caveats 里：`unterminated string`
在 scanner 里有两个抛出点，只有 EOF/换行那个有端到端测试，行尾反斜杠那个没有。所以新建
`tests/test_lexer_regression.py`，一个测 `tokenize` 层，一个测 `run_source` 层（断言 stderr 和
退出码）。教训：按消息字符串统计覆盖率会掩盖重复的抛出点；subagent 说"没事可做"时要看它的推理过程。

---

## 5.4 — Max Steps · 2026-11-23 · +330 XP

**What the lesson asked:** cap how many agentic steps a custom agent can take by setting `steps` in
its frontmatter, so a runaway agent stops instead of looping.

**What changed:**

- `.opencode/agents/review.md` — added `steps: 2` to the frontmatter, directly after `mode: primary`.
  The review agent now gets two steps (one tool call plus the final answer) before it is cut off.

**Key takeaways**

- `steps` is a per-agent budget on agentic turns, not on tool calls inside a turn. A step is one
  model turn that may issue tool calls; the final text answer is the last step. So `steps: 2` means
  "one round of tools, then answer" — enough for a single read, not enough for a multi-file sweep.
- The budget is a guardrail against loops, not a quality setting. Too low and the agent answers from
  partial context; too high and a confused agent can burn tokens wandering. Pick it from the shape of
  the task, not from a default.
- It pairs naturally with the read-only permission set from 5.3: a review agent that can't edit and
  can't loop is cheap to run and safe to leave unattended.
- The lesson's check is behavioral, not textual — it verifies the agent actually stops after two
  steps, so a typo'd key would fail even though the file "looks" right.

**中文摘要**

在 `.opencode/agents/review.md` 的 frontmatter 里加上 `steps: 2`，限制这个 agent 最多走两步。
`steps` 限制的是 agent 的轮次（一次模型回合，可以包含工具调用），不是工具调用次数；最后输出答案
也算一步。所以 `steps: 2` 等于"先调一轮工具，再给结论"。它是防止 agent 死循环的护栏，不是质量
旋钮：设太小会基于不完整上下文作答，设太大则可能空转烧 token。配合 5.3 的只读权限，这个评审
agent 既不能改代码也不会无限循环。

---

## 5.3 — Custom Agents · 2026-11-22 · +461 XP

**What the lesson asked:** create `.opencode/agents/review.md` as a new **primary** agent with a
review-focused system prompt and permissions that deny everything except `read`, `glob`, and `grep`.

**What changed:**

- `.opencode/agents/review.md` — frontmatter with `description`, `mode: primary`, and four permission
  rules; body is the review checklist (bugs, tradeoffs, suggestions without edits, quality,
  performance, security).
- Permissions start with a catch-all `action: "*"` deny, then allow `read`, `glob`, and `grep`.

**Key takeaways**

- The lesson's example only denied `edit` and `shell`, which still leaves `webfetch`, `websearch`,
  `skill`, and `subagent` open. "Deny all except three" needs an explicit `"*"` deny first — the
  example and the requirement are not the same thing, and the requirement wins.
- Order is the whole mechanism: rules are last-match-wins, so the broad deny must come first and the
  three allows after it. Same rule as the shell permissions in `opencode.jsonc`.
- `mode: primary` makes it a session you switch into, not something the main agent launches. A
  subagent version would be `mode: subagent` and would need a `description` the parent model can read
  to choose it.
- Denying `shell` also denies `git diff`, so this agent reviews the working tree as it stands, not
  uncommitted changes. If diff review matters, allow `git diff *` after the deny.
- A read-only agent is a *review* tool, not a *fix* tool: it can point at the bug but can't touch it,
  which keeps the review honest and the diff empty.

**中文摘要**

创建 `.opencode/agents/review.md` 作为新的 primary agent：系统提示词负责评审清单（bug、权衡、
只建议不修改、代码质量、性能、安全），权限只允许 `read`、`glob`、`grep`。课程示例只 deny 了
`edit` 和 `shell`，但那样 `webfetch`、`websearch`、`skill`、`subagent` 仍然可用，所以先加一条
`action: "*"` 的 deny，再放行三个只读动作——权限规则是**最后匹配生效**，顺序不能反。另外 deny
`shell` 也意味着不能用 `git diff`，这个 agent 只能看工作区现状。

---

## 5.2 — Temperature · 2026-11-21 · +394 XP

**What the lesson asked:** pick a model that accepts a temperature setting, set the model-level
`body.temperature` to `0.9`, brainstorm five Sloperator slogans into `SLOGANS.md`, then lower the
value to `0.1`. Then start a fresh session, ask for five more slogans, and compare.

**What changed:**

- `opencode.jsonc` — `model` already pointed at `opencode/deepseek-v4.1-flash-free`, so no model
  switch was needed; added `providers.opencode.models."deepseek-v4.1-flash-free".body.temperature`,
  set to `0.9` for the brainstorm and left at `0.1`.
- `SLOGANS.md` — batch 1 (this session, 0.9), batch 2 (fresh child session, 0.1), and a comparison.

**Key takeaways**

- The temperature override belongs on the **model**, not the agent and not the provider:
  `providers.<provider>.models.<id>.body` is what reaches the request. The agent-level
  `request.body` is preserved for later but not sent yet, which is a silent no-op if you put it
  there.
- Config changes land on **new requests**, not the turn already running — so the `0.1` applies from
  the next message, and the batch I generated at `0.9` never retroactively changes.
- The comparison didn't isolate temperature. Batch 2's brief listed the language keywords and it
  returned them; **prompt content dominated sampling settings**, which is the chapter-4 lesson
  restated.
- What low temperature actually changed was **form**: batch 2 kept one template (statement, comma,
  resolution, ✨ — three of five) while varying nouns, where batch 1 used four shapes across five
  lines. Diversity drops in structure before it drops in vocabulary.
- A fresh session is the clean way to remove conversational anchoring — and the reason its output
  needed a written brief. Isolation and amnesia are the same feature.

**中文摘要**

课程要求验证 temperature：把模型级 `body.temperature` 设为 0.9 生成五个口号，再降到 0.1 换新会话
生成五个并比较。配置位置容易记错——要写在 `providers.<provider>.models.<id>.body`，agent 级
`request.body` 目前不会真正发送。比较结果说明：低温度不只是"更保守"，更明显的表现是**结构趋同**
（五条里三条同一个句式，只换名词）；而两批风格差异主要来自提示词里给的词汇表，说明提示词内容
比采样参数更能决定输出。温度是方差旋钮，不是质量旋钮。

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
