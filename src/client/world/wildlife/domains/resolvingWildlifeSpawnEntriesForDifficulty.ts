/**
 * Applies global wildlife difficulty levers to biome spawn pool entries.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpawnEntriesForDifficulty
 */

import type { DefiningWildlifeBiomeSpawnEntry } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import {
  DEFINING_WILDLIFE_DIFFICULTY_LEVERS,
  type DefiningWildlifeDifficultyLevers,
  type DefiningWildlifeSpawnDifficultyRole,
} from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function gettingWildlifeSpawnDifficultyRole(
  temperamentId: DefiningWildlifeTemperamentId
): DefiningWildlifeSpawnDifficultyRole {
  if (
    temperamentId === 'predator' ||
    temperamentId === 'ambusher' ||
    temperamentId === 'pack_hunter' ||
    temperamentId === 'stalker'
  ) {
    return 'predator';
  }

  return 'prey';
}

function checkingWildlifeTemperamentAllowedForSpawn(
  temperamentId: DefiningWildlifeTemperamentId,
  levers: DefiningWildlifeDifficultyLevers
): boolean {
  if (temperamentId === 'predator' && !levers.allowPredatorSpawns) {
    return false;
  }

  if (temperamentId === 'ambusher' && !levers.allowAmbusherSpawns) {
    return false;
  }

  if (temperamentId === 'pack_hunter' && !levers.allowPackHunterSpawns) {
    return false;
  }

  if (temperamentId === 'stalker' && !levers.allowStalkerSpawns) {
    return false;
  }

  return true;
}

/** Scales a pack size range by the difficulty lever multiplier. */
export function resolvingWildlifeDifficultyPackSizeRange(
  packSizeRange: readonly [number, number],
  packSizeMultiplier: number
): [number, number] {
  if (packSizeMultiplier === 1) {
    return [packSizeRange[0], packSizeRange[1]];
  }

  const minPackSize = Math.max(
    1,
    Math.round(packSizeRange[0] * packSizeMultiplier)
  );
  const maxPackSize = Math.max(
    minPackSize,
    Math.round(packSizeRange[1] * packSizeMultiplier)
  );

  return [minPackSize, maxPackSize];
}

/** Returns biome density threshold plus the global rarity bias. */
export function resolvingWildlifeSpawnEffectiveDensityThreshold(
  densityThreshold: number,
  levers: DefiningWildlifeDifficultyLevers = DEFINING_WILDLIFE_DIFFICULTY_LEVERS
): number {
  return densityThreshold + levers.densityThresholdBias;
}

/**
 * Filters temperament toggles and scales spawn weights and pack sizes.
 * Returns an empty array when every entry is disabled.
 */
export function resolvingWildlifeSpawnEntriesForDifficulty(
  entries: readonly DefiningWildlifeBiomeSpawnEntry[],
  levers: DefiningWildlifeDifficultyLevers = DEFINING_WILDLIFE_DIFFICULTY_LEVERS
): DefiningWildlifeBiomeSpawnEntry[] {
  const scaledEntries: DefiningWildlifeBiomeSpawnEntry[] = [];

  for (const entry of entries) {
    const species = resolvingWildlifeSpeciesDefinition(entry.speciesId);

    if (!species) {
      continue;
    }

    if (
      !checkingWildlifeTemperamentAllowedForSpawn(species.temperamentId, levers)
    ) {
      continue;
    }

    const role = gettingWildlifeSpawnDifficultyRole(species.temperamentId);
    const weight = entry.weight * levers.spawnWeightByRole[role];

    if (weight <= 0) {
      continue;
    }

    scaledEntries.push({
      ...entry,
      weight,
      packSizeRange: resolvingWildlifeDifficultyPackSizeRange(
        entry.packSizeRange,
        levers.packSizeMultiplier
      ),
    });
  }

  return scaledEntries;
}
