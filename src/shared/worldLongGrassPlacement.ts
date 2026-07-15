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
 * Resolves seeded bunch size for one anchor (inclusive of the anchor tile).
 */
function resolvingWorldLongGrassBunchSizeAtAnchor(
  anchorX: number,
  anchorY: number
): number {
  const unit = seedingWorldLongGrassUnitFromTileIndex(
    anchorX,
    anchorY,
    WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT
  );

  return (
    WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT +
    Math.floor(
      unit *
        (WORLD_LONG_GRASS_BUNCH_MAX_TILE_COUNT -
          WORLD_LONG_GRASS_BUNCH_MIN_TILE_COUNT +
          1)
    )
  );
}

/**
 * Offset shape-seed for one candidate relative to its bunch anchor.
 */
function seedingWorldLongGrassBunchOffsetUnit(
  anchorX: number,
  anchorY: number,
  offsetX: number,
  offsetY: number
): number {
  return seedingWorldLongGrassUnitFromTileIndex(
    anchorX + offsetX,
    anchorY + offsetY,
    WORLD_LONG_GRASS_BUNCH_SHAPE_SEED_SALT + 1
  );
}

/**
 * True when rival offset ranks ahead of target (lower seed, then catalog order).
 */
function checkingWorldLongGrassBunchOffsetRanksAhead(
  anchorX: number,
  anchorY: number,
  rivalOffsetX: number,
  rivalOffsetY: number,
  rivalCatalogIndex: number,
  targetOffsetX: number,
  targetOffsetY: number,
  targetCatalogIndex: number
): boolean {
  const rivalSeed = seedingWorldLongGrassBunchOffsetUnit(
    anchorX,
    anchorY,
    rivalOffsetX,
    rivalOffsetY
  );
  const targetSeed = seedingWorldLongGrassBunchOffsetUnit(
    anchorX,
    anchorY,
    targetOffsetX,
    targetOffsetY
  );

  if (rivalSeed !== targetSeed) {
    return rivalSeed < targetSeed;
  }

  return rivalCatalogIndex < targetCatalogIndex;
}

/**
 * Lists world tile offsets that belong to one seeded grass bunch.
 */
export function listingWorldLongGrassBunchMemberOffsets(
  anchorX: number,
  anchorY: number
): readonly (readonly [number, number])[] {
  const bunchSize = resolvingWorldLongGrassBunchSizeAtAnchor(anchorX, anchorY);
  const rankedEntries: {
    readonly offset: readonly [number, number];
    readonly catalogIndex: number;
  }[] = [];

  for (
    let catalogIndex = 0;
    catalogIndex < WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS.length;
    catalogIndex += 1
  ) {
    const offset = WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS[catalogIndex];

    if (!offset || (offset[0] === 0 && offset[1] === 0)) {
      continue;
    }

    rankedEntries.push({ offset, catalogIndex });
  }

  rankedEntries.sort((entryA, entryB) => {
    if (
      checkingWorldLongGrassBunchOffsetRanksAhead(
        anchorX,
        anchorY,
        entryA.offset[0],
        entryA.offset[1],
        entryA.catalogIndex,
        entryB.offset[0],
        entryB.offset[1],
        entryB.catalogIndex
      )
    ) {
      return -1;
    }

    if (
      checkingWorldLongGrassBunchOffsetRanksAhead(
        anchorX,
        anchorY,
        entryB.offset[0],
        entryB.offset[1],
        entryB.catalogIndex,
        entryA.offset[0],
        entryA.offset[1],
        entryA.catalogIndex
      )
    ) {
      return 1;
    }

    return 0;
  });

  return [[0, 0] as const, ...rankedEntries.map((entry) => entry.offset)].slice(
    0,
    bunchSize
  );
}

/**
 * True when a tile belongs to a seeded long-grass bunch.
 *
 * Hot-path: no per-call array allocation or sort. Anchor tile is always a
 * member when the bunch spawns; other offsets compete for remaining slots.
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

  const offsetX = tileX - anchorX;
  const offsetY = tileY - anchorY;

  if (offsetX === 0 && offsetY === 0) {
    return true;
  }

  let targetCatalogIndex = -1;

  for (
    let catalogIndex = 0;
    catalogIndex < WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS.length;
    catalogIndex += 1
  ) {
    const offset = WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS[catalogIndex];

    if (offset && offset[0] === offsetX && offset[1] === offsetY) {
      targetCatalogIndex = catalogIndex;
      break;
    }
  }

  if (targetCatalogIndex < 0) {
    return false;
  }

  const bunchSize = resolvingWorldLongGrassBunchSizeAtAnchor(anchorX, anchorY);
  const otherSlots = bunchSize - 1;
  let betterNonAnchorCount = 0;

  for (
    let catalogIndex = 0;
    catalogIndex < WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS.length;
    catalogIndex += 1
  ) {
    if (catalogIndex === targetCatalogIndex) {
      continue;
    }

    const offset = WORLD_LONG_GRASS_BUNCH_CANDIDATE_OFFSETS[catalogIndex];

    if (!offset || (offset[0] === 0 && offset[1] === 0)) {
      continue;
    }

    if (
      checkingWorldLongGrassBunchOffsetRanksAhead(
        anchorX,
        anchorY,
        offset[0],
        offset[1],
        catalogIndex,
        offsetX,
        offsetY,
        targetCatalogIndex
      )
    ) {
      betterNonAnchorCount += 1;

      if (betterNonAnchorCount >= otherSlots) {
        return false;
      }
    }
  }

  return true;
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
