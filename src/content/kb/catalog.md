---
title: Catalog
summary: The service that resolves table names, performs the atomic commit, enforces access, and hands out scoped credentials.
kind: concept
order: 5
keywords: ["data catalog", "Iceberg REST catalog", "credential vending", "access control", "multi-engine"]
related: ["apache-polaris", "table-format", "object-storage"]
sources:
  - label: "Iceberg REST catalog specification"
    url: "https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml"
    note: "The OpenAPI definition that makes catalogs interchangeable between clients."
  - label: "Apache Polaris: The Catalog Standard for Lakehouses and AI"
    url: "https://www.dremio.com/blog/apache-polaris-the-catalog-standard-for-lakehouses-and-ai"
    note: "Why a shared catalog standard matters for multi-engine architectures."
---

The catalog is the smallest component in the lakehouse and the most consequential. It answers a
short list of questions, and everything that reads or writes a table has to ask it.

## What it does

**Resolves names.** A query naming a table gets back the location of its current metadata. Without
this, every query needs a storage path and moving data breaks every consumer.

**Performs the commit.** The atomic pointer swap that makes a table write safe happens here. This is
why a catalog cannot be a passive index: it has to be able to serialize conflicting updates.

**Enforces access.** It decides whether a caller may perform an operation before performing it.

**Vends credentials.** It hands the caller short-lived, scoped credentials for the underlying
storage, rather than expecting every client to hold long-lived keys.

**Lists what exists.** Consumers, including agents and new team members, can discover tables without
being told about them in advance.

## Why it is the control point

There are three plausible places to enforce access to lakehouse data, and only one works well.

In the **query engine** is convenient, because engines already understand tables and columns. It
fails because anything reading storage directly bypasses it, and a second engine means a second
copy of the rules that will drift from the first.

In **storage permissions** cannot be bypassed, but it operates on paths rather than tables. Anything
finer than a prefix requires shaping the physical layout to match the access model.

In the **catalog** works because every reader must consult it to find the current metadata. It sits
in the path by construction, it understands tables rather than prefixes, and when it vends
credentials it can be the only holder of the storage keys. That last property is what turns the
catalog from a convenient place to enforce policy into the correct one.

## Credential vending

This is the mechanism that makes the rest real, and it is often disabled during setup and never
switched back on.

Without it, a client asks the catalog where a table is and then reads storage with its own
long-lived credentials. Every tool holds a copy. Revocation means finding all of them.

With it, the client authenticates to the catalog, the catalog authorizes the operation, and returns
temporary credentials scoped to that table's storage prefix. The client never holds general storage
access. Revoking a grant takes effect as soon as outstanding credentials expire, a leaked credential
is useful for minutes rather than indefinitely, and every access is a catalog request, which means
usage is visible without instrumenting every client.

## The protocol matters

A published catalog protocol means any engine speaking it works with any conformant catalog. Before
that, each engine needed a client per catalog implementation, and adding either meant work on both
sides.

This is the interoperability argument applied to governance rather than to storage, and it is the
more consequential of the two. Storage portability without catalog portability leaves you able to
move your bytes and unable to move the thing that controls them.
