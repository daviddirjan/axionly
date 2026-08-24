import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://axionly.io',
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
