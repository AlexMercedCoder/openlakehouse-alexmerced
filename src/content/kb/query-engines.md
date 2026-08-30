---
title: Query engines
summary: The compute that reads the stack, kept separate from storage so you can run several and replace any of them.
kind: concept
order: 7
keywords: ["query engine", "compute storage separation", "multi-engine", "federation", "Dremio", "Spark", "Trino"]
related: ["what-is-an-open-lakehouse", "catalog", "apache-arrow"]
sources:
  - label: "What Apache Iceberg Native Actually Means"
    url: "https://www.dremio.com/blog/what-apache-iceberg-native-actually-means"
    note: "How to tell genuine table format support from a connector."
---

The engine is the part people notice, and the part the architecture is designed to make
replaceable. Separating compute from storage is what allows several engines to read one copy of the
data, each chosen for what it is good at.

## Why more than one

Most organizations end up with several engines, and mostly for good reasons. Large batch
transformation, interactive dashboards, ad hoc exploration, and stream processing have genuinely
different requirements. Buying one engine that does all four adequately is usually worse than
running two that each do their part well.

The lakehouse makes this affordable because the engines share tables rather than copies. Before it,
a second engine meant a second pipeline, a second copy, and a reconciliation problem.

## What good support looks like

Every engine claims to support the popular table formats. The claims differ substantially in depth,
and the difference shows up after you have committed.

Ask whether the engine can **write** as well as read, whether it performs **maintenance**
operations such as compaction and snapshot expiration, whether it can use the **catalog protocol**
rather than requiring its own catalog, whether it honors **partition and file-level statistics** for
skipping, and whether it supports the specification **version and features** you actually use.

Reading a table is the easy half. An engine that reads but cannot write or maintain is a consumer,
not a participant, and planning around it as though it were a peer causes trouble later.

## Federation is a different thing

Engines that query across sources without moving data are useful and frequently confused with the
lakehouse itself. Federation reaches out to systems that hold their own data in their own formats.
A lakehouse is about data you have already landed in open formats you control.

They compose well. Federating from a lakehouse engine to an operational database is a reasonable
way to join recent transactional state to historical analytics. It is not a substitute for landing
the data, because a federated query inherits the availability and load characteristics of whatever
it reaches.

## The portability check

The measure of engine independence is not how many engines you run. It is what a switch would cost.

If a new engine can point at your existing catalog, read your existing tables, and run your existing
SQL with modest dialect adjustments, the layer is genuinely decoupled. If it needs a data migration,
a metadata conversion, or a parallel catalog, then whatever the marketing says, the engine and the
data are not actually separate.
