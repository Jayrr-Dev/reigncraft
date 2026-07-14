/**
 * Seeded long-grass placement and visual variant resolution.
 *
 * @module shared/worldLongGrassPlacement
 */

/** Canonical species slug for decorative long grass. */
export const WORLD_LONG_GRASS_SPECIES_ID = 'long-grass' as const;

export type WorldLongGrassSpeciesId = typeof WORLD_LONG_GRASS_SPECIES_ID;

export type WorldLongGrassSizeVariant = 'b1' | 'b5';

export type WorldLongGrassFacing = 'n' | 's' | 'e' | 'w';

/** Seed salt for placement density (distinct from variant salt). */
export const WORLD_LONG_GRASS_PLACEMENT_SEED_SALT = 1207;

/** Seed salt for size + facing variant roll. */
export const WORLD_LONG_GRASS_VARIANT_SEED_SALT = 1208;

const WORLD_LONG_GRASS_FACING_ORDER: readonly WorldLongGrassFacing[] = [
  'n',
  's',
  'e',
  'w',
];

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldLongGrassUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_LONG_GRASS_PLACEMENT_SEED_SALT
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * True when a tile passes the long-grass density gate (~1 / modulus of tiles).
 */
export function checkingWorldLongGrassPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  tileModulus: number
): boolean {
  if (tileModulus <= 0) {
    return false;
  }

  const unit = seedingWorldLongGrassUnitFromTileIndex(tileX, tileY);
  const scrambled = unit * 9973 + tileX * 0.017 + tileY * 0.031;
  const normalized = scrambled - Math.floor(scrambled);

  return Math.floor(normalized * tileModulus) === 0;
}

/**
 * Resolves bush size variant from tile seed (b1 common, b5 accent).
 */
export function resolvingWorldLongGrassSizeVariantAtTileIndex(
  tileX: number,
  tileY: number
): WorldLongGrassSizeVariant {
  const unit = seedingWorldLongGrassUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_LONG_GRASS_VARIANT_SEED_SALT
  );

  return unit < 0.72 ? 'b1' : 'b5';
}

/**
 * Resolves isometric facing from tile seed.
 */
export function resolvingWorldLongGrassFacingAtTileIndex(
  tileX: number,
  tileY: number
): WorldLongGrassFacing {
  const unit = seedingWorldLongGrassUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_LONG_GRASS_VARIANT_SEED_SALT + 1
  );
  const index = Math.floor(unit * WORLD_LONG_GRASS_FACING_ORDER.length);

  return (
    WORLD_LONG_GRASS_FACING_ORDER[index] ??
    WORLD_LONG_GRASS_FACING_ORDER[0] ??
    'n'
  );
}

/**
 * Builds the public sprite URL for one long-grass variant.
 */
export function formattingWorldLongGrassSpriteUrl(
  sizeVariant: WorldLongGrassSizeVariant,
  facing: WorldLongGrassFacing
): string {
  return `/environment/sprites/flora/long-grass/long-grass-${sizeVariant}-${facing}.webp`;
}
