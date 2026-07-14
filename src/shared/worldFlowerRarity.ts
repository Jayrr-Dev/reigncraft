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

/** Placement hash multipliers (match biome flower dot gate). */
export const WORLD_FLOWER_PLACEMENT_HASH_X = 31;
export const WORLD_FLOWER_PLACEMENT_HASH_Y = 17;

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
  const hash =
    Math.abs(
      tileX * WORLD_FLOWER_PLACEMENT_HASH_X +
        tileY * WORLD_FLOWER_PLACEMENT_HASH_Y +
        salt
    ) % 10_000;
  return hash / 10_000;
}

/**
 * Resolves the flower species for one pickable tile (stable per tile).
 */
export function resolvingWorldFlowerSpeciesAtTileIndex(
  tileX: number,
  tileY: number
): WorldFlowerSpeciesId {
  const unit = seedingWorldFlowerSpeciesUnitFromTileIndex(tileX, tileY);
  const target = unit * WORLD_FLOWER_SPECIES_RARITY_TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of WORLD_FLOWER_SPECIES_RARITY_REGISTRY) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.speciesId;
    }
  }

  const lastEntry =
    WORLD_FLOWER_SPECIES_RARITY_REGISTRY[
      WORLD_FLOWER_SPECIES_RARITY_REGISTRY.length - 1
    ];

  return lastEntry?.speciesId ?? 'yarrow';
}
