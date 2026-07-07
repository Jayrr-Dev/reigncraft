/**
 * Starts playtest on Windows without EBUSY: copy public/ into dist/client once,
 * then let Vite watch rebuild only JS/CSS (see vite.config.ts copyPublicDir).
 */
import { spawn } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const devvitEntry = path.join(
  repoRoot,
  'node_modules',
  'devvit',
  'bin',
  'devvit.js'
);

const publicDir = path.join(repoRoot, 'public');
const clientOutDir = path.join(repoRoot, 'dist', 'client');

console.log('Syncing public/ assets into dist/client once...');
await mkdir(clientOutDir, { recursive: true });
await cp(publicDir, clientOutDir, { recursive: true, force: true });

const child = spawn(
  process.execPath,
  ['--no-warnings=ExperimentalWarning', devvitEntry, 'playtest'],
  {
    cwd: repoRoot,
    env: { ...process.env, DEVVIT_PLAYTEST_SKIP_PUBLIC_COPY: '1' },
    stdio: 'inherit',
  }
);

child.on('close', (code) => process.exit(code ?? 1));
