# The Prompt Box — study guide

> One box, four jobs: **compose, attach, dispatch, bypass.** Everything else is an escape hatch.

Companion to the lesson notes in [`../README.md`](../README.md). Written to be re-read, not
skimmed: mental model first, cheat sheet second, self-test last.

## The mental model: a cockpit, not a text field

Most people treat the prompt box like a chat input. This chapter reframes it as a console with
four instruments:

| Instrument | Control | Job |
| --- | --- | --- |
| **Context lever** | `@filename` | Loads a file into the prompt before you send it |
| **Composer** | `Shift+Enter`, `Ctrl+Enter`, `Ctrl+J`, paste | Keeps you writing instead of sending |
| **Throttle** | `Enter` | Sends — and while the agent is working, *steers* |
| **Escape hatch** | `!`, `Ctrl+X E`, `Esc`, `Ctrl+C` | Gets you out, or around the model entirely |

The story to remember it: **you are the flight engineer.** `@` loads the cargo, `Shift+Enter`
keeps writing the manifest, `Enter` clears the aircraft for takeoff, and `!` is the hatch you
climb through when you don't need the pilot at all.

That framing matters because the three failure modes of this chapter are all "pressed the right
key in the wrong mode": sending when you meant to add a line, steering when you meant to queue,
and typing English into a shell.

## Cheat sheet

| Action | Keys | Reach for it when |
| --- | --- | --- |
| Attach a file | `@` then type, arrows, `Enter` | You know exactly which file the agent needs |
| New line | `Shift+Enter` (fallback `Ctrl+Enter` / `Ctrl+J`) | Writing a multi-part task or an expected-output block |
| Send | `Enter` | The prompt is finished |
| **Steer** | `Enter` **while the agent is working** | You want to change direction mid-task |
| Previous prompt | `Up` (cursor at start of input) | Reusing or fixing an earlier prompt |
| Next prompt | `Down` (cursor at end) | Walking back to what you were writing |
| Clear input | `Ctrl+C` | Abandon a draft; press again on an empty box to exit |
| External editor | `Ctrl+X`, then `E` | The prompt outgrew the box |
| Shell mode | `!` at the start of an empty prompt | Running a quick command yourself |
| Leave shell mode | `Esc` | You changed your mind before running anything |

## Deep notes

### `Enter` has three meanings

This is the single most valuable idea in the chapter:

1. **Idle + text** → sends the prompt.
2. **Agent working** → sends a *steering message* that redirects the run in progress.
3. **In a multiline draft** → it does not insert a newline; you need `Shift+Enter`.

Meaning 2 is the surprise. There is no "queue" key here — if you press `Enter` while the agent is
mid-task, you are changing the job, not lining up the next one. We used this deliberately once:
asked for `--validate`, steered to `--check` before any code was written, so the rename cost
nothing. Steering is cheapest before implementation and expensive after.

### `@` is context loading, not a suggestion

Selecting a text file reads it into the prompt immediately. Two consequences:

- It **saves a tool call**: the model doesn't have to ask to read the file, which saves a round
  trip and tokens.
- **Large files can be truncated**, so `@`-attaching a huge file isn't a guarantee the model saw
  all of it.

Attach the smallest file that answers the question. `@docs/spec.md` beats "here's our language,
roughly".

### Shell mode is a command line, not a sentence

`!` at the start of an empty prompt runs a shell command directly — no model in the loop. The
command *and its output* become part of the session, so your next prompt can refer to the result
("make that pass"). `Esc` leaves shell mode without running anything. It is not for interactive
programs (editors, `top`, password prompts).

The trap is grammar: shell mode wants a command, not a request. A real example from this project:

```text
! run uv run sloperator.py examples/doubling.slop
zsh: command not found: run
```

The word `run` belongs in English, not in argv. Drop it and the same mode prints `26`:

```text
! uv run sloperator.py examples/doubling.slop
26
```

### The editor escape hatch

`Ctrl+X`, then `E`, opens the current draft in `VISUAL`, or `EDITOR` if `VISUAL` is unset. Save,
close, and OpenCode reads it back. GUI editors need a wait flag (`code --wait`) or the editor
returns before you've typed anything — the classic "my draft was empty" bug.

### Paste and copy are bigger than they look

Long pastes collapse into a compact label in the box, but the **full text is still sent** — don't
"fix" it by pasting in pieces. Selecting text with the mouse copies it to the clipboard and shows
a toast.

## Pitfalls, ranked by how often they bite

1. Pressing `Enter` for a newline → sends, or worse, steers a running agent.
2. Typing a natural-language request in shell mode (`run …`, `please …`) → `command not found`.
3. Attaching a giant file and assuming the model read all of it.
4. Editing a long prompt inline when `Ctrl+X E` exists.
5. Using `!` for an interactive program and thinking OpenCode hung.
6. Pressing `Up` mid-draft expecting history — it only recalls at the *start* of the input.

## The assignment, mapped to what it taught

| Step | Action | Lesson it proves |
| --- | --- | --- |
| 1 | `@docs/spec.md` + `@examples/hello.slop` | Attach the exact sources instead of describing them |
| 2 | Multiline prompt, task then `Expected output: 26` | Separate *what to build* from *what success looks like* |
| 3 | `! uv run sloperator.py examples/doubling.slop` → `26` | Shell mode turns a claim into evidence |
| 4 | `Up`, inspect, clear with `Ctrl+C` | History is for reuse and auditing, not resending blindly |

Result in this repo: `examples/doubling.slop` prints `26`, and `tests/test_examples.py` keeps it
honest.

## Retention plan

- **Day 1 (today):** answer the self-test below without scrolling up. Anything you miss, reread
  only that section.
- **Day 3:** recall the four-instrument model from the title. If you can name all four jobs, you
  have the chapter.
- **Day 7:** do the drill again from scratch — `@` two files, write the multiline prompt with an
  expected-output block, run it with `!`.
- **3-2-1 before you close:** three shortcuts you'll actually use this week, two failure modes you
  hit, one sentence explaining why `Enter` is dangerous while the agent runs.

## Self-test

<details><summary>1. What does <code>@</code> actually save you?</summary>
A tool call. The file is read into the prompt up front, so the model doesn't spend a round trip
asking to read it. Trade-off: large files may be truncated.</details>

<details><summary>2. The agent is running. What does <code>Enter</code> do?</summary>
Sends a steering message that redirects the in-progress run. It does not queue a follow-up.</details>

<details><summary>3. Your terminal ignores <code>Shift+Enter</code>. What then?</summary>
Try <code>Ctrl+Enter</code> or <code>Ctrl+J</code>.</details>

<details><summary>4. Why did <code>! run uv run …</code> fail?</summary>
Shell mode executes argv, not English. <code>run</code> is a word from the prompt, not a
command, so zsh reported <code>command not found: run</code>.</details>

<details><summary>5. Does shell-mode output reach the model?</summary>
Yes. The command and its output become part of the session, so later prompts can reference the
result.</details>

<details><summary>6. When is <code>Ctrl+X E</code> the right tool?</summary>
When the draft outgrows the box: long prompts, careful wording, or anything you want to revise
like a document. Needs <code>VISUAL</code>/<code>EDITOR</code>; GUI editors need
<code>--wait</code>.</details>

<details><summary>7. What does <code>Ctrl+C</code> do in the prompt box?</summary>
First press clears the draft; pressed again on an empty box it exits OpenCode.</details>

<details><summary>8. Where does <code>Up</code> recall history, and where does it not?</summary>
At the start of the input. Mid-draft it moves the cursor instead — that asymmetry is what makes
<code>Down</code> move forward at the end.</details>

## 中文摘要

提示框不是一个聊天输入框，而是一台有四个操作面的控制台：`@` 负责带上下文（省掉一次读文件
的工具调用，但大文件可能被截断），`Shift+Enter`（或 `Ctrl+Enter`、`Ctrl+J`）负责换行，
`Enter` 负责发送——**当 agent 正在运行时，Enter 是转向（steering），不是排队**，`!` 进入
shell 模式直接执行命令，输出会进入会话上下文。踩坑集中在三处：想换行却发送了、在 shell 模式
里写自然语言（例如 `run uv run …` 会报 `command not found: run`）、以及忘了 `Ctrl+X E` 可以
用外部编辑器写长提示。

口诀：**@ 带上下文，Shift 换行，Enter 发送或转向，! 直连终端，Ctrl+X E 用编辑器。**
