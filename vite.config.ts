import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { devvit } from '@devvit/start/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(projectRoot, 'src/client');

export default defineConfig({
  // Watch rebuilds must not rimraf dist/client — playtest, static servers, and
  // open browser tabs often lock files there on Windows (EPERM).
  plugins: [
    react(),
    tailwind(),
    devvit({
      client: {
        build: {
          emptyOutDir: false,
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
