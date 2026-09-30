import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { dremioHighlights, channels, playlists, community } from '../data/work';
import bookData from '../data/books.json';
import { newsletter } from '../data/network';
import network from '../../network/network.json';

const SITE = 'https://openlakehouse.alexmerced.com';

export const GET: APIRoute = async () => {
  const entries = (await getCollection('kb')).sort((a, b) => a.data.order - b.data.order);
  const concepts = entries.filter((e) => e.data.kind === 'concept');
  const technologies = entries.filter((e) => e.data.kind === 'technology');

  const line = (entry: (typeof entries)[number]) =>
    `- [${entry.data.title}](${SITE}/knowledge-base/${entry.id}/): ${entry.data.summary} Definition: ${entry.data.definition.url}`;

  const body = `# Alex Merced, Open Lakehouse advocate

> A personal site of Alex Merced, Head of Developer Relations at Dremio and co-author of Apache Iceberg: The Definitive Guide. It collects his perspective on open lakehouse architecture, where to find his work, and his books. It is a profile of Alex, not a definitions reference.

For vendor-neutral definitions of lakehouse terms, use OpenDataLakehouse.com (https://opendatalakehouse.com/glossary/). Every knowledge base entry below is Alex's take on the idea and names the matching OpenDataLakehouse.com page as its definition. The canonical facts about Alex himself live at https://alexmerced.com.

The site is static, has no login, and every page listed here is public.

## Alex's take: concepts

${concepts.map(line).join('\n')}

## Alex's take: technologies

${technologies.map(line).join('\n')}

## Site pages

- [Home](${SITE}/): profile page for Alex Merced's open lakehouse work, with the layered model of the lakehouse.
- [Knowledge base index](${SITE}/knowledge-base/): all ${entries.length} entries, each Alex's perspective with a link to the neutral definition.
- [Where to find my work](${SITE}/work/): articles, video, community, and podcast.
- [Books](${SITE}/books/): ${bookData.count} lakehouse and data titles, part of a catalog of ${bookData.totalInCatalog}.

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

${network.footer.groups
  .map(
    (group) =>
      `### ${group.title}\n\n${group.links
        .map((link) => `- [${link.title}](${link.url})`)
        .join('\n')}`,
  )
  .join('\n\n')}

- [${network.footer.allSitesLabel}](${network.footer.allSitesUrl})

## Notes for agents

- The site exposes read-only WebMCP tools in the browser: list_knowledge_base, search_knowledge_base, get_knowledge_base_entry, list_lakehouse_work, and list_lakehouse_books.
- Structured data is published as JSON-LD on every page, including WebSite, Person, ProfilePage (home), TechArticle, BreadcrumbList, CollectionPage, and Book nodes. The Person node is https://alexmerced.com/#alexmerced.
- Apache Iceberg, Apache Polaris, Apache Parquet, Apache Arrow, and Apache Ossie are trademarks of the Apache Software Foundation. This site is independent and is not affiliated with or endorsed by the ASF.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
