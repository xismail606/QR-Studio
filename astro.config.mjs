import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://qr-studio.x606.workers.dev',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    ssr: {
      noExternal: ['qr-code-styling'],
    },
  },
});
