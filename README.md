# openlakehouse.alexmerced.com

The open lakehouse corner of the Alex Merced network of sites. It holds a
knowledge base of lakehouse architecture terminology, one entry per layer and one
per key project, plus pointers to where the rest of the work is published.

Live at **https://openlakehouse.alexmerced.com**

## What is on it

| Route | What it holds |
| --- | --- |
| `/` | The layered model of the lakehouse, with an animated diagram of the stack |
| `/knowledge-base` | 18 entries: 13 concepts and 5 technologies |
| `/knowledge-base/<slug>` | One entry, with primary sources and related reading |
| `/work` | Selected articles, YouTube playlists, community, and podcast |
| `/books` | The lakehouse and data titles, filtered from the full catalog |
| `/llms.txt` | A plain-text map of the site for language models |

## Stack

Astro 5, no UI framework, no client-side router. Content lives in a content
collection under `src/content/kb`, typed by `src/content.config.ts`. Everything
renders to static HTML at build time.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
npm run preview
```

## Machine-readable surfaces

- **JSON-LD** on every page: `WebSite` and `Person` from the layout, plus
  `TechArticle`, `BreadcrumbList`, `CollectionPage`, `ItemList`, and `Book` nodes
  per page.
- **`/llms.txt`** is generated from the same content collection as the pages, so
  it cannot drift from them.
- **WebMCP** read-only browser tools, registered in `src/components/WebMCP.astro`:
  `list_knowledge_base`, `search_knowledge_base`, `get_knowledge_base_entry`,
  `list_lakehouse_work`, `list_lakehouse_books`.
- **Sitemap** at `/sitemap-index.xml` via `@astrojs/sitemap`.

## Book data

`src/data/books.json` is generated, not hand-edited. It comes from the entity
layer in the `alexmercedcom` repo:

```bash
node scripts/build-network-booklists.mjs
```

Run that from `alexmercedcom` and it rewrites the book list for every site in the
network, this one included.

## Trademarks

Apache Iceberg, Apache Polaris, Apache Parquet, Apache Arrow, and Apache Ossie
are trademarks of the Apache Software Foundation. This site is independent and is
not affiliated with, endorsed by, or sponsored by the ASF.

## License

Code is MIT. The prose in `src/content` is copyright Alex Merced.
