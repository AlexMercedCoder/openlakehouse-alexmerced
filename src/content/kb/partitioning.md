---
title: Partitioning
summary: How table data is physically grouped so a query can skip whole sections of it, and why hiding the scheme matters.
kind: concept
order: 8
keywords: ["partitioning", "hidden partitioning", "partition evolution", "partition pruning", "data skipping"]
related: ["table-format", "file-format", "apache-iceberg"]
sources:
  - label: "Apache Iceberg partitioning documentation"
    url: "https://iceberg.apache.org/docs/latest/partitioning/"
    note: "How partition transforms and evolution work in practice."
---

Partitioning groups a table's files so a query filtering on the partition column can skip whole
groups without reading them. Done well it is the difference between scanning a day and scanning a
decade. Done badly it produces either no benefit or a table nobody can query efficiently.

## The old way and its three problems

Directory partitioning encodes a column value in the storage path, one directory per day for
instance. A reader that understands the convention eliminates directories before listing them.

It works, and it carries three well-known costs.

**The scheme is physical.** Changing it means rewriting the table, so the partitioning decision made
in year one is the one you live with.

**Queries must filter on the derived column.** A table partitioned by date has a date column
derived from a timestamp. Filter on the timestamp instead and you get a full scan, with nothing to
tell you why.

**Skew is unmanaged.** Partitioning on an uneven column produces one directory with ten files and
another with ten thousand.

## Hidden partitioning

A table format can record the partition scheme as a transform in metadata: this table is partitioned
by day of this timestamp column. Queries then filter on the timestamp naturally and the engine
derives the partition filter itself.

Two things follow. Users do not need to know the physical layout to query efficiently, which removes
a whole category of accidentally expensive queries. And because the scheme is metadata rather than
paths, it can change. A table partitioned by month that has grown can be repartitioned by day going
forward, with old data left alone and queries planning correctly across the boundary.

## Choosing granularity

The recurring judgment call is how fine to go. Too coarse and every query scans too much. Too fine
and you manufacture the small files problem deliberately.

A reasonable heuristic: target partitions holding at least a few hundred megabytes, and partition on
the column that appears in nearly every query rather than the one with the most distinct values.

Partitioning eliminates groups. Sort order and file statistics eliminate files within the surviving
groups. Teams often tune one, ignore the other, and conclude the format is slow. Both together
produce the order-of-magnitude differences people associate with a well-run lakehouse.
