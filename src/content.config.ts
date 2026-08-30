import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const kb = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/kb' }),
  schema: z.object({
    title: z.string(),
    /** One sentence. Used as the meta description and the card blurb. */
    summary: z.string(),
    /** concept entries define the vocabulary; technology entries cover a project. */
    kind: z.enum(['concept', 'technology']),
    /** Position within its group on the index. */
    order: z.number(),
    keywords: z.array(z.string()).default([]),
    /** Primary sources, shown at the foot of every entry. */
    sources: z.array(z.object({ label: z.string(), url: z.string().url(), note: z.string() })).default([]),
    related: z.array(z.string()).default([]),
    /** Set on technology entries so the page can show the trademark notice. */
    apacheProject: z.boolean().default(false),
  }),
});

export const collections = { kb };
