/**
 * Mirrors public/ into dist/client so Devvit playtest serves the latest assets.
 * Removes stale top-level public folders in dist/client before copying so moved
 * assets (e.g. GirlSample subfolders) do not leave orphaned flat files.
 *
 * Also drops previously mirrored top-level names that no longer exist under
 * public/, and top-level vendor archives (.zip/.rar) that must never ship.
 * Without orphan cleanup, dist/client grows past Devvit's 1GB webview limit and
 * new paths like /fire/sprites/props/* 404 after upload fails.
 */
import { createHash } from 'node:crypto';
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
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
const publicMirrorEntriesStatePath = path.join(
  clientOutDir,
  '.public-mirror-entries.json'
);

/**
 * Historical public/ top-level names that may still linger in dist/client after
 * moves. Used only when the mirror state file is missing (first run / recovery).
 */
const LEGACY_PUBLIC_MIRROR_TOP_LEVEL_NAMES = [
  'Animals',
  'Campfires.png',
  'Cat Orange',
  'Chihuahua',
  'Cozy Tunes v1.5.3',
  'Effect and FX Pixel All Free',
  'Fox-Peach',
  'GirlSample_Walk_256Update',
  'Golden Retriever',
  'Grizzly',
  'Husky',
  'Lava.png',
  'Pig',
  'Pinguin',
  'fire asset red',
  'fire asset smoke',
  'firelands',
  'sprites',
  'audio',
  'sfx',
  'tools-8dir',
];

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

async function readingPublicAssetRevisionModule() {
  try {
    const moduleSource = await readFile(publicAssetRevisionModulePath, 'utf8');
    const match = moduleSource.match(
      /export const DEFINING_PUBLIC_ASSET_REVISION = "([^"]+)"/
    );

    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

async function writingPublicAssetRevisionModule() {
  const revision = await computingPublicAssetRevision();
  const moduleSource = [
    '/** Synced from public/ by scripts/syncPublicToDist.mjs. Do not edit by hand. */',
    `export const DEFINING_PUBLIC_ASSET_REVISION = ${JSON.stringify(revision)};`,
    '',
  ].join('\n');

  await writeFile(publicAssetRevisionModulePath, moduleSource);
  return revision;
}

async function readingPreviousPublicMirrorEntries() {
  try {
    const parsed = JSON.parse(
      await readFile(publicMirrorEntriesStatePath, 'utf8')
    );
    if (!Array.isArray(parsed)) {
      return [...LEGACY_PUBLIC_MIRROR_TOP_LEVEL_NAMES];
    }
    return parsed.filter((entry) => typeof entry === 'string');
  } catch {
    return [...LEGACY_PUBLIC_MIRROR_TOP_LEVEL_NAMES];
  }
}

async function writingPublicMirrorEntries(entryNames) {
  const sortedEntryNames = [...entryNames].sort();
  await writeFile(
    publicMirrorEntriesStatePath,
    `${JSON.stringify(sortedEntryNames, null, 2)}\n`
  );
}

function checkingTopLevelVendorArchiveName(entryName) {
  const lowerName = entryName.toLowerCase();
  return lowerName.endsWith('.zip') || lowerName.endsWith('.rar');
}

async function removingPathIfPresent(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
}

async function removingStalePublicMirrorEntries(publicEntryNames) {
  const previousMirrorEntries = await readingPreviousPublicMirrorEntries();
  const publicEntryNameSet = new Set(publicEntryNames);
  const removedOrphanNames = [];

  for (const entryName of previousMirrorEntries) {
    if (publicEntryNameSet.has(entryName)) {
      continue;
    }

    await removingPathIfPresent(path.join(clientOutDir, entryName));
    removedOrphanNames.push(entryName);
  }

  let distEntries = [];
  try {
    distEntries = await readdir(clientOutDir);
  } catch {
    distEntries = [];
  }

  for (const entryName of distEntries) {
    if (!checkingTopLevelVendorArchiveName(entryName)) {
      continue;
    }

    await removingPathIfPresent(path.join(clientOutDir, entryName));
    removedOrphanNames.push(entryName);
  }

  await Promise.all(
    publicEntryNames.map(async (entryName) => {
      await removingPathIfPresent(path.join(clientOutDir, entryName));
    })
  );

  if (removedOrphanNames.length > 0) {
    const uniqueRemovedNames = [...new Set(removedOrphanNames)].sort();
    console.log(
      `Removed ${uniqueRemovedNames.length} stale dist/client public mirror(s): ${uniqueRemovedNames.join(', ')}`
    );
  }
}

export async function syncPublicToDist() {
  const previousRevision = await readingPublicAssetRevisionModule();

  await mkdir(clientOutDir, { recursive: true });

  let publicEntryNames = [];
  try {
    publicEntryNames = await readdir(publicDir);
  } catch {
    publicEntryNames = [];
  }

  await removingStalePublicMirrorEntries(publicEntryNames);
  await cp(publicDir, clientOutDir, { recursive: true, force: true });
  await writingPublicMirrorEntries(publicEntryNames);
  const revision = await writingPublicAssetRevisionModule();

  if (previousRevision !== revision) {
    console.log(
      `Public asset revision bumped: ${previousRevision ?? '(none)'} -> ${revision}`
    );
    console.log(
      'If playtest is running, wait for the rebuild upload, then reload the Reddit playtest tab.'
    );
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Syncing public/ assets into dist/client...');
  await syncPublicToDist();
  console.log('Public asset sync complete.');
}
