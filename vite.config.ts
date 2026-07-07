import { devvit } from '@devvit/start/vite';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(projectRoot, 'src/client');

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  // Watch rebuilds must not rimraf dist/client — playtest, static servers, and
  // open browser tabs often lock files there on Windows (EPERM).
  plugins: [
    react(),
    tailwind(),
    devvit({
      client: {
        build: {
          emptyOutDir: false,
          // During playtest, public/ is copied once by scripts/startDevvitPlaytest.mjs.
          // Skipping per-rebuild copies avoids EBUSY when Devvit uploads dist/client.
          copyPublicDir: process.env.DEVVIT_PLAYTEST_SKIP_PUBLIC_COPY !== '1',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@/components/world': path.resolve(clientRoot, 'world'),
      '@/components': path.resolve(clientRoot, 'components'),
      '@/hooks': path.resolve(clientRoot, 'hooks'),
      '@/lib': path.resolve(clientRoot, 'lib'),
    },
  },
});
