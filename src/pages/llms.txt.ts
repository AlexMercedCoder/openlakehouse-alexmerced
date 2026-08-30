import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { dremioHighlights, channels, playlists, community } from '../data/work';
import bookData from '../data/books.json';
import { networkGroups, newsletter } from '../data/network';

const SITE = 'https://openlakehouse.alexmerced.com';

export const GET: APIRoute = async () => {
  const entries = (await getCollection('kb')).sort((a, b) => a.data.order - b.data.order);
  const concepts = entries.filter((e) => e.data.kind === 'concept');
  const technologies = entries.filter((e) => e.data.kind === 'technology');

  const line = (entry: (typeof entries)[number]) =>
    `- [${entry.data.title}](${SITE}/knowledge-base/${entry.id}): ${entry.data.summary}`;

  const body = `# Alex Merced, Open Lakehouse advocate

> Reference material on open lakehouse architecture from Alex Merced, Head of Developer Relations at Dremio and co-author of Apache Iceberg: The Definitive Guide. The site covers the layers of the lakehouse stack, the open projects that implement them, and where to find the rest of the work.

An open lakehouse keeps analytical data in open file and table formats on storage the owner controls, with a catalog that lets any compliant engine read and write it. This site defines the vocabulary layer by layer and covers the five projects that carry most of the weight: Apache Parquet, Apache Arrow, Apache Iceberg, Apache Polaris, and Apache Ossie.

The site is static, has no login, and every page listed here is public.

## Knowledge base: concepts

${concepts.map(line).join('\n')}

## Knowledge base: technologies

${technologies.map(line).join('\n')}

## Site pages

- [Home](${SITE}/): the layered model of the lakehouse, with an entry point into each layer.
- [Knowledge base index](${SITE}/knowledge-base): all ${entries.length} entries, concepts and technologies.
- [Where to find my work](${SITE}/work): articles, video, community, and podcast.
- [Books](${SITE}/books): ${bookData.count} lakehouse and data titles, part of a catalog of ${bookData.totalInCatalog}.

## Selected writing

${dremioHighlights.map((item) => `- [${item.title}](${item.url}): ${item.note}`).join('\n')}

## Channels

${channels.map((item) => `- [${item.name}](${item.url}): ${item.description}`).join('\n')}
${playlists.map((item) => `- [YouTube playlist: ${item.title}](${item.url}): ${item.note}`).join('\n')}

## Community

${community.map((item) => `- [${item.label}](${item.url})`).join('\n')}

## Books on these subjects

${bookData.books
  .map(
    (book) =>
      `- [${book.title}](${book.canonicalPage})${book.publisher ? ` (${book.publisher})` : ''}: ${book.description}`,
  )
  .join('\n')}

Full catalog: ${bookData.catalog}

## Newsletters

Two free newsletters go out each week on Substack: ${newsletter.url}

${newsletter.editions.map((edition) => `- ${edition.title}, every ${edition.day}: ${edition.note}`).join('\n')}

## The rest of the network

${networkGroups
  .map(
    (group) =>
      `### ${group.title}\n\n${group.links
        .map((link) => `- [${link.label}](${link.url})`)
        .join('\n')}`,
  )
  .join('\n\n')}

## Notes for agents

- The site exposes read-only WebMCP tools in the browser: list_knowledge_base, search_knowledge_base, get_knowledge_base_entry, list_lakehouse_work, and list_lakehouse_books.
- Structured data is published as JSON-LD on every page, including WebSite, Person, TechArticle, BreadcrumbList, CollectionPage, and Book nodes.
- Apache Iceberg, Apache Polaris, Apache Parquet, Apache Arrow, and Apache Ossie are trademarks of the Apache Software Foundation. This site is independent and is not affiliated with or endorsed by the ASF.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
