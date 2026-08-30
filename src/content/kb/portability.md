---
title: Portability and lock-in
summary: What it would actually cost to change each component, and why the answer is usually discovered too late.
kind: concept
order: 12
keywords: ["vendor lock-in", "data portability", "migration cost", "exit strategy", "interoperability"]
related: ["kinds-of-open", "catalog", "query-engines"]
sources:
  - label: "OpenDataLakehouse.com"
    url: "https://opendatalakehouse.com"
    note: "Longer-form treatment of the category and what independence requires."
---

Lock-in is rarely a decision. It is an accumulation, and the bill arrives at the moment you want to
change something.

## The exercise

For each component in your stack, write one sentence describing what you would do if it became
unavailable, tripled in price, or changed its licensing next quarter. Then estimate the work.

It takes an hour and produces something no amount of architectural discussion produces: a specific,
reviewable number per component. It also tends to surprise people. The component everyone worried
about is often easy to replace, and the one nobody thought about is not.

Three categories of answer are useful. A configuration change plus verification is healthy. A week
of focused work is acceptable for something you chose deliberately. A project measured in months
means the coupling is real, and should be either reduced or consciously accepted.

Consciously accepted is a legitimate outcome. The failure is not depending on something. It is
depending on it without knowing.

## Where it actually accumulates

Not in the file format, which is the part everyone checks.

**In the catalog.** If only one implementation can tell you what your tables are, your open files
are academic.

**In the transformation layer.** Pipelines written in a proprietary dialect are often the largest
single migration cost, larger than the data itself.

**In the semantic definitions.** Metrics modeled inside a BI product cannot be read by anything
else, so they get redefined per consumer and then diverge.

**In operational knowledge.** Runbooks, alerting, and the accumulated understanding of why things
are configured as they are. This is real and rarely counted.

## Exercising it

Portability that is never tested quietly stops working. Interfaces drift, assumptions accumulate,
and the alternative path rots.

The cheap version of testing: read a table with an engine you do not normally use, once. Point a
second engine at your catalog, once. Take an export and ask whether a new environment could be stood
up from it alone.

Each is an afternoon. Together they convert a claimed property into a tested one, which is the only
kind worth relying on.
