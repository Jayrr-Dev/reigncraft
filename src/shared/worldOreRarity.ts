/**
 * Seeded ore species rarity for column-rock veins.
 *
 * Base ladder drives inventory badges. Biome / shore tables live on the client
 * and feed {@link resolvingWorldOreSpeciesFromWeightedEntries}.
 *
 * @module shared/worldOreRarity
 */

/** Canonical ore slug (sprite sheet order left→right, top→bottom). */
export type WorldOreSpeciesId =
  | 'clay'
  | 'iron'
  | 'silver'
  | 'gold'
  | 'copper'
  | 'coal'
  | 'niter'
  | 'scarlet'
  | 'lead'
  | 'sulfur';

/**
 * Ore rarity tiers (subset of inventory rarity ladder).
 * basic → common → uncommon → rare → epic
 */
export type WorldOreSpeciesRarity =
  | 'basic'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic';

export type WorldOreSpeciesRarityEntry = {
  readonly speciesId: WorldOreSpeciesId;
  readonly rarity: WorldOreSpeciesRarity;
  /** Relative spawn weight in the active biome / shore table. */
  readonly weight: number;
};

/** Seed salt for ore vein presence (distinct from species salt). */
export const WORLD_ORE_VEIN_SEED_SALT = 733;

/** Seed salt for ore species roll. */
export const WORLD_ORE_SPECIES_SEED_SALT = 881;

/**
 * Default chance a column-rock anchor carries an ore vein (plain biomes).
 * Biome resolvers may override this.
 */
export const WORLD_ORE_VEIN_CHANCE = 0.28;

/** Player-facing rarity labels for ore species. */
export const WORLD_ORE_SPECIES_RARITY_LABELS: Readonly<
  Record<WorldOreSpeciesRarity, string>
> = {
  basic: 'Basic',
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
};

/**
 * Canonical rarity ladder + default fallback weights (total 199).
 *
 * | Tier     | Ores                      | Weight band |
 * | -------- | ------------------------- | ----------- |
 * | basic    | clay, coal                | 40 / 30     |
 * | common   | iron, copper              | 28 / 22     |
 * | uncommon | lead, niter               | 18 / 16     |
 * | rare     | silver, scarlet           | 12 / 8      |
 * | epic     | gold, sulfur              | 5 / 20      |
 *
 * Sulfur is epic (firelands). Default table is only used when no biome table matches.
 */
export const WORLD_ORE_SPECIES_RARITY_REGISTRY: readonly WorldOreSpeciesRarityEntry[] =
  [
    { speciesId: 'clay', rarity: 'basic', weight: 40 },
    { speciesId: 'coal', rarity: 'basic', weight: 30 },
    { speciesId: 'iron', rarity: 'common', weight: 28 },
    { speciesId: 'copper', rarity: 'common', weight: 22 },
    { speciesId: 'lead', rarity: 'uncommon', weight: 18 },
    { speciesId: 'niter', rarity: 'uncommon', weight: 16 },
    { speciesId: 'silver', rarity: 'rare', weight: 12 },
    { speciesId: 'scarlet', rarity: 'rare', weight: 8 },
    { speciesId: 'gold', rarity: 'epic', weight: 5 },
    { speciesId: 'sulfur', rarity: 'epic', weight: 20 },
  ];

export const WORLD_ORE_SPECIES_RARITY_TOTAL_WEIGHT =
  WORLD_ORE_SPECIES_RARITY_REGISTRY.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

const WORLD_ORE_SPECIES_RARITY_BY_SPECIES_ID = new Map<
  WorldOreSpeciesId,
  WorldOreSpeciesRarityEntry
>(WORLD_ORE_SPECIES_RARITY_REGISTRY.map((entry) => [entry.speciesId, entry]));

/**
 * Resolves the rarity entry for one ore species.
 */
export function resolvingWorldOreSpeciesRarityEntry(
  speciesId: WorldOreSpeciesId
): WorldOreSpeciesRarityEntry {
  return (
    WORLD_ORE_SPECIES_RARITY_BY_SPECIES_ID.get(speciesId) ?? {
      speciesId: 'clay',
      rarity: 'basic',
      weight: 40,
    }
  );
}

/**
 * Resolves the rarity tier for one ore species.
 */
export function resolvingWorldOreSpeciesRarity(
  speciesId: WorldOreSpeciesId
): WorldOreSpeciesRarity {
  return resolvingWorldOreSpeciesRarityEntry(speciesId).rarity;
}

/**
 * Deterministic unit float in [0, 1) from tile coordinates and salt.
 */
export function seedingWorldOreSpeciesUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}

/**
 * True when a column-rock anchor rolls as an ore vein.
 */
export function checkingWorldOreVeinAtTileIndex(
  tileX: number,
  tileY: number,
  veinChance: number = WORLD_ORE_VEIN_CHANCE
): boolean {
  if (veinChance <= 0) {
    return false;
  }

  if (veinChance >= 1) {
    return true;
  }

  const unit = seedingWorldOreSpeciesUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_ORE_VEIN_SEED_SALT
  );

  return unit < veinChance;
}

/**
 * Picks one ore species from an explicit weighted table (stable per tile).
 */
export function resolvingWorldOreSpeciesFromWeightedEntries(
  tileX: number,
  tileY: number,
  entries: readonly WorldOreSpeciesRarityEntry[],
  discoveryLuckMultiplier: number = 1
): WorldOreSpeciesId {
  if (entries.length === 0) {
    return 'clay';
  }

  const adjustedEntries =
    discoveryLuckMultiplier <= 1
      ? entries
      : entries.map((entry) => ({
          ...entry,
          weight:
            entry.rarity === 'rare' || entry.rarity === 'epic'
              ? entry.weight * discoveryLuckMultiplier
              : entry.weight,
        }));
  const totalWeight = adjustedEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  if (totalWeight <= 0) {
    return adjustedEntries[0]?.speciesId ?? 'clay';
  }

  const unit = seedingWorldOreSpeciesUnitFromTileIndex(
    tileX,
    tileY,
    WORLD_ORE_SPECIES_SEED_SALT
  );
  const target = unit * totalWeight;
  let cumulative = 0;

  for (const entry of adjustedEntries) {
    cumulative += entry.weight;

    if (target < cumulative) {
      return entry.speciesId;
    }
  }

  return adjustedEntries[adjustedEntries.length - 1]?.speciesId ?? 'clay';
}

/**
 * Resolves the ore species for one vein-bearing anchor using the default table.
 */
export function resolvingWorldOreSpeciesAtTileIndex(
  tileX: number,
  tileY: number
): WorldOreSpeciesId {
  return resolvingWorldOreSpeciesFromWeightedEntries(
    tileX,
    tileY,
    WORLD_ORE_SPECIES_RARITY_REGISTRY
  );
}

/**
 * Resolves ore species when the vein gate passes; otherwise null (plain stone).
 */
export function resolvingWorldOreSpeciesIfVeinAtTileIndex(
  tileX: number,
  tileY: number
): WorldOreSpeciesId | null {
  if (!checkingWorldOreVeinAtTileIndex(tileX, tileY)) {
    return null;
  }

  return resolvingWorldOreSpeciesAtTileIndex(tileX, tileY);
}
