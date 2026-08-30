---
title: The four kinds of open
summary: Open source, open formats, open interfaces, and open governance are separate claims, and conflating them is how lock-in survives.
kind: concept
order: 11
keywords: ["open source", "open format", "open standard", "open governance", "vendor lock-in", "portability"]
related: ["what-is-an-open-lakehouse", "catalog", "apache-polaris"]
sources:
  - label: "Open Source and the Data Lakehouse"
    url: "https://www.dremio.com/blog/open-source-and-the-data-lakehouse"
    note: "Why the openness of each layer has to be assessed separately."
---

Open is the most overloaded word in this subject. It does four different jobs, and a platform can
satisfy one while failing the rest. Keeping them separate is the most useful habit available when
evaluating anything in this space.

## Open source

The implementation is licensed so anyone can use, modify, and redistribute it, including
competitors. This is a claim about code.

It does not tell you whether the data format is documented, whether a second implementation exists,
or whether you could leave.

## Open format

The file or table layout is specified in public, in enough detail to implement from. This is a claim
about data.

The strongest signal is not the specification's existence but the number of independent
implementations. Until a second one exists, nobody has tested whether the document was sufficient.
An open format with one implementation is a published internal format.

## Open interface

The protocol between components is documented and implemented by more than one party, so a client
written against one implementation works against another. This is a claim about the seams.

For day-to-day freedom this often matters more than open source. A proprietary component behind a
widely implemented interface is frequently easier to replace than an open source one that nothing
else speaks.

## Open governance

The specification changes in public, under a process no single commercial interest controls, with
versioning and a visible record of decisions. This is a claim about the future.

It is the one people check last and the one that determines whether the other three stay true. A
format governed by one vendor can be extended in ways only that vendor implements, which produces
lock-in inside a compliant wrapper.

## Applying it

Run the four questions against each layer separately rather than against the platform as a whole.

The common shape of a partly open system is open files, an open table format, and a proprietary
catalog. Every byte is in a documented format, and the only thing that can tell you which bytes
constitute the current table refuses to talk to anyone else. Your data is portable in principle and
captured in practice.

That is not an accusation against any particular product. It is a description of where to look,
because the layer that gets left closed is usually the one that controls access rather than the one
that holds bytes.
