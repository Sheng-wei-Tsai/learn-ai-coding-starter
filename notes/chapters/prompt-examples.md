# Prompt Examples — study guide

> A weak prompt isn't badly worded, it's **under-specified** — and every fix in this chapter is one
> added sentence that hands over knowledge only you have.

Companion to [`the-prompt-box.md`](the-prompt-box.md) (the mechanics of sending) and the lesson
notes in [`../README.md`](../README.md). This chapter is about the *content* of the prompt; that one
was about the box it goes in.

## The mental model: the renovation briefing

You've hired a contractor who is genuinely excellent, has never seen your house, and wants very
badly to please you. You say: **"the kitchen is dark."**

They cannot know four things, and each one is a different disaster:

| What they don't know | What they do instead | The fix |
| --- | --- | --- |
| **Which room, and only that room** | Light the whole ground floor | *Clarify scope* |
| **What you'll allow them to change** | Rewire the house, or plug in a lamp | *Provide implementation constraints* |
| **That the neighbour's kitchen has the exact dimmer you want** | Invent a new dimmer from scratch | *Point at existing patterns* |
| **That you can't remodel the whole house in one day** | Start with the roof and run out of money | *Break it into smaller steps* |

The contractor is not stupid and not lazy. They simply can't read your mind — only your map. Every
rule in this chapter adds one line to the map.

That framing also explains the chapter's opening shot: a domain expert who knows their customer
beats someone with a prompting cheat sheet, because **the four missing sentences are all facts about
your house.** No cheat sheet contains them.

## Cheat sheet

| Rule | The sentence you're missing | Fails without it because |
| --- | --- | --- |
| **Clarify scope** | "on the product checkout page … those reviews **only**" | The agent picks its own radius — one file, or every related function in the repo |
| **Provide constraints** | "if the function is shared, allow a configurable font size via parameters" | The agent over- or under-abstracts aggressively, and you don't get to pick which |
| **Point at patterns** | "look at the gift-code page, which already does this" | It won't reliably scan the whole codebase, especially for things a keyword regex can't find |
| **Break into steps** | "mock data UI first; then the endpoints; then wire them up" | One early derailment wastes the entire run instead of one step |

The four questions behind it, in plain language:

1. **Where, and only there?**
2. **What are you allowed to make of it?**
3. **Who already did this?**
4. **What's step one?**

## Deep notes

### The pairs are the lesson, not the "better" examples

Look at what actually changed in each pair: **one sentence**. "Increase the font size" became
"increase the font size *of those reviews only*". Nothing got more eloquent, longer-winded, or more
polite. Prompt improvement is additive and cheap — which is why "I'm bad at prompting" is almost
always really "I skipped a sentence I thought was obvious."

The sentence you skipped is obvious *to you*, because you know the codebase. That's the whole
chapter in one line.

### Bounding words do most of the work

"Only", "just", "this page", "not the shared component" are load-bearing. Without them the agent
chooses a blast radius, and its instinct is usually *bigger* than yours — a global find-and-replace
feels thorough, and thoroughness looks like a job well done.

Concrete version from this repo: when `--check` was added to the CLI, the prompt named the flag and
the surface stayed at three files (`sloperator.py`, `runner.py`, `tests/test_cli.py`). A prompt of
"add validation to the interpreter" would have plausibly landed in `parser/` or `lexer/` instead,
because that's where "validation" sounds like it lives. Naming the entry point *is* the scope.

### Constraints choose a direction; they don't forbid

The chapter names two opposite failures — parameters that are never used, and wholesale
reimplementations where a parameter would do — and the fix isn't "don't do that." It's *"if the
function is shared, allow configurable font size via parameters."* You're telling the agent which
way to err **in this case**.

Notice you can only write that sentence if you already know the function is shared. Again: the
constraint is domain knowledge, not prompt technique.

This repo has a clean example. `loadbearing` reuses `VarDecl.mutable` and the existing
`Environment.declare` redeclaration check rather than growing a parallel AST node and a duplicate
check — a modest constraint ("same scoping as `slop`, one code path") that prevented exactly the
under-abstraction the chapter warns about.

### "Point at the pattern" is a search-cost cheat

The model really wants to solve the problem, and it will not perfectly scan your repo. Naming a file
converts an open-ended search into a single read.

Two payoffs, and the second is the expensive one:

1. **Speed** — no grep, no wrong guesses about your conventions.
2. **No second implementation** — the pattern gets *reused* instead of *reinvented*, so you don't end
   up with two pagination helpers that drift apart for a year.

That's why the carousel case from the last chapter was so tractable: "the cart page already solved
this" turned a design question into a copy-this task. Without it, the most likely outcome is a
third, differently-shaped paging implementation living beside the two that already exist.

### Small steps are about **cheap derailment**, not task size

The chapter is honest that this one bends: with a detailed architecture prompt or a long Plan
session behind you, one-shotting a bigger task is higher-risk, higher-reward, and sometimes right.
The tell is *preventability*. If the model goes off the rails five minutes in — before writing
anything you'd keep — you didn't need a smaller task, you needed a checkpoint.

The three-step shape for the Stripe checkout is worth memorizing because it separates **shape** from
**plumbing** from **wiring**:

1. Frontend component on mock data — get the UI you actually want.
2. Backend endpoints — get the data real.
3. Point the frontend at them — get the seam right.

Each step is also a place to press `Enter` and steer without throwing away a long run (see
[`the-prompt-box.md`](the-prompt-box.md)).

In this repo, lesson 4.2 asked for a plan *before* code, and the plan surfaced three questions
nobody had decided: the reassignment message, whether an inner scope may shadow a `loadbearing`, and
whether same-scope redeclaration keeps the old error. Those are cheap to answer in a plan and
annoying to discover as invented behaviour in a diff.

### "AI can't produce good code without you"

All four rules are transfers of tacit knowledge. The model has read more code than you ever will and
still doesn't know which component is shared, which page already localizes currency, or that your
customers read reviews on a phone at 11pm. The chapter's claim isn't flattery — it's the reason the
rules work at all.

## Pitfalls, ranked by how often they bite

1. **Deciding a name in prose instead of in the prompt.** Asked for `--validate`, got `--validate`;
   the steer to `--check` was free only because no code existed yet. If you know the name, say the
   name.
2. **Bundling a workflow into one sentence.** "Write notes and push after each lesson" needed four
   decisions first: repo visibility, notes layout, trigger, language. A question round beats silent
   guessing — but every question you already know the answer to is a round trip you bought.
3. **No expected output.** "Make it fast" and "make it work" are both unfalsifiable. The doubling
   lesson was checkable *only* because the prompt said `26` — the sample snippet printed `42`, so
   without a written target the habit-copy would have passed review.
4. **Scope creep by pleasantry.** "While you're in there, tidy up…" is a scope bug wearing a smile.
   State non-goals.
5. **Assuming the model read the whole attachment.** Large `@`-attached files can be truncated; see
   the prompt box guide.
6. **Treating a one-shot of a big task as a flex.** If you can't say where the checkpoints are, it's
   not a plan, it's a gamble.

## Retention plan

- **Day 1 (today):** answer the self-test below without scrolling up. Miss one, reread only that
  section.
- **Day 3:** retell the renovation story from memory and name the four missing facts. If you can
  name them, you have the chapter.
- **Day 7 — the rewrite drill:** open your last five prompts and find the one that needed a
  follow-up correction. Add the single missing sentence. Keep a short **prompt repair log**
  (weak prompt → missing rule → the sentence you should have written); after three entries the
  pattern in *your* prompts becomes obvious.
- **3-2-1 before you close:** three prompts you'd rewrite today, two rules you keep forgetting, one
  sentence that would have saved a round trip this week.

## Self-test

<details><summary>1. "Customer reviews are too small, increase the font size." What is the missing
sentence, and what does it prevent?</summary>
"…on the product checkout page… those reviews only." Without it the agent may edit a shared
component and change every page that renders reviews.</details>

<details><summary>2. Name the two opposite ways an agent mangles abstraction.</summary>
Over-abstraction — inventing parameters nothing ever passes — and under-abstraction —
reconstructing a whole new implementation where a parameter would have done.</details>

<details><summary>3. Why does "look at the gift-code page" beat just describing how localization
should work?</summary>
It converts a repo-wide search into a single read, and it makes the agent reuse the existing
pattern instead of adding a second, divergent one.</details>

<details><summary>4. When is one-shotting a big task reasonable?</summary>
When real planning has already happened — a detailed architecture prompt or a long Plan session.
It's higher-risk, higher-reward, and the risk is a preventable early derailment.</details>

<details><summary>5. Scope vs. constraints — what's the difference?</summary>
Scope says <em>where</em> and <em>how much</em> ("these reviews only"). Constraints say <em>which
design direction</em> when the code is shared ("allow configurable font size via parameters"). Scope
bounds the blast radius; constraints bound the shape of the fix.</details>

<details><summary>6. What does the chapter say matters more than a prompt cheat sheet?</summary>
Domain expertise — understanding the codebase and the customer. The four rules are cheap; the
knowledge they inject is not.</details>

<details><summary>7. Your change works, but it also altered three unrelated pages. Which rule did you
skip?</summary>
Clarify scope. The fix wasn't wrong, its radius was never bounded.</details>

<details><summary>8. Why is an early derailment worse than a late one?</summary>
A late one has already produced the first two usable steps. An early one wastes the whole run, and
it was usually preventable with a checkpoint or one more sentence.</details>

## 中文摘要

这一章讲提示词的「内容」，和上一章讲提示框的「操作」互为补充。核心观点：差的提示词不是措辞
不好，而是**信息不足**——每条改进都只增加一句话，把只有你知道的隐含知识写出来。四条规则对应
四种失败：**划定范围**（"只改商品结算页的评论"，否则 agent 自己决定改动半径，往往是全仓库
替换）、**给出实现约束**（"如果函数是共享的，就用参数配置字号"，否则它会在过度抽象和重复实现
之间乱选）、**指出已有先例**（"看看 gift-code 页面，已经实现了这个模式"，省掉它不可靠的全库
搜索，并避免出现第二套平行实现）、**拆成小步**（先用 mock 数据做 UI、再加后端接口、最后接上，
因为早期的跑偏最贵；但如果已经做过完整规划，一次性完成大任务也可以，只是风险更高）。结尾那句
"AI can't produce good code without you" 不是客套：这四条规则传输的全是关于你自己代码库和
客户的隐性知识，任何速查表里都没有。

口诀：**限定范围，给出约束，指出先例，拆成小步。**

English mnemonic: **Scope it, constrain it, point at it, slice it.**
