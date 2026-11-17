// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Por defecto GitHub Pages de usuario; para un dominio propio, construir con SITE_URL.
const site = process.env.SITE_URL ?? 'https://xjdvm.github.io';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    preact(),
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/404/') && new URL(page).pathname !== '/',
    }),
  ],
});
