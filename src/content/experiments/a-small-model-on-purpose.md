---
title: A 0.5B model, on purpose
summary: Choosing the smallest usable local model for a hackathon build, capping its output, and writing the rule-based answers it falls back to when it is not there.
date: 2026-08-21
verified: true
draft: false
outcome: succeeded
hypothesis: For a narrow question-answering job with a fixed context, a very small local model plus a deterministic fallback beats a large one that might not be running.
apparatus:
  - Ollama
  - qwen2.5:0.5b
  - Flask
result: Answers in the demo's question set are served either by the model or by the fallback, with no failure path in between. No latency, quality or fallback-rate figure was recorded.
notebook: https://github.com/ayushrijal83-ops/x-man
tags:
  - local-llm
  - trade-offs
  - reliability
---

## The decision

`app/services/ai_service.py` in NepalSathi points at `http://localhost:11434`
and asks for **`qwen2.5:0.5b`** — half a billion parameters, roughly three
orders of magnitude smaller than the models this kind of feature usually
reaches for. The generation options are as tight as the model:
`temperature: 0.3`, `max_tokens: 80`, `top_p: 0.9`, and a 20-second timeout on
the HTTP call.

That is not a compromise made to save money. It is what the job needs. The
questions are about road, river and project status in Nepal; the facts are
supplied to the model in a fixed context block; the answer is required to be
one or two sentences. A larger model would be slower on a laptop during a
hackathon demo and would not know anything the context block did not already
tell it.

## The part that matters more than the model

If Ollama is not running, the request throws and `_generate_fallback` answers
instead — from rules, not from a model. The service is constructed so that
**there is no state in which the feature is simply broken**: either the model
answers, or the deterministic path does.

That is the same shape as the fallback in this website's own GitHub
integration, and I did not notice the parallel until writing this page. Both
say the same thing: a dependency you do not control is allowed to be absent,
and the system has to have already decided what it does then.

## What I would check next

Nothing here is measured. I do not know how often the fallback fires, how much
faster 0.5B actually is on this hardware, or how the answers compare against a
7B model on the same context. Those are three cheap experiments and none of
them has been run — which is why the result field above says so rather than
estimating.
