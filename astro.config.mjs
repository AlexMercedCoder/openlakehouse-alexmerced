import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { lastmodFor } from './scripts/content-dates.mjs';

export default defineConfig({
  site: 'https://openlakehouse.alexmerced.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // lastmod is the content date from git, never the build time.
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        if (lastmod) item.lastmod = lastmod.toISOString();
        else delete item.lastmod;
        return item;
      },
    }),
  ],
  build: { format: 'directory' },
});
