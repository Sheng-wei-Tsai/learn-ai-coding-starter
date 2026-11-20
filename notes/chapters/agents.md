# Agents — study guide

> An agent is a **job description plus a badge**: what it's here to do, who you hired for it, what
> it's allowed to touch, and how long it may work before checking in.

Chapter 5, lesson 1. Companion to [`prompt-examples.md`](prompt-examples.md) (what goes *in* a
prompt) and [`the-prompt-box.md`](the-prompt-box.md) (how you send it). This chapter is about the
role you're sending it *as*.

## The mental model: a new hire, not a chatbot

You don't onboard someone by handing them the company and saying "be helpful". You write a **job
description**, pick someone **qualified**, issue a **badge** that opens specific doors, and agree on
**how often they check in**. OpenCode's agents are that, in five fields:

| Hiring step | Agent field |
| --- | --- |
| Job description, rules, tone | system prompt (Markdown body or `system`) |
| Who you hired | `model` |
| Badge: which doors open | `permissions` |
| How often they check in | `steps` |
| The one-line role summary on their desk | `description` |

The built-ins are just two pre-written job descriptions:

- **Build** — the contractor with keys to everything. Default coding agent.
- **Plan** — the inspector. Explores and plans, doesn't edit normal project files.

The chapter's example — a reviewer that reads but can't edit, can't run destructive commands, is
pre-loaded with your rules, and stops after six cycles — is exactly the same five fields with
different values. There is nothing else in an agent. Once you see the five levers, "configurable
assistant" stops being mysterious.

### The overloaded word, resolved

OpenCode is a *coding agent*; inside it, configurable roles are *also* called agents. The way to
keep up: **read the word from context.** If it has a config file and a name, it's a role. If it's
the thing running your terminal, it's the program. It's the difference between "a chef" and "the
restaurant" — same word in English, no confusion in practice.

This repo has a third flavour in `AGENTS.md`: "multi-agent work uses one owner per task" — those are
*workers*, human or AI, coordinating. Same word, one layer up. That's the cost of a popular term;
the fix is to name the layer you mean.

## Cheat sheet

| Lever | Where | Notes |
| --- | --- | --- |
| Agent file | `.opencode/agents/<name>.md` or `~/.config/opencode/agents/<name>.md` | Nested path becomes the ID: `agents/team/reviewer.md` → `team/reviewer` |
| Or JSONC | `agents.<id>` in `opencode.jsonc` | Same fields as frontmatter |
| Job description | Markdown body, or `system` in JSONC | Replaces the provider's base prompt, **not** project instructions or skills |
| Descriptions | `description:` | The model reads this when choosing a subagent — write it for the chooser, not for you |
| Where it can run | `mode: primary \| subagent \| all` | Default for a new custom agent is `primary` |
| Model | `model: provider/model#variant` | Subagents inherit the parent's model if unset |
| Badge | `permissions: [{action, resource, effect}]` | Ordered; **last matching rule wins** — broad rules first |
| Step budget | `steps: 6` | Final step strips tools and asks for a text summary; new user input resets it |
| Hide from lists | `hidden: true` | Visibility only — **not** security |
| Remove a built-in | `disabled: true` | e.g. `agents: { plan: { disabled: true } }` |
| Default agent | `default_agent: <id>` | Must exist, be visible, and support primary |
| Override a built-in | Define the same ID (`build`, `plan`) | Merges; doesn't create a second agent |

Built-ins you can address by ID:

| Agent | Mode | Purpose |
| --- | --- | --- |
| `build` | primary | Default coding agent; broad tool access |
| `plan` | primary | Explores and plans without editing project files |
| `general` | subagent | Research and multi-step work; **cannot launch more subagents** |
| `explore` | subagent | Searches and reads code or web sources, no edits |

Plus hidden maintenance agents (`compaction`, `title`, `summary`) that you can't select.

## Deep notes

### Four things wearing one name

An agent file bundles a **prompt**, a **model**, **permissions**, and **display** details. Nothing
about the behaviour is magic; it's the merge order that surprises people:

- Later scalar values **replace** earlier ones.
- Permission rules **append**.
- Global `permissions` apply **before** agent-specific ones, so an agent can only refine what the
  project already allows.

That's why this repo's `opencode.jsonc` reads bottom-up in intent but top-down in file:

```jsonc
"permissions": [
  { "action": "shell", "resource": "*",            "effect": "ask"   },  // broad
  { "action": "shell", "resource": "bootdev run *", "effect": "allow" },  // exception
  { "action": "run_slop", "resource": "*",         "effect": "allow" }   // plugin tool ID
]
```

Reverse the first two and every shell command asks again, because the later `*` rule wins. Lesson
3.6 taught exactly this, and it's the same rule at agent scope.

### `mode` decides who can start it

| Mode | Can it run a session? | Can a parent launch it? |
| --- | --- | --- |
| `primary` | Yes | No |
| `subagent` | No — only via the `subagent` tool | Yes |
| `all` | Yes | Yes |

Two details that bite:

- **Subagents start with fresh context.** That's the point — cheap, isolated, doesn't pollute the
  parent's window — and the trap: they don't know what you know. Brief them like a stranger,
  because to them you are one.
- **Selecting a primary agent doesn't change the session's model.** The session stores its model
  separately; "switch to Plan" is a change of job description, not a change of brain.

The parent controls which children it may launch (`action: "subagent"`), and the child runs with its
own permissions. Two fences, not one.

### Permissions are the fence; `hidden` is a curtain

`hidden: true` removes an agent from listings and the subagent catalog. It changes **nothing** about
what that agent can do if something calls it by ID. If the goal is "must not edit files", the answer
is a permission rule, not visibility. Same class of mistake as assuming a `.gitignore` entry is a
secret.

### The course's "max 6 cycles" is `steps`

`steps: 6` caps the number of model steps. On the final step OpenCode **removes the tools** and asks
the model to summarize in text — it doesn't just kill the process mid-sentence. New user input resets
the allowance, so it's a leash, not a lock.

That detail matters for the review-agent recipe: the cap gives you a natural checkpoint where you
get prose instead of another round of edits, and you decide whether to spend another six.

### Read-only is a design exercise, not one deny rule

The chapter's reviewer wants to "read files and diffs, but can't edit". Those two halves need
different tools:

- Files: `read`/`glob`/`grep` allowed, `edit` denied.
- Diffs: usually `shell` running `git diff` — so a blanket `shell: deny` makes the reviewer blind to
  the very thing it was hired to inspect.

The honest shape is **deny `edit`, then deny the dangerous shell commands and allow the read-only
ones** (`git diff *`, `git log *`, test runs), or keep `shell: ask` and let a human gate each command.
"Can't run destructive commands" is a narrower requirement than "can't run commands".

### A step budget is also a permission

The four constraints in the course's example are all the same idea from different angles: **bound
the blast radius**. Read-only bounds *what changes*. No destructive shell bounds *what breaks*. The
pre-loaded rules bound *what it thinks is acceptable*. Six steps bounds *how far it can drift before
you look*. An agent without all four is an unbounded process with your credentials.

## Pitfalls, ranked by how often they bite

1. **Putting the exception before the broad rule.** Permissions are last-match-wins; a specific
   `allow` above a `*` rule is dead text. This repo hit it in lesson 3.6.
2. **Confusing `hidden` with secure.** It's a curtain, not a fence.
3. **Denying all shell to a reviewer** and then wondering why it can't see the diff.
4. **Launching a subagent with a shrug.** Fresh context means it repeats your investigation or
   invents a pattern you already have — the fix is the chapter 4 briefing, every time.
5. **Forgetting `description` on subagents.** The parent model picks a child by reading that line;
   a blank or vague one means it picks wrong or not at all.
6. **Assuming "switch agent" changed the model.** It changed the prompt and permissions; the model
   follows the session unless the agent sets `model`.
7. **Calling every layer "agent".** Program, role, and co-worker are three things. Name the layer.

## Retention plan

- **Day 1 (today):** answer the self-test without scrolling up.
- **Day 3:** from memory, draw the five levers and the four built-ins. If you can place `steps`,
  `mode`, and `permissions` on the right levers, you have the chapter.
- **Day 7 — build one:** write `.opencode/agents/reviewer.md` for this repo: read + `git diff`
  allowed, `edit` denied, `steps: 6`, and a body listing the three rules you care about (`docs/spec.md`
  is the source of truth, tests ship with language changes, examples must run). Run it on a real
  diff. A guide you haven't used is a rumour.
- **3-2-1 before you close:** three agents you'd actually configure, two rules that are easy to
  invert, one sentence on why `hidden` isn't security.

## Self-test

<details><summary>1. What does an agent bundle?</summary>
A system prompt, a model preference, permissions, and display details — under one named profile.
Nothing else.</details>

<details><summary>2. Which built-in plans without editing, and which two are subagents?</summary>
<code>plan</code> is a primary agent that explores and plans without editing project files.
<code>general</code> and <code>explore</code> are the built-in subagents.</details>

<details><summary>3. <code>mode: subagent</code> — what can and can't it do?</summary>
It can't run a session itself; a parent launches it through the <code>subagent</code> tool in a child
session with fresh context. <code>all</code> is the mode that allows both.</details>

<details><summary>4. Your reviewer must read diffs but never edit. Why isn't a blanket
<code>shell: deny</code> the answer?</summary>
Diffs usually come from <code>git diff</code> via the shell, so denying shell blinds the reviewer.
Deny <code>edit</code>, deny the destructive commands, allow the read-only ones — or keep shell on
<code>ask</code>.</details>

<details><summary>5. Is <code>hidden: true</code> a security control?</summary>
No. It removes the agent from listings and the subagent catalog. Permissions are what actually
restrict behaviour.</details>

<details><summary>6. What happens when an agent's <code>steps</code> budget runs out?</summary>
On the final step, tools are removed and the model is asked to summarize in text. New user input
resets the allowance.</details>

<details><summary>7. Where does a project agent live, and what is <code>agents/team/reviewer.md</code>
called?</summary>
Under <code>.opencode/agents/</code> (or globally in <code>~/.config/opencode/agents/</code>). The
nested path becomes the ID: <code>team/reviewer</code>.</details>

<details><summary>8. A subagent keeps redoing work you already did. What did you skip?</summary>
The briefing. Subagents start with fresh context, so they need the files, constraints, and
known-good patterns spelled out — the chapter 4 rules apply most sharply here.</details>

<details><summary>9. In one line: why is "agent" confusing, and how do you stay sane?</summary>
It names both the whole program and a configurable role inside it. Read the layer from context: a
config file and an ID means a role; the thing in your terminal means the program.</details>

## 中文摘要

这一章把 OpenCode 的 agent 讲清楚了：它不是玄学，而是**一份职位描述加一张门禁卡**。每个 agent
由四样东西组成——系统提示词（Markdown 正文或 `system`）、模型、权限、展示信息，再加一个步数预算。
内置的 `build`（默认编码 agent）和 `plan`（只探索和规划、不改文件）就是两份预写好的职位描述；
`general` 和 `explore` 是两个内置子 agent。关键的配置都集中在这几个字段：`.opencode/agents/<name>.md`
（嵌套目录会变成 ID）、`mode`（primary / subagent / all）、`model`、`permissions`（有序，**最后
匹配的规则生效**，所以宽泛规则写在前面）、`steps`（课程里说的「最多 6 轮」，到最后一轮会移除工具
并要求总结）、`hidden`（只是隐藏，不是安全边界）、`disabled`。课程那个「只读评审 agent」的四个
约束本质是同一件事：限制影响范围——不能改文件限制改动面，不能跑破坏性命令限制破坏面，预置规则
限制判断面，六步限制漂移面。另外子 agent 是全新上下文，必须像对待陌生人一样把背景交代清楚。

口诀：**提示词定角色，模型定能力，权限定边界，步数定预算。**

English mnemonic: **Prompt the role, model the brain, permissions the fence, steps the leash.**
