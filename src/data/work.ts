export type Highlight = { title: string; url: string; note: string; tag: string };

/** Where the work lives, and the pieces worth starting with. */
export const dremioHighlights: Highlight[] = [
  {
    title: 'Open Source and the Data Lakehouse',
    url: 'https://www.dremio.com/blog/open-source-and-the-data-lakehouse',
    note: 'Why the openness of each layer has to be assessed separately, rather than as one claim about a platform.',
    tag: 'Architecture',
  },
  {
    title: 'What Are Table Formats and Why Were They Needed?',
    url: 'https://www.dremio.com/blog/what-are-table-formats-and-why-were-they-needed',
    note: 'The path from raw files to table formats, and the specific problems that made them necessary.',
    tag: 'Table formats',
  },
  {
    title: 'Apache Polaris: The Catalog Standard for Lakehouses and AI',
    url: 'https://www.dremio.com/blog/apache-polaris-the-catalog-standard-for-lakehouses-and-ai',
    note: 'How an open catalog standard keeps tables interoperable across engines and clouds.',
    tag: 'Catalogs',
  },
  {
    title: 'The Semantic Layer: The Definitive Guide',
    url: 'https://www.dremio.com/blog/semantic-layer-the-definitive-guide',
    note: 'What a semantic layer is for, and why it became load-bearing once machines started asking the questions.',
    tag: 'Semantics',
  },
  {
    title: 'What Apache Iceberg Native Actually Means',
    url: 'https://www.dremio.com/blog/what-apache-iceberg-native-actually-means',
    note: 'How to tell genuine table format support from a connector that reads and little else.',
    tag: 'Iceberg',
  },
  {
    title: 'What Is Agentic Analytics?',
    url: 'https://www.dremio.com/blog/what-is-agentic-analytics',
    note: 'Agents querying governed data under the same controls applied to people.',
    tag: 'AI',
  },
];

export const channels = [
  {
    name: 'Dremio blog',
    url: 'https://www.dremio.com/blog/author/alex-merced/',
    description:
      'My working posts on lakehouse architecture, Apache Iceberg, catalogs, semantic layers, and agentic analytics.',
    action: 'Read the archive',
  },
  {
    name: 'YouTube, data and AI',
    url: 'https://www.youtube.com/@alexmerceddata',
    description:
      'Walkthroughs and explainers on lakehouse architecture, table formats, and the tooling around them.',
    action: 'Watch',
  },
  {
    name: 'Data Lakehouse Hub',
    url: 'https://datalakehousehub.com',
    description:
      'The community hub: articles, a knowledge base, events, and a Slack where practitioners compare notes.',
    action: 'Join the community',
  },
];

export const playlists = [
  {
    title: 'Data 101',
    url: 'https://www.youtube.com/playlist?list=PLsLAVBjQJO0p_4Nqz99tIjeoDYE97L0xY',
    note: 'Foundations for anyone new to data work, from storage through modeling.',
  },
  {
    title: 'Lakehouse Engineering',
    url: 'https://www.youtube.com/playlist?list=PLsLAVBjQJO0qVfGet6FEQw-nZ6ygLtYuH',
    note: 'Hands-on lakehouse building: table formats, catalogs, engines, and maintenance.',
  },
];

export const community = [
  { label: 'Data Lakehouse Hub Slack', url: 'https://join.slack.com/t/thedatalakehousehub/shared_invite/zt-274yc8sza-mI2zhCW8LGkOh1uxuf8T5Q' },
  { label: 'Data Lakehouse Hub events', url: 'https://luma.com/DataLakehouseHub' },
  { label: 'r/datalakehouseandai', url: 'https://www.reddit.com/r/datalakehouseandai/' },
  { label: 'Dremio developer community', url: 'https://developer.dremio.com' },
  { label: 'The podcast on Spotify', url: 'https://open.spotify.com/show/2PRDrWVpgDvKxN6n1oUsJF' },
];
