/**
 * Starts playtest on Windows without EBUSY: copy public/ into dist/client once,
 * then let Vite watch rebuild only JS/CSS (see vite.config.ts copyPublicDir).
 */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncPublicToDist } from './syncPublicToDist.mjs';

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

console.log('Syncing public/ assets into dist/client once...');
await syncPublicToDist();

const publicDir = path.join(repoRoot, 'public');
let publicSyncTimeout = null;
/** Serialize syncs: overlapping rm+cp races cause Windows ENOTEMPTY and 404s. */
let publicSyncChain = Promise.resolve();
let publicSyncPending = false;

const drainingPublicAssetSyncQueue = () => {
  publicSyncChain = publicSyncChain
    .catch(() => {
      // Prior failure already logged; keep the chain alive.
    })
    .then(async () => {
      while (publicSyncPending) {
        publicSyncPending = false;
        console.log(
          'public/ changed — syncing assets and bumping client revision...'
        );
        try {
          await syncPublicToDist();
        } catch (error) {
          console.error('Failed to sync public/ assets:', error);
        }
      }
    });
};

const schedulingPublicAssetSync = () => {
  if (publicSyncTimeout) {
    clearTimeout(publicSyncTimeout);
  }

  // Sprite/sfx bursts fire many watch events; 250ms still overlaps wipe+cp on Windows.
  publicSyncTimeout = setTimeout(() => {
    publicSyncTimeout = null;
    publicSyncPending = true;
    drainingPublicAssetSyncQueue();
  }, 750);
};

try {
  watch(publicDir, { recursive: true }, schedulingPublicAssetSync);
  console.log('Watching public/ for asset changes during playtest.');
} catch (error) {
  console.warn('Could not watch public/ recursively:', error);
}

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
