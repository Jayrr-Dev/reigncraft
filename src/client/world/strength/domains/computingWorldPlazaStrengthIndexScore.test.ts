import { computingWorldPlazaStrengthIndexScore } from '@/components/world/strength/domains/computingWorldPlazaStrengthIndexScore';
import {
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX,
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE,
  type DefiningWorldPlazaStrengthProfile,
} from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import { resolvingWorldPlazaStrengthIndexTier } from '@/components/world/strength/domains/resolvingWorldPlazaStrengthIndexTier';
import { describe, expect, it } from 'vitest';

function buildingBaselineProfile(
  overrides: Partial<DefiningWorldPlazaStrengthProfile> = {}
): DefiningWorldPlazaStrengthProfile {
  return {
    subjectId: 'test-subject',
    subjectKind: 'player-character',
    displayName: 'Test Subject',
    maxHealth: DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.maxHealth,
    healthRegenPerSecond:
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.healthRegenPerSecond,
    defense: DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.defense,
    attackPower: DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.attackPower,
    attacksPerSecond:
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.attacksPerSecond,
    walkSpeedGridPerSecond: 2,
    runSpeedGridPerSecond:
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.runSpeedGridPerSecond,
    modifiers: [],
    ...overrides,
  };
}

describe('computingWorldPlazaStrengthIndexScore', () => {
  it('scores the baseline reference profile at exactly the baseline index', () => {
    const result = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile()
    );

    expect(result.strengthIndex).toBe(
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX
    );
  });

  it('increases with health, attack, defense, and run speed', () => {
    const baseline = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile()
    ).strengthIndex;

    const bumps: Partial<DefiningWorldPlazaStrengthProfile>[] = [
      { maxHealth: 2000 },
      { attackPower: 200 },
      { defense: 30 },
      { runSpeedGridPerSecond: 4.5 },
      { attacksPerSecond: 2 },
    ];

    for (const bump of bumps) {
      const bumped = computingWorldPlazaStrengthIndexScore(
        buildingBaselineProfile(bump)
      ).strengthIndex;

      expect(bumped).toBeGreaterThan(baseline);
    }
  });

  it('applies scoped modifiers multiplicatively', () => {
    const doubledOffense = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile({
        modifiers: [
          {
            id: 'test-offense',
            label: 'Test Offense',
            scope: 'offense',
            multiplier: 4,
          },
        ],
      })
    );

    // Geometric mean: quadrupling offense doubles the index.
    expect(doubledOffense.strengthIndex).toBe(
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX * 2
    );

    const halvedTotal = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile({
        modifiers: [
          {
            id: 'test-total',
            label: 'Test Total',
            scope: 'total',
            multiplier: 0.5,
          },
        ],
      })
    );

    expect(halvedTotal.strengthIndex).toBe(
      DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_INDEX / 2
    );
  });

  it('clamps the mobility factor for extreme speeds', () => {
    const crawler = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile({ runSpeedGridPerSecond: 0 })
    );
    const rocket = computingWorldPlazaStrengthIndexScore(
      buildingBaselineProfile({ runSpeedGridPerSecond: 100 })
    );

    expect(crawler.breakdown.mobilityFactor).toBeGreaterThanOrEqual(0.7);
    expect(rocket.breakdown.mobilityFactor).toBeLessThanOrEqual(1.5);
  });
});

describe('resolvingWorldPlazaStrengthIndexTier', () => {
  it('maps scores onto ascending tier bands', () => {
    expect(resolvingWorldPlazaStrengthIndexTier(0).tierId).toBe('harmless');
    expect(resolvingWorldPlazaStrengthIndexTier(100).tierId).toBe('average');
    expect(resolvingWorldPlazaStrengthIndexTier(9999).tierId).toBe('apex');
  });

  it('treats tier thresholds as inclusive lower bounds', () => {
    expect(resolvingWorldPlazaStrengthIndexTier(130).tierId).toBe('strong');
    expect(resolvingWorldPlazaStrengthIndexTier(129).tierId).toBe('average');
  });
});
