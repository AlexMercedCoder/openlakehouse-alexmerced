---
title: Apache Ossie
summary: An incubating project defining a vendor-neutral standard for semantic metadata, so metrics are defined once and used everywhere.
kind: technology
order: 5
apacheProject: true
keywords: ["Apache Ossie", "semantic metadata", "semantic layer standard", "metric definitions", "metric drift"]
related: ["semantic-layer", "ai-and-the-lakehouse", "kinds-of-open"]
sources:
  - label: "Apache Ossie project"
    url: "https://ossie.apache.org"
    note: "Project description, specification material, and current incubation status."
  - label: "Apache Incubator"
    url: "https://incubator.apache.org"
    note: "Background on what incubating status means and what graduation requires."
---

Ossie is an incubating project at the Apache Software Foundation working on a standard for semantic
metadata. It describes itself as a universal standard for semantic data, aimed at how semantic
definitions are exchanged across analytics, business intelligence, and AI systems.

It takes the form of a declarative specification, expressed in YAML, for describing semantic models:
the datasets, fields, metrics, dimensions, and relationships that turn physical tables into
something people and software can reason about. The stated goal is to define these once and have
every tool work from the same definitions.

Worth being straightforward about maturity: Ossie is incubating, meaning it has been accepted into
the Apache Incubator and has not graduated to a top-level project. It appears here because the
problem it addresses is real, unavoidable, and currently solved badly almost everywhere, not because
adoption is settled.

## The gap it addresses

The industry solved portability at the physical layer thoroughly. Open file formats, open table
formats, and open catalog protocols mean the same bytes can be read by many engines without
conversion or permission.

Meaning did not follow. The definition of a metric, the relationship between two entities, and the
judgment that one table is authoritative all live somewhere, and that somewhere is usually a
proprietary modeling layer inside a BI tool, a transformation project's configuration, or nowhere.

The result is that an organization can move its data anywhere and cannot move its understanding of
that data anywhere. Every new consumer re-derives the definitions from column names and guesswork.

The project frames this as semantic fragmentation, and names symptoms practitioners recognize
immediately: metric drift, manual translation errors, and unreliable AI grounding from conflicting
data logic.

## The building blocks

A small set of concepts, valuable mostly for being named consistently rather than for being novel.

**Semantic models** are the container, versioned as a unit. **Datasets** are the physical tables or
views being described, which is the join point between meaning and storage. **Fields** are columns
with a declared role. **Dimensions** are the attributes work is grouped and filtered by, which is a
modeling decision rather than a column property. **Metrics** are the quantities being measured, with
their computation stated explicitly. **Relationships** record how datasets connect, including join
keys and cardinality.

Expressed as YAML, these become artifacts that live in version control, get reviewed like code, and
carry a history. That property is worth as much as the format. A metric definition that changes
through a reviewed commit is governable. One that changes because somebody edited a dashboard is
not.

## Write once, query anywhere

The project's phrase for its goal mirrors what table formats did one layer down.

Before open table formats, moving between engines meant reloading data. After them, a table is a
table and engines are interchangeable. The semantic argument has the same shape: before a shared
standard, moving between BI tools means re-modeling; after one, the model is an artifact and the
tools are consumers of it.

The consumer list is what made this urgent rather than merely desirable. A modern stack has
dashboards, notebooks, embedded analytics, data applications, reverse ETL, and now agents, all
needing the same definitions. Six copies of a metric was tolerable at two consumers. It is not at
six, and it is actively dangerous when one of them answers questions autonomously.

## What a standard cannot do

Worth being clear, because semantic layers are sometimes sold as though the format were the hard
part.

A standard makes definitions portable and reviewable. It does not produce agreement. If three teams
genuinely disagree about what monthly active users means, writing all three in YAML gives you three
definitions in a shared format. That is a real improvement, because the disagreement becomes visible
and nameable, and it is not resolution.

It also does not maintain itself. Semantic models drift from the tables underneath as schemas
change, and a model claiming a column exists when it does not is worse than no model, because it is
confidently wrong. Validation against the physical layer has to be part of the process.

And it does not decide who owns a definition. The most common organizational failure is not an
absent format but an absent owner. Metrics with no owner accumulate variants regardless of how they
are expressed.
