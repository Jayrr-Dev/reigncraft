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

/** Seed salt for bunch shape membership. */
export const WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT = 1210;

/** Minimum tiles per grass bunch (never spawn isolated singles). */
export const WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT = 3;

/** Maximum tiles per grass bunch. */
export const WORLD_LONG_GRASS_BUNCH_MAX_TILE_COUNT = 6;

const WORLD_LONG_GRASS_FACING_ORDER: readonly WorldLongGrassFacing[] = [
  'n',
  's',
  'e',
  'w',
];

/** Candidate offsets grown from a bunch anchor (anchor tile always included). */
const WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS: readonly (readonly [
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
 * Anchor grid step for bunch placement derived from biome density.
 */
export function resolvingWorldLongGrassBunchAnchorStep(
  tileModulus: number
): number {
  return Math.max(5, Math.min(8, Math.floor(tileModulus / 4)));
}

/**
 * Density gate for bunch anchors (more frequent than legacy per-tile modulus).
 */
export function resolvingWorldLongGrassBunchAnchorDensityModulus(
  tileModulus: number
): number {
  return Math.max(4, Math.floor(tileModulus / 4));
}

/**
 * Resolves the seeded bunch anchor for any tile coordinate.
 */
export function resolvingWorldLongGrassBunchAnchorAtTileIndex(
  tileX: number,
  tileY: number,
  tileModulus: number
): { readonly anchorX: number; readonly anchorY: number } {
  const anchorStep = resolvingWorldLongGrassBunchAnchorStep(tileModulus);

  return {
    anchorX:
      Math.floor(tileX / anchorStep) * anchorStep + Math.floor(anchorStep / 2),
    anchorY:
      Math.floor(tileY / anchorStep) * anchorStep + Math.floor(anchorStep / 2),
  };
}

/**
 * True when a bunch anchor passes the density gate (~1 / modulus of anchors).
 */
export function checkingWorldLongGrassBunchAnchorSpawnsAtTileIndex(
  anchorX: number,
  anchorY: number,
  tileModulus: number
): boolean {
  const anchorDensityModulus =
    resolvingWorldLongGrassBunchAnchorDensityModulus(tileModulus);

  if (anchorDensityModulus <= 0) {
    return false;
  }

  const unit = seedingWorldLongGrassUnitFromTileIndex(anchorX, anchorY);
  const scrambled = unit * 9973 + anchorX * 0.017 + anchorY * 0.031;
  const normalized = scrambled - Math.floor(scrambled);

  return Math.floor(normalized * anchorDensityModulus) === 0;
}

/**
 * Lists world tile offsets that belong to one seeded grass bunch.
 */
export function listingWorldLongGrassBunchMemberOffsets(
  anchorX: number,
  anchorY: number
): readonly (readonly [number, number])[] {
  const unit = seedingWorldLongGrassUnitFromTileIndex(
    anchorX,
    anchorY,
    WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT
  );
  const bunchSize =
    WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT +
    Math.floor(
      unit *
        (WORLD_LONG_GRASS_BUNCH_MAX_TILE_COUNT -
          WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT +
          1)
    );

  const rankedOffsets = [...WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS].sort(
    (offsetA, offsetB) => {
      const seedA = seedingWorldLongGrassUnitFromTileIndex(
        anchorX + offsetA[0],
        anchorY + offsetA[1],
        WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT + 1
      );
      const seedB = seedingWorldLongGrassUnitFromTileIndex(
        anchorX + offsetB[0],
        anchorY + offsetB[1],
        WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT + 1
      );

      return seedA - seedB;
    }
  );

  const anchorOffset = rankedOffsets.find(
    ([dx, dy]) => dx === 0 && dy === 0
  ) ?? [0, 0];
  const otherOffsets = rankedOffsets.filter(([dx, dy]) => dx !== 0 || dy !== 0);

  return [anchorOffset, ...otherOffsets].slice(0, bunchSize);
}

/**
 * True when a tile belongs to a seeded long-grass bunch.
 */
export function checkingWorldLongGrassPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  tileModulus: number
): boolean {
  if (tileModulus <= 0) {
    return false;
  }

  const { anchorX, anchorY } = resolvingWorldLongGrassBunchAnchorAtTileIndex(
    tileX,
    tileY,
    tileModulus
  );

  if (
    !checkingWorldLongGrassBunchAnchorSpawnsAtTileIndex(
      anchorX,
      anchorY,
      tileModulus
    )
  ) {
    return false;
  }

  return listingWorldLongGrassBunchMemberOffsets(anchorX, anchorY).some(
    ([offsetX, offsetY]) =>
      anchorX + offsetX === tileX && anchorY + offsetY === tileY
  );
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
