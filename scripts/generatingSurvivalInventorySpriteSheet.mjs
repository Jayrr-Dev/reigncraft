/**
 * Generates placeholder survival inventory sprites (5×4 @ 32px) and shelter utilities.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CELL = 32;
const COLS = 5;
const ROWS = 4;
const KEY = { r: 122, g: 122, b: 122, alpha: 1 };

const INVENTORY_HUES = [
  42, 48, 35, 200, 28, 22, 85, 55, 18, 12, 30, 25, 40, 32, 15, 10, 45, 38, 20,
];

const SHEET_ITEMS = [
  'straw-sun-hat',
  'wool-neck-wrap',
  'frost-glare-lenses',
  'swamp-mesh-veil',
  'hide-trail-vest',
  'fur-shoulder-cape',
  'palm-leaf-poncho',
  'bark-bracers',
  'fingerless-work-mitts',
  'cloth-leg-wraps',
  'hide-trail-boots',
  'split-planks',
  'wattle-panel',
  'adobe-brick',
  'rope-coil',
  'peg-stake-pack',
  'reed-mat',
  'clay-daub-mix',
  'lashing-twine-spool',
];

const SHELTER_UTILITIES = [
  'shade-lean-to',
  'brush-windbreak',
  'scout-tent',
  'claim-bedroll',
  'smoke-rack',
];

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

async function drawingIconCell(hue, size = CELL) {
  const { r, g, b } = hslToRgb(hue, 0.55, 0.42);
  const pad = 4;
  const inner = size - pad * 2;
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" rx="3" fill="rgb(${r},${g},${b})"/>
    <rect x="${pad + 2}" y="${pad + 2}" width="${inner - 4}" height="${inner - 4}" rx="2" fill="rgb(${Math.min(255, r + 30)},${Math.min(255, g + 30)},${Math.min(255, b + 30)})"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function packingInventorySheet() {
  const tmpDir = path.join(ROOT, 'tmp', 'survival-sprites');
  await mkdir(tmpDir, { recursive: true });

  const composites = [];
  for (let index = 0; index < SHEET_ITEMS.length; index += 1) {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const cell = await drawingIconCell(INVENTORY_HUES[index] ?? 30);
    const cellPath = path.join(
      tmpDir,
      `${String(index + 1).padStart(2, '0')}-survival-${SHEET_ITEMS[index]}.png`
    );
    await writeFile(cellPath, cell);
    composites.push({ input: cell, left: col * CELL, top: row * CELL });
  }

  const sheet = await sharp({
    create: {
      width: COLS * CELL,
      height: ROWS * CELL,
      channels: 4,
      background: KEY,
    },
  })
    .composite(composites)
    .webp({ lossless: true, effort: 6 })
    .toBuffer();

  const outPath = path.join(
    ROOT,
    'public',
    'inventory',
    'sprites',
    'inventory-survival-sprites.webp'
  );
  await writeFile(outPath, sheet);
  console.log(`Wrote ${outPath}`);
}

async function packingShelterUtilities() {
  const utilDir = path.join(ROOT, 'public', 'environment', 'sprites', 'utilities');
  await mkdir(utilDir, { recursive: true });
  const hues = [35, 28, 42, 55, 18];

  for (let index = 0; index < SHELTER_UTILITIES.length; index += 1) {
    const name = SHELTER_UTILITIES[index];
    const size = 64;
    const cell = await drawingIconCell(hues[index], size);
    const outPath = path.join(utilDir, `survival-${name}.webp`);
    await sharp(cell).webp({ lossless: true, effort: 6 }).toFile(outPath);
    console.log(`Wrote ${outPath}`);
  }
}

await packingInventorySheet();
await packingShelterUtilities();
