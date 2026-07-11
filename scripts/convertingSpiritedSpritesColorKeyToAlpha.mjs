/**
 * Converts Spirited Sprites color-keyed PNGs to RGBA with real alpha.
 *
 * Most sheets use RGB(116, 141, 164) as the key. Some terrain / optional
 * sheets use a different flat corner color (gray, mint, etc.). Default
 * `--key auto` samples pixel (0,0) per file.
 *
 * Also strips the pack's 1px cell grid (near-black / maroon frame lines).
 * Those are layout guides in the source sheets, not part of the art.
 *
 * Usage:
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs --dry-run
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs --in "C:/path/to/Spirited Sprites 1.3.1" --out "C:/path/to/out"
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs --tolerance 8
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs --key 116,141,164
 *   node scripts/convertingSpiritedSpritesColorKeyToAlpha.mjs --keep-grid
 *
 * Defaults write beside the input folder as `<input-name>-transparent`.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const DEFAULT_INPUT = path.join(
  'C:',
  'Users',
  'Main',
  'Documents',
  'Projects',
  'reigncraft',
  'characters',
  'Spirited Sprites 1.3.1',
  'Spirited Sprites 1.3.1'
);

const CONCURRENCY = 6;

/**
 * Pack cell-grid ink: pure black or near-black with a tiny red channel
 * (looks brown/maroon in some viewers). Not character outline black that
 * sits next to colored art pixels in the same row/column.
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {boolean}
 */
function isGridInkColor(r, g, b) {
  return g <= 2 && b <= 2 && r <= 24;
}

/**
 * @param {string[]} argv
 * @param {string} name
 * @returns {string | undefined}
 */
function readArg(argv, name) {
  const index = argv.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return argv[index + 1];
}

/**
 * @param {string} value
 * @returns {{ mode: 'auto' } | { mode: 'fixed', r: number, g: number, b: number }}
 */
function parseKeyMode(value) {
  if (value === undefined || value === 'auto') {
    return { mode: 'auto' };
  }
  const parts = value.split(',').map((part) => Number(part.trim()));
  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    throw new Error(
      `Invalid --key "${value}". Use "auto" or "R,G,B" (0-255 integers).`
    );
  }
  return { mode: 'fixed', r: parts[0], g: parts[1], b: parts[2] };
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectPngFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
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
  return nested.flat();
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {{ r: number, g: number, b: number }} key
 * @param {number} tolerance
 * @returns {boolean}
 */
function isColorKey(r, g, b, key, tolerance) {
  const dr = r - key.r;
  const dg = g - key.g;
  const db = b - key.b;
  return dr * dr + dg * dg + db * db <= tolerance * tolerance;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function formatRgb(r, g, b) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Clear 1px cell-frame / separator lines: columns or rows that contain only
 * transparency + grid ink (no real art colors).
 *
 * @param {Buffer | Uint8Array} pixels
 * @param {number} width
 * @param {number} height
 * @returns {number} cleared pixel count
 */
function stripGridSeparators(pixels, width, height) {
  /** @type {boolean[]} */
  const clearColumn = Array.from({ length: width }, () => false);
  /** @type {boolean[]} */
  const clearRow = Array.from({ length: height }, () => false);

  for (let x = 0; x < width; x += 1) {
    let gridInk = 0;
    let art = 0;
    for (let y = 0; y < height; y += 1) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] === 0) {
        continue;
      }
      if (isGridInkColor(pixels[i], pixels[i + 1], pixels[i + 2])) {
        gridInk += 1;
      } else {
        art += 1;
      }
    }
    if (art === 0 && gridInk > 0) {
      clearColumn[x] = true;
    }
  }

  for (let y = 0; y < height; y += 1) {
    let gridInk = 0;
    let art = 0;
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] === 0) {
        continue;
      }
      if (isGridInkColor(pixels[i], pixels[i + 1], pixels[i + 2])) {
        gridInk += 1;
      } else {
        art += 1;
      }
    }
    if (art === 0 && gridInk > 0) {
      clearRow[y] = true;
    }
  }

  let cleared = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!clearColumn[x] && !clearRow[y]) {
        continue;
      }
      const i = (y * width + x) * 4;
      if (pixels[i + 3] === 0) {
        continue;
      }
      if (!isGridInkColor(pixels[i], pixels[i + 1], pixels[i + 2])) {
        continue;
      }
      pixels[i + 3] = 0;
      cleared += 1;
    }
  }
  return cleared;
}

/**
 * @param {string} inputPath
 * @param {string} outputPath
 * @param {{ mode: 'auto' } | { mode: 'fixed', r: number, g: number, b: number }} keyMode
 * @param {number} tolerance
 * @param {boolean} stripGrid
 * @param {boolean} dryRun
 * @returns {Promise<{ keyedPixels: number, gridPixels: number, totalPixels: number, key: { r: number, g: number, b: number } }>}
 */
async function convertOnePng(
  inputPath,
  outputPath,
  keyMode,
  tolerance,
  stripGrid,
  dryRun
) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = data;
  const key =
    keyMode.mode === 'fixed'
      ? { r: keyMode.r, g: keyMode.g, b: keyMode.b }
      : { r: pixels[0], g: pixels[1], b: pixels[2] };

  let keyedPixels = 0;
  const totalPixels = info.width * info.height;

  for (let i = 0; i < pixels.length; i += 4) {
    if (isColorKey(pixels[i], pixels[i + 1], pixels[i + 2], key, tolerance)) {
      pixels[i + 3] = 0;
      keyedPixels += 1;
    }
  }

  const gridPixels = stripGrid
    ? stripGridSeparators(pixels, info.width, info.height)
    : 0;

  if (!dryRun) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    const pngBuffer = await sharp(pixels, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();
    await writeFile(outputPath, pngBuffer);
  }

  return { keyedPixels, gridPixels, totalPixels, key };
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<void>} worker
 */
async function mapPool(items, concurrency, worker) {
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index], index);
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => runWorker()
  );
  await Promise.all(runners);
}

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run');
  const stripGrid = !argv.includes('--keep-grid');
  const inputDir = path.resolve(readArg(argv, '--in') ?? DEFAULT_INPUT);
  const toleranceRaw = readArg(argv, '--tolerance');
  const tolerance = toleranceRaw === undefined ? 4 : Number(toleranceRaw);
  const keyMode = parseKeyMode(readArg(argv, '--key'));

  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new Error(`Invalid --tolerance: ${toleranceRaw}`);
  }

  const defaultOut = `${inputDir}-transparent`;
  const outputDir = path.resolve(readArg(argv, '--out') ?? defaultOut);

  const pngFiles = await collectPngFiles(inputDir);
  if (pngFiles.length === 0) {
    throw new Error(`No PNG files found under ${inputDir}`);
  }

  const keyLabel =
    keyMode.mode === 'auto'
      ? 'auto(corner)'
      : formatRgb(keyMode.r, keyMode.g, keyMode.b);

  console.log(
    [
      dryRun ? '[dry-run]' : '[write]',
      `in=${inputDir}`,
      `out=${outputDir}`,
      `tolerance=${tolerance}`,
      `key=${keyLabel}`,
      `stripGrid=${stripGrid}`,
      `files=${pngFiles.length}`,
    ].join(' ')
  );

  let converted = 0;
  let totalKeyed = 0;
  let totalGrid = 0;
  let zeroKeyed = 0;

  await mapPool(pngFiles, CONCURRENCY, async (inputPath) => {
    const relativePath = path.relative(inputDir, inputPath);
    const outputPath = path.join(outputDir, relativePath);
    const result = await convertOnePng(
      inputPath,
      outputPath,
      keyMode,
      tolerance,
      stripGrid,
      dryRun
    );
    converted += 1;
    totalKeyed += result.keyedPixels;
    totalGrid += result.gridPixels;
    if (result.keyedPixels === 0) {
      zeroKeyed += 1;
    }
    const pct = ((result.keyedPixels / result.totalPixels) * 100).toFixed(1);
    console.log(
      `${converted}/${pngFiles.length} ${relativePath} key=${formatRgb(result.key.r, result.key.g, result.key.b)} keyed=${result.keyedPixels} (${pct}%) grid=${result.gridPixels}`
    );
  });

  console.log(
    `Done. ${converted} PNG(s). Keyed: ${totalKeyed}. Grid stripped: ${totalGrid}. Zero-keyed: ${zeroKeyed}.${dryRun ? ' (no files written)' : ` Wrote to ${outputDir}`}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
