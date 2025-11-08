// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  base: '/',
  build: {
    format: 'directory'
  },
  site: 'https://neurohelix.patchoutech.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
      langs: []
    },
    // Enable automatic heading IDs for anchor links
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', {
        behavior: 'wrap',
        properties: {
          className: ['heading-anchor']
        }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
