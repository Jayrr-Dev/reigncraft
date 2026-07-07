import { resolvingWildlifeSleepBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingAnchor(
  tileX: number,
  tileY: number,
  packIndex: number
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:${tileX}:${tileY}:${packIndex}`,
    tileX,
    tileY,
    speciesId: 'cow',
    packIndex,
    packSize: 1,
    seed: 1,
  };
}

describe('resolvingWildlifeSleepBellCurveSampleFromAnchor', () => {
  it('returns the same sample for the same anchor', () => {
    const anchor = buildingAnchor(12, 24, 0);
    const firstSample =
      resolvingWildlifeSleepBellCurveSampleFromAnchor(anchor);
    const secondSample =
      resolvingWildlifeSleepBellCurveSampleFromAnchor(anchor);

    expect(firstSample).toBe(secondSample);
  });

  it('samples a bell curve with finite variance', () => {
    const samples = Array.from({ length: 200 }, (_, index) =>
      resolvingWildlifeSleepBellCurveSampleFromAnchor(
        buildingAnchor(48 + index * 12, 96, 0)
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
