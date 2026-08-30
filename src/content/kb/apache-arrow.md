---
title: Apache Arrow
summary: A standard way to lay out tabular data in memory so processes and languages can share it without converting it first.
kind: technology
order: 2
apacheProject: true
keywords: ["Apache Arrow", "columnar memory format", "Arrow Flight", "ADBC", "zero copy", "interchange"]
related: ["apache-parquet", "query-engines", "file-format"]
sources:
  - label: "Apache Arrow project"
    url: "https://arrow.apache.org"
    note: "Specification, implementations across languages, and release notes."
  - label: "Arrow columnar format specification"
    url: "https://arrow.apache.org/docs/format/Columnar.html"
    note: "The actual memory layout rules, worth reading once if you work near this layer."
  - label: "Arrow Flight SQL"
    url: "https://arrow.apache.org/docs/format/FlightSql.html"
    note: "A database protocol that returns Arrow data without row-by-row conversion."
---

Arrow specifies how tabular data is arranged in memory, plus libraries implementing that layout in
many languages. It is not a database, not a file format, and not a processing engine. It defines the
shape of the bytes while they are being worked on.

Its value is subtractive: it removes the translation step that used to happen every time data
crossed a boundary between two systems.

## The problem

Before a shared in-memory standard, every system had its own representation. A query engine held
rows one way, a Python library another, a Java service a third. Every hop meant serializing and
deserializing.

That was not a small tax. In analytical pipelines it was routinely a large fraction of total
runtime, growing with data volume and contributing nothing. It also multiplied work: connecting five
systems meant conversions between each pair.

With a shared layout, handing a batch from one system to another can be a pointer pass. Connecting
five systems means each implements the standard once.

## What the layout looks like

More concrete than people expect. A column of four integers with one missing is two buffers: a
validity bitmap with one bit per value, and a values buffer of four fixed-width slots. Reading the
tenth value is arithmetic on a base address.

Variable-length data such as strings adds an offsets buffer giving each value's start position
inside one contiguous character buffer. Nested types decompose recursively into the same flat
buffers, which is why implementing Arrow in a new language means handling a small number of
primitive shapes rather than an open-ended type system.

## Flight and ADBC

These are where Arrow stops being an internal detail.

Traditional database drivers fetch rows and convert each field into the client language's types.
For fifty rows that is fine. For ten million it is the bottleneck, and it lives entirely on the
client side where no amount of engine optimization reaches it.

Flight SQL and ADBC replace that with a bulk path: the server produces Arrow batches, the client
receives Arrow batches, and no per-row conversion happens at either end. In practice this turns
large result delivery from minutes into seconds.

## Where it shows up for you

Mostly invisibly. Many well-known tools use Arrow internally without advertising it, which is the
usual sign that a format has become infrastructure rather than a product choice.

You meet it directly when moving data between two libraries, when building a service that returns
large result sets, or when profiling a pipeline and finding that a conversion in a hot path is the
cost.

## Two cautions

Arrow is not compressed. The same data occupies considerably more memory as Arrow than as a Parquet
file on disk, sometimes five to ten times more. Reading a large file entirely into memory can exhaust
it in a way the file size does not suggest. Read in batches and aggregate as you go.

And zero copy applies between Arrow-aware components. The moment data passes through something that
converts to another representation and back, the benefit is gone for that path.
