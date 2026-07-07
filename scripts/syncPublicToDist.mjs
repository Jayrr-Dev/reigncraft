/**
 * Mirrors public/ into dist/client so Devvit playtest serves the latest assets.
 * Removes stale top-level public folders in dist/client before copying so moved
 * assets (e.g. GirlSample subfolders) do not leave orphaned flat files.
 */
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const publicDir = path.join(repoRoot, 'public');
const clientOutDir = path.join(repoRoot, 'dist', 'client');

async function removingStalePublicMirrorEntries() {
  let publicEntries;
  try {
    publicEntries = await readdir(publicDir);
  } catch {
    return;
  }

  await Promise.all(
    publicEntries.map(async (entryName) => {
      const sourcePath = path.join(publicDir, entryName);
      const destinationPath = path.join(clientOutDir, entryName);
      const sourceStat = await stat(sourcePath);

      if (!sourceStat.isDirectory()) {
        return;
      }

      await rm(destinationPath, { recursive: true, force: true });
    })
  );
}

export async function syncPublicToDist() {
  await mkdir(clientOutDir, { recursive: true });
  await removingStalePublicMirrorEntries();
  await cp(publicDir, clientOutDir, { recursive: true, force: true });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Syncing public/ assets into dist/client...');
  await syncPublicToDist();
  console.log('Public asset sync complete.');
}
