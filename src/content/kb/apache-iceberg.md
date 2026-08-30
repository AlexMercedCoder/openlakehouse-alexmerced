---
title: Apache Iceberg
summary: The table format that turns files in object storage into a real table, with atomic commits, schema evolution, and history.
kind: technology
order: 3
apacheProject: true
keywords: ["Apache Iceberg", "open table format", "snapshots", "time travel", "hidden partitioning", "REST catalog"]
related: ["table-format", "apache-polaris", "apache-parquet"]
sources:
  - label: "Apache Iceberg project"
    url: "https://iceberg.apache.org"
    note: "Documentation, engine integration guides, and releases."
  - label: "Iceberg table specification"
    url: "https://iceberg.apache.org/spec/"
    note: "The authoritative description of metadata, manifests, and snapshot semantics."
  - label: "Apache Iceberg: The Definitive Guide"
    url: "https://books.alexmerced.com/books/apache-iceberg-the-definitive-guide/"
    note: "Book-length treatment, written with Tomer Shiran and Jason Hughes for O'Reilly."
---

Iceberg is a specification for describing a table made of files. It stores no data itself. It stores
metadata: which files belong to the table now, what the schema is, how it is partitioned, what
statistics each file has, and what all of that looked like at every previous commit.

The data stays in ordinary Parquet, ORC, or Avro files in ordinary object storage. Iceberg adds JSON
and Avro metadata describing them, plus a pointer saying which metadata file is current. Changing
that pointer atomically is a commit.

## How the metadata is shaped

A tree, and its shape explains both the performance and the failure modes.

At the top is the **catalog pointer**, the single mutable thing in the system. Below it a **metadata
file** holds schema, partition spec, properties, and the snapshot list. Each **snapshot** points at a
**manifest list**, which points at **manifest files**, which list data files with their partition
values, record counts, and per-column statistics. At the bottom sit the data files.

The consequence is that planning reads metadata rather than listing storage. Finding files matching
a filter means reading the manifest list, eliminating manifests whose partition ranges cannot match,
then eliminating files whose statistics cannot match. Planning a query over a million-file table can
touch a few megabytes instead of a million-object listing.

Nothing is overwritten, so every version of the table is fully described by an immutable file set.
That is what makes history cheap and rollback instant.

## Schema evolution that holds

Iceberg assigns every column a stable numeric identifier at creation, and all metadata refers to
columns by identifier. Names are display, mapped onto identifiers.

That single decision makes a set of operations safe that are dangerous in name-based formats.
Renaming a column changes nothing about existing files. Adding one means old files simply lack it
and reads return null. Dropping retires an identifier. Reordering is presentation. Widening a type
is permitted where it cannot lose information.

Anyone who has watched a column rename turn into a multi-day backfill will recognize why identifier
resolution is more than a detail.

## Hidden partitioning

Iceberg records the partition scheme as a transform in metadata rather than in directory paths.
Queries filter on the natural column and the engine derives the partition filter.

Users stop needing to know the physical layout to query efficiently. And because partitioning is
metadata, it can evolve: a table partitioned by month can be repartitioned by day going forward,
with both layouts coexisting and queries planning correctly across the boundary.

## What it is not

Not a query engine. It describes tables; engines read and write them, and performance comparisons
between table formats usually end up measuring engines.

Not a catalog, though the two are constantly conflated. The specification defines what a catalog must
do and implements none.

Not a transactional database. It gives atomic commits on a table, not fast small transactions across
rows. Operational workloads belong elsewhere, with analytical copies landing here.
