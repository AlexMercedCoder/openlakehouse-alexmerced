---
title: Object storage
summary: The durable, cheap byte store at the bottom of the stack, and the constraints it imposes on everything above it.
kind: concept
order: 2
keywords: ["object storage", "S3", "data lake storage", "immutable files", "storage layer"]
related: ["what-is-an-open-lakehouse", "file-format", "catalog"]
sources:
  - label: "Apache Iceberg table specification"
    url: "https://iceberg.apache.org/spec/"
    note: "Shows how a table format works around the properties of object storage."
---

Object storage is where lakehouse data physically lives. You write whole objects, you read whole
objects or byte ranges of them, and you pay for storage and for requests. It is durable, it scales
without planning, and it is inexpensive enough that keeping years of history is a normal decision
rather than a budget conversation.

It also has three properties that shape every layer above it.

## Objects are immutable

You cannot edit an object in place. You replace it. This is why lakehouse table formats never
update a file: they write new files and change metadata to point at them. Every design decision
about updates, deletes, and compaction traces back to this one constraint.

## Listing is slow and expensive

Finding out which objects exist under a prefix is a request, or many requests, and it gets slower
as the count grows. A table with a million files cannot be planned by listing storage. This is why
table formats keep their own file inventory in metadata: reading a few megabytes of manifests is
faster and cheaper than listing a million objects, and it gives a consistent answer.

## Access is granted by prefix

Storage permissions operate on paths, not on tables, columns, or rows. Expressing anything
finer requires either contorting the physical layout to match the access model, or moving
enforcement somewhere that understands tables. The second is what a catalog is for.

## What this means in practice

A few habits follow directly from the above.

Keep files large enough to be worth fetching. Hundreds of megabytes is a reasonable target. Many
small files turn a cheap scan into thousands of requests, and the request cost can exceed the
storage cost.

Do not let applications hold long-lived storage credentials. Every tool that reads data becomes a
separate place to revoke, and nothing can answer the question of who read what. Credential vending
through a catalog solves this properly.

Treat the bucket as the durable asset. Engines, catalogs, and semantic layers can be replaced. The
bytes are the thing you actually own, which is why keeping them in open formats matters more than
any other decision in the stack.
