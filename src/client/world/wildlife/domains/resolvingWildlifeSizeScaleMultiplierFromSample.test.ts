import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import {
  computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier,
  resolvingWildlifeSizeScaleMultiplierFromSample,
} from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';
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
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(1)).toBeCloseTo(1.16);
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(-1)).toBeCloseTo(
      0.84
    );
  });

  it('clamps extreme visual samples', () => {
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(10)).toBe(1.9);
    expect(resolvingWildlifeSizeScaleMultiplierFromSample(-10)).toBe(0.42);
  });
});

describe('computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier', () => {
  it('squares visual size so runts are weak and bruisers are strong', () => {
    expect(
      computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(0.42)
    ).toBeCloseTo(0.1764);
    expect(
      computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(1.9)
    ).toBeCloseTo(3.61);
    expect(
      computingWildlifeSizeCombatStatMultiplierFromVisualMultiplier(1)
    ).toBe(1);
  });
});
