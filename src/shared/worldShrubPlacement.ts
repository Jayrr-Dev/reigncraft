/**
 * Seeded berry-shrub placement and visual facing resolution.
 *
 * @module shared/worldShrubPlacement
 */

/** Canonical species slug for decorative berry shrubs. */
export const WORLD_SHRUB_SPECIES_ID = 'shrub' as const;

export type WorldShrubSpeciesId = typeof WORLD_SHRUB_SPECIES_ID;

export type WorldShrubFacing = 'n' | 's' | 'e' | 'w';

export type WorldShrubPickVisualState = 'unpicked' | 'picked';

/** Seed salt for placement density (distinct from facing salt). */
export const WORLD_SHRUB_PLACEMENT_SEED_SALT = 1403;

/** Seed salt for facing roll. */
export const WORLD_SHRUB_FACING_SEED_SALT = 1404;

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
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * True when a tile passes the shrub density gate (~1 / modulus of tiles).
 *
 * Uses a scrambled unit hash so placement does not form linear stripes.
 */
export function checkingWorldShrubPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  shrubTileModulus: number
): boolean {
  if (shrubTileModulus <= 0) {
    return false;
  }

  const unit = seedingWorldShrubUnitFromTileIndex(tileX, tileY);

  return unit < 1 / shrubTileModulus;
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
