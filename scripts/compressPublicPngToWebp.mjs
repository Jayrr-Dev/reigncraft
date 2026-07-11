/**
 * Converts all PNG files under public/ to lossless WebP, then deletes the PNG.
 *
 * Usage:
 *   node scripts/compressPublicPngToWebp.mjs --dry-run
 *   node scripts/compressPublicPngToWebp.mjs
 */
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const publicDir = path.join(repoRoot, 'public');
const dryRun = process.argv.includes('--dry-run');
const CONCURRENCY = 8;

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectPngFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectPngFiles(fullPath);
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        return [fullPath];
      }
      return [];
    })
  );
  return files.flat();
}

/**
 * @param {string} pngPath
 * @returns {Promise<{ pngBytes: number, webpBytes: number, converted: boolean, skipped: boolean }>}
 */
async function convertOnePng(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  const pngStat = await stat(pngPath);
  const pngBytes = pngStat.size;

  try {
    const existingWebpStat = await stat(webpPath);
    if (existingWebpStat.mtimeMs >= pngStat.mtimeMs) {
      return {
        pngBytes,
        webpBytes: existingWebpStat.size,
        converted: false,
        skipped: true,
      };
    }
  } catch {
    // WebP missing; convert below.
  }

  if (dryRun) {
    return { pngBytes, webpBytes: pngBytes, converted: false, skipped: false };
  }

  const webpBuffer = await sharp(pngPath).webp({ lossless: true }).toBuffer();
  await writeFile(webpPath, webpBuffer);
  await unlink(pngPath);

  return {
    pngBytes,
    webpBytes: webpBuffer.length,
    converted: true,
    skipped: false,
  };
}

/**
 * @param {string[]} pngFiles
 */
async function runPool(pngFiles, worker) {
  let index = 0;
  const results = [];

  async function runWorker() {
    while (index < pngFiles.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await worker(pngFiles[currentIndex]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, pngFiles.length) }, () =>
      runWorker()
    )
  );
  return results;
}

export async function compressPublicPngToWebp() {
  const pngFiles = await collectPngFiles(publicDir);
  if (pngFiles.length === 0) {
    console.log('No PNG files found under public/.');
    return;
  }

  console.log(
    `${dryRun ? '[dry-run] ' : ''}Converting ${pngFiles.length} PNG file(s) under public/...`
  );

  const folderStats = new Map();
  let convertedCount = 0;
  let skippedCount = 0;
  let totalPngBytes = 0;
  let totalWebpBytes = 0;

  const results = await runPool(pngFiles, async (pngPath) => {
    const result = await convertOnePng(pngPath);
    const folderKey = path.relative(publicDir, path.dirname(pngPath));
    const folderStat = folderStats.get(folderKey) ?? {
      files: 0,
      pngBytes: 0,
      webpBytes: 0,
      converted: 0,
      skipped: 0,
    };
    folderStat.files += 1;
    folderStat.pngBytes += result.pngBytes;
    folderStat.webpBytes += result.webpBytes;
    if (result.converted) {
      folderStat.converted += 1;
    }
    if (result.skipped) {
      folderStat.skipped += 1;
    }
    folderStats.set(folderKey, folderStat);
    return result;
  });

  for (const result of results) {
    totalPngBytes += result.pngBytes;
    totalWebpBytes += result.webpBytes;
    if (result.converted) {
      convertedCount += 1;
    }
    if (result.skipped) {
      skippedCount += 1;
    }
  }

  const sortedFolders = [...folderStats.entries()].sort(
    (a, b) => b[1].pngBytes - a[1].pngBytes
  );
  for (const [folderKey, folderStat] of sortedFolders) {
    const savedPct =
      folderStat.pngBytes > 0
        ? ((1 - folderStat.webpBytes / folderStat.pngBytes) * 100).toFixed(1)
        : '0.0';
    console.log(
      `  ${folderKey}: ${folderStat.files} file(s), ${formatMb(folderStat.pngBytes)} -> ${formatMb(folderStat.webpBytes)} (${savedPct}% saved, converted ${folderStat.converted}, skipped ${folderStat.skipped})`
    );
  }

  const totalSavedPct =
    totalPngBytes > 0
      ? ((1 - totalWebpBytes / totalPngBytes) * 100).toFixed(1)
      : '0.0';

  console.log('');
  console.log(`Files: ${pngFiles.length}`);
  console.log(`Converted: ${convertedCount}`);
  console.log(`Skipped (webp newer): ${skippedCount}`);
  console.log(
    `Total: ${formatMb(totalPngBytes)} -> ${formatMb(totalWebpBytes)} (${totalSavedPct}% saved)`
  );

  if (dryRun) {
    console.log(
      'Dry run only. Re-run without --dry-run to write WebP and delete PNG.'
    );
  }
}

/**
 * @param {number} bytes
 */
function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  compressPublicPngToWebp().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
