/**
 * Single place to tune wildlife spawn density, predator mix, and combat danger.
 *
 * Biome spawn tables still define what can appear where; these levers bias how
 * often and how hard without editing every biome row.
 *
 * @module components/world/wildlife/domains/definingWildlifeDifficultyLevers
 */

export type DefiningWildlifeSpawnDifficultyRole = 'prey' | 'predator';

export type DefiningWildlifeDifficultyLevers = {
  /** Spawn anchors only on a grid every N tiles. Higher = sparser wildlife. */
  spawnSpacingModulus: number;
  /** Added to every biome densityThreshold. Higher = rarer spawn patches. */
  densityThresholdBias: number;
  /** Multiplier on rolled pack size range min/max. */
  packSizeMultiplier: number;
  /** Relative spawn weight multipliers by prey vs predator role. */
  spawnWeightByRole: Record<DefiningWildlifeSpawnDifficultyRole, number>;
  /** When false, species with temperament `predator` never spawn. */
  allowPredatorSpawns: boolean;
  /** When false, species with temperament `ambusher` never spawn. */
  allowAmbusherSpawns: boolean;
  /** When false, species with temperament `stalker` never spawn. */
  allowStalkerSpawns: boolean;
  /** Global multiplier on species base health and attack at registry build. */
  healthAndAttackPowerScale: number;
  /** Multiplier on per-species on-sight aggro radius at runtime. */
  aggroRadiusMultiplier: number;
  /** Multiplier on hunt notice radius and favorite-prey sight radius. */
  preyHuntRadiusMultiplier: number;
};

/** Defaults match pre-lever behavior. Edit here to rebalance wildlife danger. */
export const DEFINING_WILDLIFE_DIFFICULTY_LEVERS: DefiningWildlifeDifficultyLevers =
  {
    spawnSpacingModulus: 17,
    densityThresholdBias: 0,
    packSizeMultiplier: 1,
    spawnWeightByRole: {
      prey: 1,
      predator: 1,
    },
    allowPredatorSpawns: true,
    allowAmbusherSpawns: true,
    allowStalkerSpawns: true,
    healthAndAttackPowerScale: 10,
    aggroRadiusMultiplier: 1,
    preyHuntRadiusMultiplier: 1,
  };
