import path from 'node:path';
import { defineConfig } from 'vitest/config';

const clientRoot = path.resolve(import.meta.dirname, 'src/client');

export default defineConfig({
  resolve: {
    alias: {
      '@/components/world': path.resolve(clientRoot, 'world'),
      '@/components': path.resolve(clientRoot, 'components'),
      '@/hooks': path.resolve(clientRoot, 'hooks'),
      '@/lib': path.resolve(clientRoot, 'lib'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
