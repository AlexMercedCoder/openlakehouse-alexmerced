---
title: Semantic layer
summary: Written definitions of what the data means, so people and machines compute the same metric the same way.
kind: concept
order: 6
keywords: ["semantic layer", "metrics layer", "metric definitions", "governed metrics", "data modeling"]
related: ["apache-ossie", "catalog", "query-engines"]
sources:
  - label: "The Semantic Layer: The Definitive Guide"
    url: "https://www.dremio.com/blog/semantic-layer-the-definitive-guide"
    note: "How a semantic layer unifies business logic across consumers."
  - label: "SemanticLakehouse.com"
    url: "https://semanticlakehouse.com"
    note: "Material focused specifically on modeling meaning over open tables."
---

The layers below this one make data portable. The semantic layer makes it comprehensible. It
records what a metric means, which table is authoritative, how entities relate, and what a row
represents.

Without it, every consumer re-derives that knowledge from column names and guesswork.

## The failure it prevents

A company tracks monthly active users. Marketing counts distinct users with any event. Product
counts users with a session over thirty seconds, because bounces are not usage. Finance counts
billing accounts with activity, which is a different unit entirely.

All three are defensible. All three are called monthly active users. The numbers differ by twenty
percent, and the difference surfaces in a meeting where forty minutes go to reconciling definitions
instead of deciding anything.

Nothing malfunctioned. Three teams encoded three reasonable definitions in three tools, and no
artifact anywhere records that these are different metrics sharing a name.

## What it records

- **Authoritative sources.** One table per entity is the real one; the others are staging.
- **Metric definitions.** Net revenue is gross minus returns minus discounts, on the close-date
  basis.
- **Relationships.** Orders join to customers on this key, many to one. Undeclared cardinality is
  the usual cause of aggregations that double count.
- **Grain.** One row means one order line.
- **Freshness.** This table closes on the fifth business day.
- **Trust level.** Certified for external reporting, or exploratory.

## Why it stopped being optional

A human analyst facing four similar tables asks a colleague. The answer lives in someone's head and
that is survivable, if slow.

Machines cannot ask. A query engine given a vague request picks a table. An AI agent given the same
request picks one too, and reports a number with no indication that the question was ambiguous. The
ambiguity was always there. Automation simply removed the person who would have caught it.

That changes the economics of writing definitions down. Previously a good column description might
help a colleague someday. Now it is an input to a decision on every query, which makes the return
immediate rather than speculative.

## Where it should live

The recurring mistake is putting metric definitions inside a BI tool. They work, and they are
reachable only by that tool. The second consumer defines its own, and the organization now has two
answers to one question.

Definitions belong somewhere every consumer can read: a declarative format, in version control,
reviewed like code, validated against the physical tables so a dropped column is caught at commit
time rather than by a customer.
