---
title: File format
summary: How records are arranged inside a single file, which decides how much of it a query has to read.
kind: concept
order: 3
keywords: ["file format", "columnar storage", "row group", "predicate pushdown", "compression"]
related: ["apache-parquet", "object-storage", "table-format"]
sources:
  - label: "Apache Parquet documentation"
    url: "https://parquet.apache.org/docs/"
    note: "File layout, encodings, and the metadata a reader uses to skip data."
---

A file format decides how records are arranged inside a file. In an open lakehouse that format is
columnar, which means values of the same column are stored together rather than whole records being
stored together.

## Why columnar

Analytical queries read a few columns from many rows. Columnar layout suits that in three ways that
compound.

**Skipping columns is free.** A query needing three of sixty columns reads three column chunks and
ignores the rest. Wide tables stop being a penalty.

**Compression works better.** Values of one type sit next to each other, so encodings such as
dictionary, run-length, and delta apply cleanly before general compression runs. Files end up
several times smaller than the same data stored row by row.

**Skipping rows becomes possible.** Because the format records minimum and maximum values per
block, a reader can decide a whole block cannot match a filter and never fetch it.

The tradeoff is that reading one complete record touches many separate locations. That is why
columnar formats belong in analytics and not behind an application that fetches single rows by key.

## Statistics are what make it fast

The performance difference between two tables in the same format usually comes down to whether
skipping actually happens. Skipping depends on how the data was written.

If rows are sorted by the column you filter on, most blocks can be eliminated by their recorded
minimum and maximum. If the same column is scattered randomly, every block spans the full range and
nothing is skipped. Sort order is therefore a performance feature, chosen at write time, costing
nothing at read time.

## The boundary

A file format handles one file. It has no idea which files belong to a table, what happened to the
table yesterday, or whether another writer is active. A directory of well-written columnar files is
still not a table. That gap is what the table format fills.
