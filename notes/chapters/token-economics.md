# Token Economics — study guide

> Context is a backpack you pay to carry on every model call: pack what the next task needs,
> not everything you have ever learned.

Based on the course excerpt supplied on 2026-11-26. Companion to the Context As RAM and
New Sessions entries in [`../README.md`](../README.md).

## Mental model: a recurring shipping bill

Think of every model call as shipping the working conversation to the model again. Adding a
large file is not just a one-time expense: if it stays in context, later calls carry it too.
Tool results and assistant output add weight, even when the visible chat looks short.

Caching is a discounted shipping lane, not a smaller backpack. It can reduce the price of
repeated input, but does not remove that input from the context window.

## Cheat sheet

| Control or rule | Practical action | What it changes |
| --- | --- | --- |
| Keep context relevant | Supply the task, constraints, relevant paths, and success criteria | Avoids unrelated input |
| Fetch on demand | Read a needed file or focused excerpt instead of loading the whole repo | Limits context growth |
| Externalize reference material | Keep detailed prompts and documentation in files | Makes information available without always including it |
| Start a new session at a task boundary | Bring a concise handoff with decisions and unfinished work | Drops irrelevant history without losing essential state |
| Watch tool output | Narrow searches and avoid repeatedly reading unchanged files | Reduces less-visible accumulation |
| Treat cache savings as conditional | Check provider usage and cache-hit metrics when available | Avoids assuming every repeated token is discounted |
| Separate input and output rates | Estimate each token category independently | Avoids misleading cost estimates |

## Deep notes

### Why a few messages can consume millions of tokens

The relevant unit is the **model call**, not the user message. One agent turn can involve
multiple calls, tool results, and provider-specific reasoning usage. Their visibility and
billing depend on the model and harness.

If 100,000 tokens remain in the request context, ten further calls carry at least
1,000,000 input tokens in total, before accounting for new content. This assumes no
truncation, compaction, or selective omission.

With a retained starting context of `C` and `g` tokens added after each call, `n` calls
consume approximately:

```text
total input = n × C + g × n × (n − 1) / 2
```

For `C = 100,000`, `g = 2,000`, and `n = 10`, that is **1,090,000 input tokens**.
This is input volume, not a dollar bill: caching and rates still matter.

### Caching changes cost, not context occupancy

A useful estimate, with rates quoted per million tokens, is:

```text
cost ≈ (uncached input × uncached rate
      + cached input × cached rate
      + output × output rate) / 1,000,000
```

Use the provider's actual billing categories; separate reasoning charges, cache storage,
tool fees, or subscription caps may require additional accounting.

The pasted course text quotes these rates for `gemini-4-argon`:

| Period stated in the course | Uncached input, USD / million tokens | Cached input, USD / million tokens |
| --- | --- | --- |
| Introductory period through November 30, 2026 | $2.00 | $0.10 |
| Starting December 1, 2026 | $4.00 | $0.20 |

**These are course-provided figures, not independently verified current provider pricing.**
At either quoted rate pair, cached input is 95% cheaper than uncached input—not free.

For illustration, one million input tokens split 80% cached and 20% uncached would cost
`0.8 × $0.10 + 0.2 × $2.00 = $0.48` at the quoted introductory rates.
At the later quoted rates, the same split costs `$0.96`. Both exclude output and other fees.
The cache still occupies the same context space.

### “Stored in a file” is not the same as “free”

An on-disk guide costs no input tokens merely by existing. Once the harness reads and
includes it, it becomes context. Files injected automatically at session start also consume
context; moving a huge document into an always-loaded instructions file does not solve bloat.

Keep always-loaded rules concise. Store detailed references separately and read only the
relevant portions when needed.

### A fresh session needs a useful handoff

Resetting history can reduce repeated irrelevant input, but it also discards decisions.
Carry forward the goal, affected paths, constraints, tests already run, and remaining work.
Do not paste the entire old transcript back in—that recreates the original cost.

In this project's `hallucinate` exercise, the useful context was the evaluator implementation,
its diff, tests, and `docs/spec.md`, not every previous course lesson. Inspecting existing
changes also prevented duplicating work.

## Pitfalls

1. **Counting only typed prompts.** Tool output and intermediate calls can dominate usage.
2. **Treating a user turn as one model call.** An agent may make several calls before replying.
3. **Assuming cached means free or smaller.** It is a pricing discount, not context removal.
4. **Assuming every repeated prefix hits cache.** Eligibility, retention, and invalidation vary.
5. **Loading every file “just in case.”** Start with paths and fetch evidence as needed.
6. **Resetting so aggressively that the agent repeats discovery.** Save a concise handoff.
7. **Confusing lower token count with better results.** Essential requirements are worth keeping;
   optimize relevance, not starvation.
8. **Reusing course price quotes indefinitely.** Verify model IDs, dates, rates, and billing terms
   against provider documentation before making purchasing decisions.

## Retention plan

- **Today:** explain the backpack model and answer the questions below without looking.
- **Day 3:** calculate the ten-call example and explain why caching does not free context.
- **Day 7:** inspect a real coding session. Identify one oversized read, one reusable reference,
  and one sensible new-session boundary.
- **Day 14:** write a five-line handoff for the next task: goal, files, constraints, validation,
  and remaining work.

## Active recall

<details><summary>1. Why can ten short follow-ups consume a million input tokens?</summary>
If each call retains 100,000 tokens of prior context, ten calls submit at least 1,000,000
input tokens altogether, even before newly accumulated content.
</details>

<details><summary>2. Does a 95% cache discount give you 95% more context capacity?</summary>
No. Cached tokens still occupy context. The discount affects their input price.
</details>

<details><summary>3. At the quoted introductory rates, what does 80% cached input cost per million total input tokens?</summary>
$0.48: 0.8 × $0.10 + 0.2 × $2.00. This excludes output and other fees.
</details>

<details><summary>4. Does storing a long guide on disk always save tokens?</summary>
Only while unnecessary content stays out of requests. Reading or automatically injecting the
entire guide brings it into context again.
</details>

<details><summary>5. What should survive a new-session boundary?</summary>
The goal, relevant paths, decisions and constraints, validation results, and unfinished work—not
the whole conversation.
</details>

<details><summary>6. What is the right optimization target?</summary>
Relevant context sufficient for correct work, not the fewest possible tokens at any cost.
</details>

## 中文摘要

上下文像每次调用都要付运费的背包：历史越长，后续调用重复携带的输入就越多。
工具结果和多轮模型调用会让少量可见消息累积大量 token。缓存能降低部分输入费用，
但不保证命中，也不会释放上下文空间。详细文档放磁盘、按需读取；常驻规则保持精简。
任务切换时用短交接开启新会话，保留目标、路径、约束、验证结果与待办，而不是整段聊天。
课程价格只是带日期的示例，实际预算必须核对供应商最新定价。

**Mnemonic:** Pack less, fetch on demand, cache cautiously, hand off clearly.

**口诀：** 少背包、按需读；缓存省钱不省位，换会话先交接。
