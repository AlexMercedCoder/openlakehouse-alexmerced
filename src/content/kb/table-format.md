---
title: Table format
summary: The metadata layer that turns a collection of files into a table with atomic commits, schema evolution, and history.
kind: concept
order: 4
keywords: ["table format", "ACID", "snapshot isolation", "time travel", "schema evolution", "metadata"]
related: ["apache-iceberg", "file-format", "catalog"]
sources:
  - label: "Apache Iceberg table specification"
    url: "https://iceberg.apache.org/spec/"
    note: "The normative description of metadata files, manifests, and snapshot semantics."
  - label: "What Are Table Formats and Why Were They Needed?"
    url: "https://www.dremio.com/blog/what-are-table-formats-and-why-were-they-needed"
    note: "Background on the problem table formats were introduced to solve."
---

A table format is metadata describing which files belong to a table, what the schema is, how the
data is partitioned, and what all of that looked like at every previous commit. It stores no data
itself. The data stays in ordinary columnar files.

That modest-sounding mechanism restores most of what a database table gives you, while leaving the
bytes in open files anything can read.

## What it adds to a pile of files

**Atomic commits.** A writer creates new files, writes new metadata describing the resulting file
set, then asks the catalog to swap a single pointer. That swap either happens or it does not.
Readers never see half a write.

**Snapshot isolation.** A reader resolves the pointer once and then reads an immutable set of files.
A commit landing mid-query changes nothing about what that query sees, because nothing it is
reading was modified. Long analytical queries become safe to run against actively written tables.

**Schema evolution.** Columns carry stable identifiers, so renaming one is a metadata change rather
than a rewrite of every file. Adding, dropping, and reordering are similarly cheap, and type
changes are permitted only in directions that cannot lose information.

**History.** Every commit produces a snapshot, retained until explicitly expired. You can read the
table as of last Tuesday, roll back a bad write in seconds, or ask what changed between two points.

**Fast planning.** Because metadata records file-level statistics, an engine finds the files
matching a filter by reading a few megabytes of manifests rather than listing storage.

## Why history is worth more than it looks

Snapshot history is usually sold as disaster recovery. Its more interesting use is evidence.

If a report records the snapshot identifier it read, then a number published last quarter can be
reproduced exactly, by anyone, without re-running a pipeline or trusting a log. The question "why
is this different from what we said in March" stops being an argument and becomes a lookup. Very
little else in a data platform offers proof that direct, and it costs one field.

## Maintenance is not optional

Tables that receive frequent writes accumulate small files, and accumulated small files slow
planning before they slow scanning. Periodic compaction rewrites many small files into fewer large
ones. Snapshot expiration keeps history from growing without limit, and orphan cleanup removes
files no snapshot references.

None of this is difficult. It is simply work that has to be assigned to someone, and the usual
cause of a slow lakehouse table is that it never was.
