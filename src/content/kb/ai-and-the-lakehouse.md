---
title: AI and the lakehouse
summary: Why AI workloads make the same architectural properties matter more, and what they add on top.
kind: concept
order: 13
keywords: ["AI ready data", "agentic analytics", "RAG", "AI agents data access", "semantic layer for AI"]
related: ["semantic-layer", "catalog", "apache-ossie"]
sources:
  - label: "What Is Agentic Analytics?"
    url: "https://www.dremio.com/blog/what-is-agentic-analytics"
    note: "How agents query and reason over governed data."
  - label: "AgenticLakehouse.com"
    url: "https://agenticlakehouse.com"
    note: "Dedicated material on agents operating over lakehouse data."
---

AI workloads did not change lakehouse architecture. They changed how much the existing properties
matter, and they exposed the layer most organizations had skipped.

## What stays the same

Open formats, a real catalog, and engine independence are as valuable for a model as for a
dashboard. Data that is portable, governable, and queryable by more than one engine serves both.

## What gets harder

**Access patterns become unpredictable.** A dashboard queries the same six tables forever. A model
or an agent explores: it lists what exists, samples, checks a related table, follows a hunch. That
makes metadata operations matter as much as scan performance, and it makes broad read permissions
riskier than they were for a purpose-built service account.

**Descriptions become inputs rather than documentation.** A column comment used to help a colleague
eventually. Now it is what a system reads to decide whether a table answers a question. Empty
description fields stop being documentation debt and become a correctness problem.

**Nobody asks a colleague.** A human analyst facing four plausible revenue tables asks someone.
Automated consumers pick one, because they have to pick one, and report the result with the same
confidence either way. The ambiguity was always there. Automation removed the person who caught it.

**Evidence matters more.** When a system produces an answer nobody watched it produce, the ability
to say which table and which snapshot it came from is the difference between a checkable claim and
an assertion.

## What to do about it

Very little of the work is AI-specific, which is the useful part.

Write the semantic definitions down in a machine-readable form. Route access through the catalog so
it is scoped, revocable, and observable. Fill in table and column descriptions, treating them as an
interface. Record snapshot identifiers alongside answers. Keep retrieval over documents separate
from structured queries, so nothing produces a total by summarizing prose.

Every one of those improves the platform for people too. The AI workload is mostly a forcing
function for finishing work that was always worth doing.
