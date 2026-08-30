---
title: What is an open lakehouse
summary: A data architecture that keeps analytical data in open formats on object storage you control, readable by any compliant engine.
kind: concept
order: 1
keywords: ["open lakehouse", "data lakehouse", "lakehouse architecture", "open table format", "vendor lock-in"]
related: ["object-storage", "table-format", "catalog"]
sources:
  - label: "Open Source and the Data Lakehouse"
    url: "https://www.dremio.com/blog/open-source-and-the-data-lakehouse"
    note: "Why the openness of each layer matters more than the label on the platform."
  - label: "OpenDataLakehouse.com"
    url: "https://opendatalakehouse.com"
    note: "Longer-form reference material on the category and its layers."
---

An open lakehouse stores analytical data as open-format files in object storage you control, and
adds enough metadata on top that those files behave like database tables. Any engine that
implements the formats can read and write them. No single vendor sits between you and your data.

That is the whole idea. Everything else in this knowledge base is a consequence of it.

## The problem it solves

Before the lakehouse, analytical data lived in one of two places, and both had a cost.

A **data warehouse** gave you transactions, fast queries, and governance. It also held your data in
a proprietary internal format. Getting data out meant an export. Using a second engine meant a
copy. The warehouse vendor decided what could read your data and what it cost to do so.

A **data lake** gave you cheap storage and open files. It gave up almost everything else. A
directory of files has no atomic commits, so a reader could see half of a write. It has no schema
management, so a column rename broke every consumer. It has no history, so a bad load was not
recoverable. Teams solved these with conventions, and conventions do not survive contact with a
second team.

The lakehouse keeps the lake's storage economics and open files, then restores the warehouse
behavior through metadata rather than through a proprietary engine.

## The layers

An open lakehouse is a stack of six replaceable layers. Naming them separately is useful because
each one is a decision you can make independently.

1. **Object storage** holds the bytes. Cheap, durable, and yours.
2. **File format** decides how records are laid out inside each file.
3. **Table format** turns a set of files into a table with commits, schema, and history.
4. **Catalog** resolves table names, enforces access, and performs the atomic commit.
5. **Semantic layer** records what the data means: metrics, relationships, and which table is
   authoritative.
6. **Query engines** read through all of it. More than one, usually.

A query resolves downward through those layers and data returns upward. That is the animation on
the front page, and it is also the mental model worth keeping.

## What makes it open

The word open does four different jobs here, and separating them is the most useful habit in this
whole subject.

- **Open format** means the file and table layouts are specified in public and implemented by
  several independent projects.
- **Open source** means the implementations are licensed so anyone can use, modify, and
  redistribute them.
- **Open interface** means the protocol between components is documented, so a client written
  against one implementation works against another.
- **Open governance** means the specification changes in public, under a process no single company
  controls.

A platform can satisfy one of these and fail the rest. Open files behind a proprietary catalog are
portable in theory and captured in practice, because the catalog decides who may read them. When
someone describes a system as open, the useful question is which of the four they mean.

## The test that matters

The honest measure of an open lakehouse is not a feature list. It is a question:

> If you removed your current query engine tomorrow, could a different engine read the same tables,
> through the same catalog, without a migration project?

If yes, the architecture is open. If no, you have a warehouse with extra steps, and the openness is
a description of the file format rather than of the system.
