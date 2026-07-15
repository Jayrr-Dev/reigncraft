/**
 * Deletes leftover *.map files under dist/client before Devvit upload/publish.
 * Playtest builds may leave maps behind even when production sourcemaps are off
 * (emptyOutDir: false), and maps inflate the webview package for no runtime gain.
 */
import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientOutDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'dist',
  'client'
);

async function collectingMapFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const maps = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      maps.push(...(await collectingMapFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.map')) {
      maps.push(fullPath);
    }
  }

  return maps;
}

try {
  await stat(clientOutDir);
} catch {
  console.log('No dist/client yet; skip sourcemap strip.');
  process.exit(0);
}

const maps = await collectingMapFiles(clientOutDir);
await Promise.all(maps.map((filePath) => rm(filePath, { force: true })));
console.log(`Stripped ${maps.length} sourcemap file(s) from dist/client.`);
