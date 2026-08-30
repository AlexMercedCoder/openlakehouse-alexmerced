---
title: Apache Parquet
summary: The columnar file format most lakehouse data sits in, built to be small on disk and cheap to scan selectively.
kind: technology
order: 1
apacheProject: true
keywords: ["Apache Parquet", "columnar file format", "row groups", "encodings", "predicate pushdown"]
related: ["file-format", "apache-arrow", "apache-iceberg"]
sources:
  - label: "Apache Parquet project"
    url: "https://parquet.apache.org"
    note: "Specification, documentation, and release information."
  - label: "Parquet format specification"
    url: "https://github.com/apache/parquet-format"
    note: "The thrift definitions and file layout, authoritative when behavior is in question."
---

Parquet is where analytical data lives when nothing is reading it. It is a columnar file format
built for one access pattern: read some columns from many rows, filtered, as fast as possible, from
storage that charges for bytes read.

It became the default the way JPEG became the default for photographs. Nobody argues about it much.
Engines read it, warehouses export it, catalogs point at it, and object storage is full of it.

## Anatomy

A file divides into **row groups**, horizontal slices of some tens or hundreds of megabytes. Row
groups are the unit of parallelism.

Within a row group, each column is a **column chunk**, stored contiguously. This is where the
columnar benefit comes from.

Each chunk divides into **pages**, the unit of compression and encoding.

At the end sits the **footer**, holding the schema, the location of every column chunk, and
statistics: minimum and maximum values, null counts, and distinct counts where available.

The footer is read first, which is the detail that matters on object storage. A reader fetches a
small footer, works out exactly which byte ranges it needs, and requests only those. The file can be
a gigabyte and the read can touch ten megabytes.

## How skipping works

**Column pruning** is automatic and reliable. Three columns needed from sixty means three chunks
fetched.

**Row group skipping** uses per-group minimum and maximum values. Its effectiveness depends entirely
on data ordering. Sorted by the filter column, most groups are eliminated. Randomly distributed,
every group spans the full range and nothing is skipped.

**Page-level statistics and indexes** apply the same idea at finer granularity.

**Bloom filters** handle high-cardinality equality lookups, where minimum and maximum are useless
because nearly every group's range contains the value.

## Writing it well

Reading Parquet needs no expertise. Writing it well needs a handful of decisions that are easy to
get wrong and expensive to fix later.

Aim for files in the hundreds of megabytes, and row groups of one hundred to five hundred megabytes.
Sort by the column you filter on most; this is the highest-leverage choice available and it costs
nothing at read time. Prefer Zstandard over Snappy unless you have measured otherwise. Enable bloom
filters on identifier columns you look up by value.

And choose types deliberately. Storing numbers or timestamps as strings gives up encoding,
statistics, and skipping in one move. It is the most common avoidable mistake in the format.

## What it is not

Parquet is not a table. A directory of Parquet files has no atomic commits, no snapshot history, and
no safe concurrent writes. Two writers to one directory can produce a state readers observe as
partially updated.

It is also not an in-memory format. Data must be decoded before computation, and the decoded form is
usually Arrow. Treating the two as competitors leads to choosing between things meant to be used
together.
