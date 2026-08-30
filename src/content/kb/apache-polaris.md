---
title: Apache Polaris
summary: An open catalog for Iceberg tables that resolves names, enforces access, and vends scoped credentials.
kind: technology
order: 4
apacheProject: true
keywords: ["Apache Polaris", "Iceberg REST catalog", "credential vending", "RBAC", "catalog federation", "multi-engine"]
related: ["catalog", "apache-iceberg", "kinds-of-open"]
sources:
  - label: "Apache Polaris project"
    url: "https://polaris.apache.org"
    note: "Documentation, releases, and community mailing lists."
  - label: "Polaris graduation announcement"
    url: "https://polaris.apache.org/blog/2026/02/19/apache-polaris-graduates-to-top-level-project/"
    note: "The project's move from the Apache Incubator to top-level status."
  - label: "Apache Polaris: The Definitive Guide"
    url: "https://books.alexmerced.com/books/apache-polaris-the-definitive-guide/"
    note: "Book-length treatment of open catalogs for Iceberg lakehouses."
---

Polaris is an open-source catalog for Apache Iceberg tables. It implements the Iceberg REST catalog
protocol, which means any engine or client speaking that protocol can use it without a
Polaris-specific driver.

Its job is to answer questions about tables rather than to store data. Which tables exist. Where is
the current metadata for this one. May this caller read it. Here are temporary credentials scoped to
exactly that. Commit this new version, but only if the version I started from is still current.

Described that way it sounds like plumbing, and it is. It is also the most important governance
decision in the data layer, because every read and write passes through it.

## Status

Polaris entered the Apache Incubator after being contributed as open source, and graduated to a
top-level Apache project in early 2026.

Graduation is a meaningful signal rather than a formality. It indicates the foundation judged the
project to have a sufficiently diverse community and a working governance process to sustain itself
independently of any single contributing company. For a component that sits at the center of the
data layer and will be a long-lived dependency, that governance question is as much a part of the
evaluation as the feature list.

## What a request looks like

Walking one read through makes the division of labor concrete.

The client authenticates and receives a token. It asks to load a table by name rather than by path.
The catalog checks whether this principal holds a role granting read on that object, and a denial
happens here, before anything is read. The catalog returns the metadata location plus temporary
credentials scoped to that table's storage prefix. The client reads metadata, plans, and then reads
data **directly from storage** using those credentials.

That last step is why the catalog is on the control path rather than the data path. It needs to be
highly available and low latency, and not high bandwidth.

## Access control

Polaris organizes access around catalogs, namespaces, and tables, with roles granting privileges and
principals holding roles.

Two design points matter more than the specifics. Privileges are **hierarchical**, so a grant at
namespace level covers the tables within it. Systems requiring a grant per table become unmanageable
at a few hundred tables and then get worked around with a wildcard that defeats the purpose.

And the **principal is a first-class concept**, distinct from a human user. A service, a pipeline, or
an agent can be its own principal with its own roles. That is what makes it possible to say precisely
what one consumer may reach, rather than inferring it.

## Where teams go wrong

**Credential vending disabled during setup.** It is easier to get things working with direct storage
credentials, and the temporary arrangement becomes permanent. This quietly removes the enforcement
while leaving the authorization check in place as a formality anything can route around.

**One shared principal for everything.** Convenient, and it collapses every access record into one
identity, removing the ability to attribute anything.

**Confusing it with a discovery product.** Business glossaries and data discovery tools are also
called catalogs. That is a different thing. Both can be useful, and only one is in the read path.
