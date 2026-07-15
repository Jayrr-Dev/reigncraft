import {
  computingWorldPlazaDistanceDangerBandFromOrigin,
  computingWorldPlazaDistanceDangerCombatScale,
  computingWorldPlazaDistanceFromOriginTiles,
} from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import { resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance } from '@/components/world/domains/resolvingWorldPlazaDistanceDangerBiasedBiomeKind';
import {
  resolvingWildlifeDistanceDangerAggressionMeanShift,
  resolvingWildlifeDistanceDangerDifficultyLevers,
  resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier,
  resolvingWildlifeDistanceDangerSizeMeanShift,
} from '@/components/world/wildlife/domains/resolvingWildlifeDistanceDangerLevers';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaDistanceDangerBandFromOrigin', () => {
  it('stays at band 0 inside the first 1000 tiles', () => {
    expect(computingWorldPlazaDistanceDangerBandFromOrigin(0, 0)).toBe(0);
    expect(computingWorldPlazaDistanceDangerBandFromOrigin(999, 0)).toBe(0);
    expect(computingWorldPlazaDistanceFromOriginTiles(3, 4)).toBe(5);
  });

  it('steps one band every 1000 tiles from origin', () => {
    expect(computingWorldPlazaDistanceDangerBandFromOrigin(1000, 0)).toBe(1);
    expect(computingWorldPlazaDistanceDangerBandFromOrigin(2500, 0)).toBe(2);
    expect(computingWorldPlazaDistanceDangerBandFromOrigin(0, 4000)).toBe(4);
  });
});

describe('computingWorldPlazaDistanceDangerCombatScale', () => {
  it('adds 5% attack and health per band', () => {
    expect(computingWorldPlazaDistanceDangerCombatScale(0)).toBe(1);
    expect(computingWorldPlazaDistanceDangerCombatScale(1)).toBeCloseTo(1.05);
    expect(computingWorldPlazaDistanceDangerCombatScale(3)).toBeCloseTo(1.15);
  });
});

describe('resolvingWildlifeDistanceDangerLevers', () => {
  it('raises predator weight and lowers prey weight with distance', () => {
    const levers = resolvingWildlifeDistanceDangerDifficultyLevers(2);

    expect(levers.spawnWeightByRole.predator).toBeGreaterThan(1);
    expect(levers.spawnWeightByRole.prey).toBeLessThan(1);
  });

  it('thins weak temperaments farther out', () => {
    expect(
      resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier(
        0,
        'docile'
      )
    ).toBe(1);
    expect(
      resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier(
        3,
        'docile'
      )
    ).toBeLessThan(1);
    expect(
      resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier(
        3,
        'skittish'
      )
    ).toBeLessThan(1);
    expect(
      resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier(
        3,
        'predator'
      )
    ).toBe(1);
  });

  it('shifts aggression and size means upward with distance', () => {
    expect(resolvingWildlifeDistanceDangerAggressionMeanShift(0)).toBe(0);
    expect(
      resolvingWildlifeDistanceDangerAggressionMeanShift(2)
    ).toBeGreaterThan(0);
    expect(resolvingWildlifeDistanceDangerSizeMeanShift(2)).toBeGreaterThan(0);
  });
});

describe('resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance', () => {
  it('grows with band and caps far from origin', () => {
    expect(resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance(0)).toBe(0);
    expect(
      resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance(1)
    ).toBeGreaterThan(0);
    expect(
      resolvingWorldPlazaDistanceDangerEasyBiomeSuppressChance(20)
    ).toBeLessThanOrEqual(0.28);
  });
});
