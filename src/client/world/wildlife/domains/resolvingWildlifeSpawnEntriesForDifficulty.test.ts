import { describe, expect, it } from 'vitest';

import type { DefiningWildlifeBiomeSpawnEntry } from '@/components/world/wildlife/domains/definingWildlifeBiomeSpawnTable';
import type { DefiningWildlifeDifficultyLevers } from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';
import {
  resolvingWildlifeDifficultyPackSizeRange,
  resolvingWildlifeSpawnEffectiveDensityThreshold,
  resolvingWildlifeSpawnEntriesForDifficulty,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnEntriesForDifficulty';

const FOREST_ENTRIES: readonly DefiningWildlifeBiomeSpawnEntry[] = [
  { speciesId: 'deer', weight: 6, packSizeRange: [1, 4] },
  { speciesId: 'grey-wolf', weight: 2, packSizeRange: [2, 4] },
  { speciesId: 'brown-bear', weight: 1, packSizeRange: [1, 1] },
];

function buildingTestLevers(
  overrides: Partial<DefiningWildlifeDifficultyLevers> = {}
): DefiningWildlifeDifficultyLevers {
  return {
    spawnSpacingModulus: 12,
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
    ...overrides,
  };
}

describe('resolvingWildlifeSpawnEffectiveDensityThreshold', () => {
  it('adds the global density bias to biome thresholds', () => {
    expect(
      resolvingWildlifeSpawnEffectiveDensityThreshold(
        0.62,
        buildingTestLevers({ densityThresholdBias: 0.05 })
      )
    ).toBeCloseTo(0.67);
  });
});

describe('resolvingWildlifeDifficultyPackSizeRange', () => {
  it('scales pack size range and keeps min at least 1', () => {
    expect(resolvingWildlifeDifficultyPackSizeRange([2, 4], 0.5)).toEqual([
      1, 2,
    ]);
  });
});

describe('resolvingWildlifeSpawnEntriesForDifficulty', () => {
  it('returns unchanged weights with default levers', () => {
    const entries = resolvingWildlifeSpawnEntriesForDifficulty(
      FOREST_ENTRIES,
      buildingTestLevers()
    );

    expect(entries).toEqual(FOREST_ENTRIES);
  });

  it('removes predator temperaments when stalker spawns are disabled', () => {
    const entries = resolvingWildlifeSpawnEntriesForDifficulty(
      FOREST_ENTRIES,
      buildingTestLevers({ allowStalkerSpawns: false })
    );

    expect(entries.map((entry) => entry.speciesId)).toEqual([
      'deer',
      'brown-bear',
    ]);
  });

  it('scales prey and predator spawn weights independently', () => {
    const entries = resolvingWildlifeSpawnEntriesForDifficulty(
      FOREST_ENTRIES,
      buildingTestLevers({
        spawnWeightByRole: {
          prey: 2,
          predator: 0.5,
        },
      })
    );

    expect(entries).toEqual([
      { speciesId: 'deer', weight: 12, packSizeRange: [1, 4] },
      { speciesId: 'grey-wolf', weight: 1, packSizeRange: [2, 4] },
      { speciesId: 'brown-bear', weight: 2, packSizeRange: [1, 1] },
    ]);
  });

  it('returns an empty pool when every predator temperament is disabled', () => {
    const predatorOnlyEntries: readonly DefiningWildlifeBiomeSpawnEntry[] = [
      { speciesId: 'grey-wolf', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'lion', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'crocodile', weight: 5, packSizeRange: [1, 2] },
    ];

    const entries = resolvingWildlifeSpawnEntriesForDifficulty(
      predatorOnlyEntries,
      buildingTestLevers({
        allowPredatorSpawns: false,
        allowAmbusherSpawns: false,
        allowStalkerSpawns: false,
      })
    );

    expect(entries).toEqual([]);
  });
});
