/**
 * Seeded flower species rarity for biome flower picks.
 *
 * @module shared/worldFlowerRarity
 */

/** Canonical species slug (sprite sheet order left→right, top→bottom). */
export type WorldFlowerSpeciesId =
  | 'yarrow'
  | 'calendula'
  | 'chamomile'
  | 'lavender'
  | 'echinacea'
  | 'peppermint'
  | 'rose'
  | 'meadowsweet'
  | 'arnica'
  | 'valerian'
  | 'foxglove'
  | 'belladonna';

export type WorldFlowerSpeciesRarityEntry = {
  readonly speciesId: WorldFlowerSpeciesId;
  readonly weight: number;
};

/** Seed salt for species roll (distinct from biome petal color salt). */
export const WORLD_FLOWER_SPECIES_SEED_SALT = 419;

/** Seed salt for flower placement density (distinct from species salt). */
export const WORLD_FLOWER_PLACEMENT_SEED_SALT = 911;

/**
 * Weighted species table (total weight 234).
 * Very common 40×3, common 22×3, uncommon 12×3, rare 5×2, very rare 2×1.
 */
export const WORLD_FLOWER_SPECIES_RARITY_REGISTRY: readonly WorldFlowerSpeciesRarityEntry[] =
  [
    { speciesId: 'yarrow', weight: 40 },
    { speciesId: 'chamomile', weight: 40 },
    { speciesId: 'calendula', weight: 40 },
    { speciesId: 'lavender', weight: 22 },
    { speciesId: 'peppermint', weight: 22 },
    { speciesId: 'rose', weight: 22 },
    { speciesId: 'meadowsweet', weight: 12 },
    { speciesId: 'arnica', weight: 12 },
    { speciesId: 'echinacea', weight: 12 },
    { speciesId: 'valerian', weight: 5 },
    { speciesId: 'foxglove', weight: 5 },
    { speciesId: 'belladonna', weight: 2 },
  ];

export const WORLD_FLOWER_SPECIES_RARITY_TOTAL_WEIGHT =
  WORLD_FLOWER_SPECIES_RARITY_REGISTRY.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldFlowerSpeciesUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number = WORLD_FLOWER_SPECIES_SEED_SALT
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * True when a tile passes the flower density gate (~1 / modulus of tiles).
 *
 * Uses a scrambled unit hash so placement does not form linear stripes
 * (unlike `ax + by % modulus === 0`, which draws diagonal pearl-strings).
 */
export function checkingWorldFlowerPlacementAtTileIndex(
  tileX: number,
  tileY: number,
  flowerTileModulus: number
): boolean {
  if (flowerTileModulus <= 0) {
    return false;
  }

  const unit = seedingWorldFlowerSpeciesUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_FLOWER_PLACEMENT_SEED_SALT
  );

  return unit < 1 / flowerTileModulus;
}

/**
 * Resolves the flower species for one pickable tile (stable per tile).
 */
export function resolvingWorldFlowerSpeciesAtTileIndex(
  tileX: number,
  tileY: number
): WorldFlowerSpeciesId {
  return resolvingWorldFlowerSpeciesFromUnit(
    seedingWorldFlowerSpeciesUnitFromTileIndex(tileX, tileY)
  );
}

/** Flower species weight at or below this value is boosted by discovery luck. */
export const WORLD_FLOWER_SPECIES_RARE_WEIGHT_THRESHOLD = 12;

/**
 * Resolves flower species from a unit float with boosted rare weights.
 */
export function resolvingWorldFlowerSpeciesFromUnitWithDiscoveryLuck(
  unitFloat: number,
  discoveryLuckMultiplier: number
): WorldFlowerSpeciesId {
  if (discoveryLuckMultiplier <= 1) {
    return resolvingWorldFlowerSpeciesFromUnit(unitFloat);
  }

  const adjustedEntries = WORLD_FLOWER_SPECIES_RARITY_REGISTRY.map((entry) => ({
    ...entry,
    weight:
      entry.weight <= WORLD_FLOWER_SPECIES_RARE_WEIGHT_THRESHOLD
        ? entry.weight * discoveryLuckMultiplier
        : entry.weight,
  }));
  const adjustedTotalWeight = adjustedEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );
  const target = unitFloat * adjustedTotalWeight;
  let cumulative = 0;

  for (const entry of adjustedEntries) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.speciesId;
    }
  }

  return adjustedEntries.at(-1)?.speciesId ?? 'yarrow';
}

/**
 * Resolves flower species for one tile with optional discovery luck.
 */
export function resolvingWorldFlowerSpeciesAtTileIndexWithDiscoveryLuck(
  tileX: number,
  tileY: number,
  discoveryLuckMultiplier: number
): WorldFlowerSpeciesId {
  return resolvingWorldFlowerSpeciesFromUnitWithDiscoveryLuck(
    seedingWorldFlowerSpeciesUnitFromTileIndex(tileX, tileY),
    discoveryLuckMultiplier
  );
}

function resolvingWorldFlowerSpeciesFromUnit(
  unitFloat: number
): WorldFlowerSpeciesId {
  const target = unitFloat * WORLD_FLOWER_SPECIES_RARITY_TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of WORLD_FLOWER_SPECIES_RARITY_REGISTRY) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.speciesId;
    }
  }

  return WORLD_FLOWER_SPECIES_RARITY_REGISTRY.at(-1)?.speciesId ?? 'yarrow';
}
