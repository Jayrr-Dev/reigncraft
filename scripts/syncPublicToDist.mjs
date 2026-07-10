/**
 * Mirrors public/ into dist/client so Devvit playtest serves the latest assets.
 * Removes stale top-level public folders in dist/client before copying so moved
 * assets (e.g. GirlSample subfolders) do not leave orphaned flat files.
 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const publicDir = path.join(repoRoot, 'public');
const clientOutDir = path.join(repoRoot, 'dist', 'client');
const publicAssetRevisionModulePath = path.join(
  repoRoot,
  'src',
  'client',
  'lib',
  'definingPublicAssetRevision.ts'
);

async function listingPublicAssetFingerprintEntries(
  directoryPath,
  relativePath = ''
) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const fingerprintEntries = [];

  for (const entry of entries) {
    const entryRelativePath = relativePath
      ? `${relativePath}/${entry.name}`
      : entry.name;
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      fingerprintEntries.push(
        ...(await listingPublicAssetFingerprintEntries(
          entryPath,
          entryRelativePath
        ))
      );
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const entryStat = await stat(entryPath);
    fingerprintEntries.push(
      `${entryRelativePath}:${entryStat.size}:${entryStat.mtimeMs}`
    );
  }

  return fingerprintEntries;
}

async function computingPublicAssetRevision() {
  let fingerprintEntries = [];

  try {
    fingerprintEntries = await listingPublicAssetFingerprintEntries(publicDir);
  } catch {
    return 'missing-public';
  }

  fingerprintEntries.sort();

  return createHash('sha256')
    .update(fingerprintEntries.join('\n'))
    .digest('hex')
    .slice(0, 12);
}

async function writingPublicAssetRevisionModule() {
  const revision = await computingPublicAssetRevision();
  const moduleSource = [
    '/** Synced from public/ by scripts/syncPublicToDist.mjs. Do not edit by hand. */',
    `export const DEFINING_PUBLIC_ASSET_REVISION = ${JSON.stringify(revision)};`,
    '',
  ].join('\n');

  await writeFile(publicAssetRevisionModulePath, moduleSource);
}

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
  await writingPublicAssetRevisionModule();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Syncing public/ assets into dist/client...');
  await syncPublicToDist();
  console.log('Public asset sync complete.');
}
