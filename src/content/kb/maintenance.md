---
title: Table maintenance
summary: Compaction, snapshot expiration, and orphan cleanup, and what happens to a table when nobody owns them.
kind: concept
order: 10
keywords: ["compaction", "small files problem", "snapshot expiration", "orphan files", "table maintenance"]
related: ["table-format", "partitioning", "acid-and-time-travel"]
sources:
  - label: "Apache Iceberg maintenance documentation"
    url: "https://iceberg.apache.org/docs/latest/maintenance/"
    note: "The standard maintenance operations and how engines expose them."
---

Lakehouse tables need periodic maintenance. Skipping it is the most common reason a table that
worked well for six months becomes slow, and the symptom is distinctive enough to recognize.

## The small files problem

Streaming or frequent batch writes produce many small files. A pipeline writing every minute
produces 1,440 files a day and half a million a year. Each has metadata to read and a request to
issue.

The symptom: a table that is not especially large becomes slow to query, and the slowness is in
planning rather than scanning. Listing and opening the files takes longer than reading them.

**Compaction** rewrites many small files into fewer large ones, ideally sorted while you are at it.
It is the single most valuable maintenance operation, and directories of files have no safe way to
do it while readers are active. Table formats do, which is one of the better arguments against
managing files by hand.

## Snapshot expiration

Old snapshots keep old files alive. Without expiration, storage grows indefinitely and metadata
accumulates.

With overly aggressive expiration you lose the history that makes past answers reproducible. This is
a policy decision with a real tradeoff, and it deserves an explicit answer rather than a default.
Ask how far back someone might reasonably need to reproduce a number, and retain at least that long.

## Orphan cleanup

Failed writes leave data files that no snapshot references. They cost storage and nothing else, and
they are only safely removable with care about writes currently in flight. Run it on a schedule,
with a conservative age threshold.

## Manifest rewriting

Over time the metadata itself fragments, which slows planning. Periodic manifest rewriting keeps
planning fast on large tables.

## The actual failure mode

None of this is technically difficult, and every mature engine and catalog service exposes it as an
operation or automates it.

The failure is almost never capability. It is that nobody was assigned the responsibility, so it did
not happen, and the degradation was gradual enough that no single day looked like a problem.
