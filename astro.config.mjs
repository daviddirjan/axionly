import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://axionly.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ro'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
