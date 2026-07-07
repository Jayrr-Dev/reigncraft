import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import { resolvingWildlifeSizeScaleMultiplierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';
import { describe, expect, it } from 'vitest';

function buildingWildlifeSpawnAnchor(
  tileX: number,
  tileY: number,
  packIndex = 0
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:cow:${tileX}:${tileY}:${packIndex}`,
    tileX,
    tileY,
    speciesId: 'cow',
    packIndex,
    packSize: 1,
    seed: packIndex * 0.13,
  };
}

describe('resolvingWildlifeSizeBellCurveSampleFromAnchor', () => {
  it('returns a stable standard-normal sample per anchor', () => {
    const anchor = buildingWildlifeSpawnAnchor(12, 34, 2);
    const first = resolvingWildlifeSizeBellCurveSampleFromAnchor(anchor);
    const second = resolvingWildlifeSizeBellCurveSampleFromAnchor(anchor);

    expect(first).toBe(second);
    expect(Number.isFinite(first)).toBe(true);
  });
});

describe('resolvingWildlifeSizeScaleMultiplierFromSample', () => {
  it('maps 0σ to the base multiplier', () => {
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(0)).toBe(1);
  });

  it('scales linearly with positive and negative samples', () => {
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(1)).toBeCloseTo(1.08);
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(-1)).toBeCloseTo(
      0.92
    );
  });

  it('clamps extreme samples', () => {
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(10)).toBe(1.35);
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(-10)).toBe(0.75);
  });
});
