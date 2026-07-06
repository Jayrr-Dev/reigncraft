import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeAggressionBellCurveSampleFromAnchor,
  resolvingWildlifeAggressionLevelFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { describe, expect, it } from 'vitest';

function buildingAnchor(
  tileX: number,
  tileY: number,
  packIndex: number,
  speciesId: string
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:${tileX}:${tileY}:${packIndex}`,
    tileX,
    tileY,
    speciesId,
    packIndex,
    packSize: 2,
    seed: 0.5,
  };
}

function countingAggressionLevelsForSpecies(
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  sampleCount: number
): { tame: number; normal: number; aggressive: number } {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId];
  const counts = { tame: 0, normal: 0, aggressive: 0 };

  for (let index = 0; index < sampleCount; index += 1) {
    const tileX = 12 + (index % 40) * 12;
    const tileY = 24 + Math.floor(index / 40) * 12;
    const level = resolvingWildlifeAggressionLevelFromAnchor(
      buildingAnchor(tileX, tileY, index % 3, speciesId),
      species
    );
    counts[level] += 1;
  }

  return counts;
}

describe('resolvingWildlifeAggressionLevelFromAnchor', () => {
  it('is deterministic for the same anchor and species', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const anchor = buildingAnchor(120, 84, 1, 'grey-wolf');
    const first = resolvingWildlifeAggressionLevelFromAnchor(anchor, species);
    const second = resolvingWildlifeAggressionLevelFromAnchor(anchor, species);

    expect(first).toBe(second);
  });

  it('varies across nearby spawn anchors', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const levels = new Set(
      Array.from({ length: 48 }, (_, index) =>
        resolvingWildlifeAggressionLevelFromAnchor(
          buildingAnchor(120 + index * 12, 240, 0, 'grey-wolf'),
          species
        )
      )
    );

    expect(levels.size).toBeGreaterThan(1);
  });

  it('clusters most wolf rolls toward aggressive tiers', () => {
    const counts = countingAggressionLevelsForSpecies('grey-wolf', 300);
    const total = counts.tame + counts.normal + counts.aggressive;

    expect(counts.aggressive / total).toBeGreaterThan(counts.tame / total);
    expect(counts.aggressive / total).toBeGreaterThan(0.25);
  });

  it('clusters most cow rolls toward tame tiers', () => {
    const counts = countingAggressionLevelsForSpecies('cow', 300);
    const total = counts.tame + counts.normal + counts.aggressive;

    expect(counts.tame / total).toBeGreaterThan(counts.aggressive / total);
    expect(counts.tame / total).toBeGreaterThan(0.35);
  });

  it('makes lions more aggressive than deer on the same tiles', () => {
    const deerSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const lionSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.lion;
    let deerAggressive = 0;
    let lionAggressive = 0;

    for (let tileX = 0; tileX < 240; tileX += 12) {
      for (let tileY = 0; tileY < 240; tileY += 12) {
        const deerLevel = resolvingWildlifeAggressionLevelFromAnchor(
          buildingAnchor(tileX, tileY, 0, 'deer'),
          deerSpecies
        );
        const lionLevel = resolvingWildlifeAggressionLevelFromAnchor(
          buildingAnchor(tileX, tileY, 0, 'lion'),
          lionSpecies
        );

        if (deerLevel === 'aggressive') {
          deerAggressive += 1;
        }

        if (lionLevel === 'aggressive') {
          lionAggressive += 1;
        }
      }
    }

    expect(lionAggressive).toBeGreaterThan(deerAggressive);
  });

  it('samples a bell curve with finite variance', () => {
    const samples = Array.from({ length: 200 }, (_, index) =>
      resolvingWildlifeAggressionBellCurveSampleFromAnchor(
        buildingAnchor(48 + index * 12, 96, 0, 'grey-wolf')
      )
    );
    const mean =
      samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
    const variance =
      samples.reduce((sum, sample) => sum + (sample - mean) ** 2, 0) /
      samples.length;

    expect(Math.abs(mean)).toBeLessThan(0.35);
    expect(variance).toBeGreaterThan(0.2);
    expect(variance).toBeLessThan(2.5);
  });
});
