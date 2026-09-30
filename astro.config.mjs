import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { gitLastmod } from './scripts/git-lastmod.mjs';

export default defineConfig({
  site: 'https://openlakehouse.alexmerced.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = gitLastmod(item.url);
        if (lastmod) item.lastmod = lastmod.toISOString();
        else delete item.lastmod;
        return item;
      },
    }),
  ],
  build: { format: 'directory' },
});
