import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Minecraft-inspired biome catalog for the plaza sandbox.
 *
 * @module components/world/domains/definingWorldPlazaBiomeConstants
 */

/** Linear scale for biome patches and named-realm spacing in world tiles. */
export const DEFINING_WORLD_PLAZA_BIOME_WORLD_LINEAR_SCALE = 4;

/** Base biome region size at {@link DEFINING_WORLD_PLAZA_BIOME_WORLD_LINEAR_SCALE} 1. */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE_BASE = 32;

/** Region size in tiles used to pick a biome (chunk-like). */
export const DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE =
  DEFINING_WORLD_PLAZA_BIOME_REGION_TILE_SIZE_BASE *
  DEFINING_WORLD_PLAZA_BIOME_WORLD_LINEAR_SCALE;

/**
 * Scales a base world-feature span in tiles from scale 1 to the current biome scale.
 *
 * @param baseSpanTiles - Feature width at linear scale 1.
 */
export function scalingWorldPlazaBiomeWorldFeatureSpanTiles(
  baseSpanTiles: number
): number {
  return baseSpanTiles * DEFINING_WORLD_PLAZA_BIOME_WORLD_LINEAR_SCALE;
}

/**
 * Noise frequency for a procedural feature with the given base span at scale 1.
 *
 * @param baseFeatureSpanTiles - Approximate feature width in tiles at linear scale 1.
 */
export function definingWorldPlazaBiomeWorldNoiseFrequency(
  baseFeatureSpanTiles: number
): number {
  return 1 / scalingWorldPlazaBiomeWorldFeatureSpanTiles(baseFeatureSpanTiles);
}

/** Base flower decoration radius before deterministic per-tile scaling. */
export const DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX = 2.25;

/** Smallest deterministic flower radius multiplier. */
export const DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MIN = 0.7;

/** Largest deterministic flower radius multiplier. */
export const DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MAX = 1.3;

/** Speck dot radius for subtle ground texture. */
export const DEFINING_WORLD_PLAZA_BIOME_SPECK_DOT_RADIUS_PX = 1.5;

/** Block face highlight dot radius (top-of-tile shine). */
export const DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_DOT_RADIUS_PX = 1.75;

/** Modulus for block face highlight placement. */
export const DEFINING_WORLD_PLAZA_BIOME_BLOCK_HIGHLIGHT_TILE_MODULUS = 6;

/** Remainder that marks a tile as receiving a decoration roll. */
export const DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER = 0;

/** Runtime definition for one biome kind. */
export interface DefiningWorldPlazaBiomeDefinition {
  /** Stable biome id. */
  kind: DefiningWorldPlazaBiomeKind;
  /** Player-facing label (Minecraft-style). */
  displayName: string;
  /**
   * Representative temperature in [0, 1]; higher values suppress surface water spawn.
   */
  temperature: number;
  /**
   * Average terrain height multiplier in [0, 1]. Ground is world layer 1 (build
   * layer 1). 0 keeps a biome flat; 1 allows the full procedural elevation range.
   */
  altitudeFactor: number;
  /** Base isometric tile fill color. */
  tileFillColor: number;
  /** Rare patch block (dirt, coarse sand, podzol); null disables. */
  blockAccentColor: number | null;
  /** Top-face highlight for block depth; null disables. */
  blockHighlightColor: number | null;
  /** Optional darker speck color; null disables specks. */
  speckColor: number | null;
  /** Modulus for speck placement; null disables specks. */
  speckTileModulus: number | null;
  /** Flower dot colors; null disables flowers. */
  flowerColors: readonly number[] | null;
  /** Modulus for flower placement; null disables flowers. */
  flowerTileModulus: number | null;
  /** Modulus for long-grass sprite clumps; null disables long grass. */
  longGrassTileModulus: number | null;
  /** Tailwind classes for the host sky gradient. */
  skyBackdropClassName: string;
}

/** Default sky when biome lookup fails. */
export const DEFINING_WORLD_PLAZA_BIOME_DEFAULT_SKY_BACKDROP_CLASS_NAME =
  'bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-200';

/** Catalog keyed by {@link DefiningWorldPlazaBiomeKind}. */
export const DEFINING_WORLD_PLAZA_BIOME_CATALOG: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningWorldPlazaBiomeDefinition
> = {
  plains: {
    kind: 'plains',
    displayName: 'Plains',
    temperature: 0.52,
    altitudeFactor: 0.12,
    tileFillColor: 0x7cba3d,
    blockAccentColor: 0x8b6914,
    blockHighlightColor: 0x91c848,
    speckColor: null,
    speckTileModulus: null,
    flowerColors: [0xffd966, 0xff8fab, 0xffffff],
    flowerTileModulus: 80,
    longGrassTileModulus: 32,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-400 via-sky-200 to-[#7cba3d]',
  },
  forest: {
    kind: 'forest',
    displayName: 'Forest',
    temperature: 0.34,
    altitudeFactor: 0.18,
    tileFillColor: 0x4a7c3f,
    blockAccentColor: 0x5c4033,
    blockHighlightColor: 0x5a9448,
    speckColor: 0x3d6634,
    speckTileModulus: 13,
    flowerColors: [0xff8fab, 0xffd966, 0xc77dff, 0xffffff],
    flowerTileModulus: 130,
    longGrassTileModulus: 58,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-500 via-emerald-200 to-[#4a7c3f]',
  },
  flower_forest: {
    kind: 'flower_forest',
    displayName: 'Flower Forest',
    temperature: 0.4,
    altitudeFactor: 0.12,
    tileFillColor: 0x6faa42,
    blockAccentColor: 0x6b5024,
    blockHighlightColor: 0x7fbb52,
    speckColor: 0x5a9438,
    speckTileModulus: 17,
    flowerColors: [0xff6b9d, 0xffb347, 0xf8f4ff, 0xc77dff, 0x7ec8e3],
    flowerTileModulus: 18,
    longGrassTileModulus: 40,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-400 via-lime-200 to-[#6faa42]',
  },
  jungle: {
    kind: 'jungle',
    displayName: 'Jungle',
    temperature: 0.78,
    altitudeFactor: 0.1,
    tileFillColor: 0x2f7a33,
    blockAccentColor: 0x4a3826,
    blockHighlightColor: 0x3f9040,
    speckColor: 0x24602a,
    speckTileModulus: 9,
    flowerColors: [0xff6b9d, 0xffb347, 0xc77dff, 0xffffff, 0xffd966],
    flowerTileModulus: 100,
    longGrassTileModulus: 54,
    skyBackdropClassName:
      'bg-gradient-to-b from-emerald-500 via-lime-200 to-[#2f7a33]',
  },
  desert: {
    kind: 'desert',
    displayName: 'Desert',
    temperature: 0.92,
    altitudeFactor: 0.3,
    tileFillColor: 0xdbc083,
    blockAccentColor: 0xb8956a,
    blockHighlightColor: 0xe8cf98,
    speckColor: 0xc9a96e,
    speckTileModulus: 15,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-300 via-amber-100 to-[#dbc083]',
  },
  snowy_plains: {
    kind: 'snowy_plains',
    displayName: 'Snowy Plains',
    temperature: 0.15,
    altitudeFactor: 0.75,
    tileFillColor: 0xe8f0f4,
    blockAccentColor: null,
    blockHighlightColor: 0xf8fcff,
    speckColor: 0xffffff,
    speckTileModulus: 9,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-slate-300 via-slate-100 to-[#e8f0f4]',
  },
  swamp: {
    kind: 'swamp',
    displayName: 'Swamp',
    temperature: 0.38,
    altitudeFactor: 0.08,
    tileFillColor: 0x3c4a2c,
    blockAccentColor: 0x2c3a20,
    blockHighlightColor: 0x49583a,
    speckColor: 0x2c3a26,
    speckTileModulus: 11,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: 70,
    skyBackdropClassName:
      'bg-gradient-to-b from-slate-500 via-emerald-100 to-[#3c4a2c]',
  },
  savanna: {
    kind: 'savanna',
    displayName: 'Savanna',
    temperature: 0.72,
    altitudeFactor: 0.22,
    tileFillColor: 0xbfb755,
    blockAccentColor: 0x9a6b38,
    blockHighlightColor: 0xcfc265,
    speckColor: 0xa89a45,
    speckTileModulus: 14,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: 36,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-400 via-yellow-100 to-[#bfb755]',
  },
  badlands: {
    kind: 'badlands',
    displayName: 'Badlands',
    temperature: 0.85,
    altitudeFactor: 0.55,
    tileFillColor: 0xbf6b4a,
    blockAccentColor: 0x8f4530,
    blockHighlightColor: 0xcc7858,
    speckColor: 0xa85a3d,
    speckTileModulus: 12,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-orange-300 via-amber-200 to-[#bf6b4a]',
  },
  beach: {
    kind: 'beach',
    displayName: 'Sandy',
    temperature: 0.58,
    altitudeFactor: 0.04,
    tileFillColor: 0xf2e9a7,
    blockAccentColor: 0xd4c47a,
    blockHighlightColor: 0xfaf3c0,
    speckColor: 0xe6d88a,
    speckTileModulus: 16,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-400 via-cyan-100 to-[#f2e9a7]',
  },
  ocean: {
    kind: 'ocean',
    displayName: 'Ocean',
    temperature: 0.55,
    altitudeFactor: 0.02,
    tileFillColor: 0x0a2840,
    blockAccentColor: null,
    blockHighlightColor: null,
    speckColor: null,
    speckTileModulus: null,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-sky-500 via-blue-300 to-blue-600',
  },
  rocky: {
    kind: 'rocky',
    displayName: 'Rocky',
    temperature: 0.48,
    altitudeFactor: 0,
    tileFillColor: 0xa8adb5,
    blockAccentColor: 0x707784,
    blockHighlightColor: 0xcaced6,
    speckColor: 0x5f6672,
    speckTileModulus: 8,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-slate-400 via-slate-200 to-[#a8adb5]',
  },
  firelands: {
    kind: 'firelands',
    displayName: 'Firelands',
    temperature: 0.95,
    altitudeFactor: 0.42,
    tileFillColor: 0x3a2420,
    blockAccentColor: 0x5a3028,
    blockHighlightColor: 0x6a3a30,
    speckColor: 0xff6a2e,
    speckTileModulus: 11,
    flowerColors: null,
    flowerTileModulus: null,
    longGrassTileModulus: null,
    skyBackdropClassName:
      'bg-gradient-to-b from-red-950 via-orange-900 to-[#3a2420]',
  },
};
