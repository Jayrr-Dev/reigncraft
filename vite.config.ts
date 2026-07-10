import { devvit } from '@devvit/start/vite';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { vitePatchingStarAudioForDevvitIframe } from './scripts/vitePatchingStarAudioForDevvitIframe.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(projectRoot, 'src/client');
const packageJson = JSON.parse(
  readFileSync(path.resolve(projectRoot, 'package.json'), 'utf8')
) as { version: string };

// Devvit's Rolldown client build does not apply Vite `define` / virtual modules
// reliably, so sync package.json version into a plain TS module instead.
const appVersionModulePath = path.resolve(
  clientRoot,
  'lib',
  'definingAppVersion.ts'
);
const appVersionModuleSource = [
  '/** Synced from package.json by vite.config.ts. Do not edit by hand. */',
  `export const DEFINING_APP_VERSION = ${JSON.stringify(packageJson.version)};`,
  '',
].join('\n');
try {
  if (readFileSync(appVersionModulePath, 'utf8') !== appVersionModuleSource) {
    writeFileSync(appVersionModulePath, appVersionModuleSource);
  }
} catch {
  writeFileSync(appVersionModulePath, appVersionModuleSource);
}

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  // Watch rebuilds must not rimraf dist/client — playtest, static servers, and
  // open browser tabs often lock files there on Windows (EPERM).
  plugins: [
    vitePatchingStarAudioForDevvitIframe(),
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
