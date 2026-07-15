/**
 * Seeded berry-shrub placement and visual facing resolution.
 *
 * @module shared/worldShrubPlacement
 */

import { gettingWorldGenerationSeed } from './worldGenerationSeed';

/** Canonical species slug for decorative berry shrubs. */
export const WORLD_SHRUB_SPECIES_ID = 'shrub' as const;

/** Mixes the session world seed into the shrub placement hash. */
const WORLD_SHRUB_WORLD_SEED_MIX = 2246822519;

export type WorldShrubSpeciesId = typeof WORLD_SHRUB_SPECIES_ID;

export type WorldShrubFacing = 'n' | 's' | 'e' | 'w';

export type WorldShrubPickVisualState = 'unpicked' | 'picked';

/** Seed salt for placement density (distinct from facing salt). */
export const WORLD_SHRUB_PLACEMENT_SEED_SALT = 1403;

/** Seed salt for facing roll. */
export const WORLD_SHRUB_FACING_SEED_SALT = 1404;

/** Seed salt for bunch shape membership. */
export const WORLD_SHRUB_BUNCH_SHAPE_SEED_SALT = 1405;

/** Seed salt for rare grass-companion rolls on shrub bunches. */
export const WORLD_SHRUB_TALL_GRASS_COMPANION_SEED_SALT = 1406;

/** Seed salt for grass-companion patch shape. */
export const WORLD_SHRUB_TALL_GRASS_COMPANION_SHAPE_SEED_SALT = 1407;

/** Minimum shrubs in one bunch (rare lone shrub on the left tail). */
export const WORLD_SHRUB_BUNCH_MIN_TILE_COUNT = 1;

/** Maximum shrubs in one bunch (rare large clump on the right tail). */
export const WORLD_SHRUB_BUNCH_MAX_TILE_COUNT = 5;

/**
 * Bell-curve weights for bunch size. Index 0 = size 1 … index 4 = size 5.
 * Peak at size 3.
 */
export const WORLD_SHRUB_BUNCH_SIZE_WEIGHTS: readonly number[] = [
  1, 3, 6, 3, 1,
];

export const WORLD_SHRUB_BUNCH_SIZE_TOTAL_WEIGHT =
  WORLD_SHRUB_BUNCH_SIZE_WEIGHTS.reduce((sum, weight) => sum + weight, 0);

/** Minimum grass tiles nestled with a rare berry bunch. */
export const WORLD_SHRUB_TALL_GRASS_COMPANION_MIN_TILE_COUNT = 3;

/** Maximum grass tiles nestled with a rare berry bunch. */
export const WORLD_SHRUB_TALL_GRASS_COMPANION_MAX_TILE_COUNT = 5;

/** One in this many shrub bunches also grows a grass thicket. */
export const WORLD_SHRUB_TALL_GRASS_COMPANION_MODULUS = 5;

/** Candidate offsets grown from a bunch anchor (anchor tile always included). */
const WORLD_SHRUB_BUNCH_CANDIDATE_OFFSETS: readonly (readonly [
  number,
  number,
])[] = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

const WORLD_SHRUB_FACING_ORDER: readonly WorldShrubFacing[] = [
  'n',
  's',
  'e',
  'w',
];

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldShrubUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_SHRUB_PLACEMENT_SEED_SALT
): number {
  const seed =
    tileX * 374761393 +
    tileY * 668265263 +
    salt * 1274126177 +
    gettingWorldGenerationSeed() * WORLD_SHRUB_WORLD_SEED_MIX;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * Anchor grid step for shrub bunch placement.
 */
export function resolvingWorldShrubBunchAnchorStep(): number {
  return 6;
}

/**
 * Density gate for bunch anchors. Bunches remain rarer than legacy single shrubs.
 */
export function resolvingWorldShrubBunchAnchorDensityModulus(
  shrubTileModulus: number
): number {
  return Math.max(5, Math.floor(shrubTileModulus / 8));
}

/**
 * Resolves the seeded bunch anchor for any tile coordinate.
 */
export function resolvingWorldShrubBunchAnchorAtTileIndex(
  tileX: number,
  tileY: number
): { readonly anchorX: number; readonly anchorY: number } {
  const anchorStep = resolvingWorldShrubBunchAnchorStep();

  return {
    anchorX:
      Math.floor(tileX / anchorStep) * anchorStep + Math.floor(anchorStep / 2),
    anchorY:
      Math.floor(tileY / anchorStep) * anchorStep + Math.floor(anchorStep / 2),
  };
}

/**
 * True when one shrub bunch anchor passes its biome density gate.
 */
export function checkingWorldShrubBunchAnchorSpawnsAtTileIndex(
  anchorX: number,
  anchorY: number,
  shrubTileModulus: number
): boolean {
  if (shrubTileModulus <= 0) {
    return false;
  }

  const anchorDensityModulus =
    resolvingWorldShrubBunchAnchorDensityModulus(shrubTileModulus);
  const unit = seedingWorldShrubUnitFromTileIndex(anchorX, anchorY);
  const scrambled = unit * 9967 + anchorX * 0.019 + anchorY * 0.029;
  const normalized = scrambled - Math.floor(scrambled);

  return Math.floor(normalized * anchorDensityModulus) === 0;
}

/**
 * Resolves shrub bunch size from a seeded unit float (bell curve, peak at 3).
 */
export function resolvingWorldShrubBunchSizeFromUnit(unitFloat: number): number {
  const target = unitFloat * WORLD_SHRUB_BUNCH_SIZE_TOTAL_WEIGHT;
  let cumulative = 0;

  for (
    let sizeIndex = 0;
    sizeIndex < WORLD_SHRUB_BUNCH_SIZE_WEIGHTS.length;
    sizeIndex += 1
  ) {
    cumulative += WORLD_SHRUB_BUNCH_SIZE_WEIGHTS[sizeIndex] ?? 0;

    if (target < cumulative) {
      return WORLD_SHRUB_BUNCH_MIN_TILE_COUNT + sizeIndex;
    }
  }

  return WORLD_SHRUB_BUNCH_MAX_TILE_COUNT;
}

function formattingWorldShrubAnchorCacheKey(
  anchorX: number,
  anchorY: number
): string {
  return `${anchorX},${anchorY}`;
}

/** Memoized bunch shapes keyed by anchor (deterministic; safe for session life). */
const WORLD_SHRUB_BUNCH_MEMBER_OFFSETS_CACHE = new Map<
  string,
  readonly (readonly [number, number])[]
>();

/**
 * Lists world tile offsets for one seeded shrub bunch (size 1 to 5, peak at 3).
 */
export function listingWorldShrubBunchMemberOffsets(
  anchorX: number,
  anchorY: number
): readonly (readonly [number, number])[] {
  const cacheKey = formattingWorldShrubAnchorCacheKey(anchorX, anchorY);
  const cachedOffsets = WORLD_SHRUB_BUNCH_MEMBER_OFFSETS_CACHE.get(cacheKey);

  if (cachedOffsets) {
    return cachedOffsets;
  }

  const unit = seedingWorldShrubUnitFromTileIndex(
    anchorX,
    anchorY,
    WORLD_SHRUB_BUNCH_SHAPE_SEED_SALT
  );
  const bunchSize = resolvingWorldShrubBunchSizeFromUnit(unit);
  const rankedOffsets = [...WORLD_SHRUB_BUNCH_CANDIDATE_OFFSETS].sort(
    (offsetA, offsetB) => {
      const seedA = seedingWorldShrubUnitFromTileIndex(
        anchorX + offsetA[0],
        anchorY + offsetA[1],
        WORLD_SHRUB_BUNCH_SHAPE_SEED_SALT + 1
      );
      const seedB = seedingWorldShrubUnitFromTileIndex(
        anchorX + offsetB[0],
        anchorY + offsetB[1],
        WORLD_SHRUB_BUNCH_SHAPE_SEED_SALT + 1
      );

      return seedA - seedB;
    }
  );
  const anchorOffset = rankedOffsets.find(
    ([offsetX, offsetY]) => offsetX === 0 && offsetY === 0
  ) ?? [0, 0];
  const otherOffsets = rankedOffsets.filter(
    ([offsetX, offsetY]) => offsetX !== 0 || offsetY !== 0
  );
  const offsets = [anchorOffset, ...otherOffsets].slice(0, bunchSize);

  WORLD_SHRUB_BUNCH_MEMBER_OFFSETS_CACHE.set(cacheKey, offsets);

  return offsets;
}

/**
 * True when a tile belongs to a seeded shrub bunch.
 */
export function checkingWorldShrubPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  shrubTileModulus: number
): boolean {
  if (shrubTileModulus <= 0) {
    return false;
  }

  const { anchorX, anchorY } = resolvingWorldShrubBunchAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (
    !checkingWorldShrubBunchAnchorSpawnsAtTileIndex(
      anchorX,
      anchorY,
      shrubTileModulus
    )
  ) {
    return false;
  }

  return listingWorldShrubBunchMemberOffsets(anchorX, anchorY).some(
    ([offsetX, offsetY]) =>
      anchorX + offsetX === tileX && anchorY + offsetY === tileY
  );
}

/**
 * True when a shrub bunch receives a rare nestled grass thicket.
 */
export function checkingWorldShrubBunchHasTallGrassCompanion(
  anchorX: number,
  anchorY: number
): boolean {
  const unit = seedingWorldShrubUnitFromTileIndex(
    anchorX,
    anchorY,
    WORLD_SHRUB_TALL_GRASS_COMPANION_SEED_SALT
  );

  return unit < 1 / WORLD_SHRUB_TALL_GRASS_COMPANION_MODULUS;
}

/** Memoized companion thicket shapes keyed by shrub bunch anchor. */
const WORLD_SHRUB_TALL_GRASS_COMPANION_OFFSETS_CACHE = new Map<
  string,
  readonly (readonly [number, number])[]
>();

/**
 * Lists grass offsets for one rare berry-bunch companion thicket.
 */
export function listingWorldShrubTallGrassCompanionOffsets(
  anchorX: number,
  anchorY: number
): readonly (readonly [number, number])[] {
  const cacheKey = formattingWorldShrubAnchorCacheKey(anchorX, anchorY);
  const cachedOffsets =
    WORLD_SHRUB_TALL_GRASS_COMPANION_OFFSETS_CACHE.get(cacheKey);

  if (cachedOffsets) {
    return cachedOffsets;
  }

  const unit = seedingWorldShrubUnitFromTileIndex(
    anchorX,
    anchorY,
    WORLD_SHRUB_TALL_GRASS_COMPANION_SHAPE_SEED_SALT
  );
  const patchSize =
    WORLD_SHRUB_TALL_GRASS_COMPANION_MIN_TILE_COUNT +
    Math.floor(
      unit *
        (WORLD_SHRUB_TALL_GRASS_COMPANION_MAX_TILE_COUNT -
          WORLD_SHRUB_TALL_GRASS_COMPANION_MIN_TILE_COUNT +
          1)
    );
  const rankedOffsets = [...WORLD_SHRUB_BUNCH_CANDIDATE_OFFSETS].sort(
    (offsetA, offsetB) => {
      const seedA = seedingWorldShrubUnitFromTileIndex(
        anchorX + offsetA[0],
        anchorY + offsetA[1],
        WORLD_SHRUB_TALL_GRASS_COMPANION_SHAPE_SEED_SALT + 1
      );
      const seedB = seedingWorldShrubUnitFromTileIndex(
        anchorX + offsetB[0],
        anchorY + offsetB[1],
        WORLD_SHRUB_TALL_GRASS_COMPANION_SHAPE_SEED_SALT + 1
      );

      return seedA - seedB;
    }
  );
  const offsets = rankedOffsets.slice(0, patchSize);

  WORLD_SHRUB_TALL_GRASS_COMPANION_OFFSETS_CACHE.set(cacheKey, offsets);

  return offsets;
}

/**
 * True when a tile belongs to a rare grass thicket nestled with a berry bunch.
 */
export function checkingWorldShrubTallGrassCompanionAtTileIndex(
  tileX: number,
  tileY: number,
  shrubTileModulus: number
): boolean {
  if (shrubTileModulus <= 0) {
    return false;
  }

  const { anchorX, anchorY } = resolvingWorldShrubBunchAnchorAtTileIndex(
    tileX,
    tileY
  );

  if (
    !checkingWorldShrubBunchAnchorSpawnsAtTileIndex(
      anchorX,
      anchorY,
      shrubTileModulus
    ) ||
    !checkingWorldShrubBunchHasTallGrassCompanion(anchorX, anchorY)
  ) {
    return false;
  }

  return listingWorldShrubTallGrassCompanionOffsets(anchorX, anchorY).some(
    ([offsetX, offsetY]) =>
      anchorX + offsetX === tileX && anchorY + offsetY === tileY
  );
}

/**
 * Picks grass size for companion tiles: one tall accent, shorter neighbors.
 */
export function resolvingWorldShrubTallGrassCompanionSizeVariantAtTileIndex(
  tileX: number,
  tileY: number
): 'b1' | 'b5' {
  const { anchorX, anchorY } = resolvingWorldShrubBunchAnchorAtTileIndex(
    tileX,
    tileY
  );
  const offsets = listingWorldShrubTallGrassCompanionOffsets(anchorX, anchorY);
  const accentOffset = offsets[0];

  if (
    accentOffset &&
    anchorX + accentOffset[0] === tileX &&
    anchorY + accentOffset[1] === tileY
  ) {
    return 'b5';
  }

  return 'b1';
}

/**
 * Resolves isometric facing from tile seed.
 */
export function resolvingWorldShrubFacingAtTileIndex(
  tileX: number,
  tileY: number
): WorldShrubFacing {
  const unit = seedingWorldShrubUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_SHRUB_FACING_SEED_SALT
  );
  const index = Math.floor(unit * WORLD_SHRUB_FACING_ORDER.length);

  return (
    WORLD_SHRUB_FACING_ORDER[index] ?? WORLD_SHRUB_FACING_ORDER[0] ?? 'n'
  );
}

/**
 * Builds the public sprite URL for one shrub facing and pick state.
 */
export function formattingWorldShrubSpriteUrl(
  facing: WorldShrubFacing,
  isPicked: boolean
): string {
  const visualState: WorldShrubPickVisualState = isPicked
    ? 'picked'
    : 'unpicked';

  return `/environment/sprites/flora/shrub/shrub-${facing}-${visualState}.webp`;
}
