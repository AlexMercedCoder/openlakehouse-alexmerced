---
title: ACID and time travel
summary: How a lakehouse gets safe concurrent writes and a readable past, using an atomic pointer swap rather than a lock.
kind: concept
order: 9
keywords: ["ACID transactions", "snapshot isolation", "time travel", "optimistic concurrency", "rollback"]
related: ["table-format", "catalog", "maintenance"]
sources:
  - label: "Apache Iceberg table specification"
    url: "https://iceberg.apache.org/spec/"
    note: "Snapshot semantics and the commit protocol in normative detail."
---

Lakehouse tables give you atomic commits, consistent reads, and a readable history without a
database server in the middle. The mechanism is simpler than it sounds.

## The commit

A write proceeds in a fixed order. The writer creates new data files. It writes new metadata
describing the resulting file set. It then asks the catalog to swap the table pointer from the
metadata it started from to the new metadata.

That final step is a compare and swap. It succeeds only if the current pointer is still what the
writer expected. Two writers can work concurrently for as long as they like; the first to commit
wins, and the second discovers its base is stale and either retries against the new state or fails,
depending on whether the operations actually conflict.

This gives serializable behavior without holding a lock across the whole operation, which is why a
long write does not block anyone.

## The read

A reader resolves the pointer once and then reads an immutable set of files. A commit landing
mid-read changes nothing about what it sees, because nothing it is reading was modified.

That property is what makes long analytical queries safe against actively written tables, and it is
the most practical benefit of the whole design.

## Time travel

Because every commit produces a snapshot and nothing is overwritten, previous states remain valid
until deliberately expired. Three capabilities follow.

**Reading the past.** Query the table as of a snapshot or a timestamp. This is how a figure reported
last month gets reproduced.

**Rollback.** Point the table back at a previous snapshot. It is a metadata change, so it is fast
regardless of table size.

**Incremental reads.** Ask what changed between two snapshots and process only that, which is the
foundation for pipelines that do not rescan everything.

## Updates are still expensive

None of this makes row-level mutation cheap. Changing a few records means either rewriting the files
containing them, or writing delete files that every subsequent read must merge.

The first makes writes expensive and reads clean. The second makes writes cheap and reads pay a
merge cost that grows until compaction runs. Both are legitimate; the choice follows from whether
the table is written rarely and read constantly, or the reverse.

What neither does is turn an analytical table into a transactional database. Workloads needing
frequent small updates at low latency belong in an operational store, with periodic loads into the
lakehouse for analysis.
