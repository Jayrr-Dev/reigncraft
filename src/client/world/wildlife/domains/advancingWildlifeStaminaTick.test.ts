import {
  advancingWildlifeStaminaTick,
  creatingWildlifeInitialStaminaState,
} from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG } from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeInstanceMaxStaminaRatio } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { describe, expect, it } from 'vitest';

describe('advancingWildlifeStaminaTick', () => {
  it('unlocks at 66% after the first full depletion', () => {
    const depleted = advancingWildlifeStaminaTick(
      {
        ...creatingWildlifeInitialStaminaState(),
        staminaRatio: 0.01,
      },
      true,
      1
    );

    expect(depleted.state.isExhausted).toBe(true);
    expect(depleted.state.fatigueTier).toBe('winded');

    const stillWinded = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 0.65,
      },
      true,
      0
    );

    expect(stillWinded.state.isExhausted).toBe(true);

    const recovered = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 0.66,
      },
      true,
      0
    );

    expect(recovered.state.isExhausted).toBe(false);
    expect(recovered.state.fatigueTier).toBe('winded');
  });

  it('unlocks at 33% after the second full depletion', () => {
    const depleted = advancingWildlifeStaminaTick(
      {
        ...creatingWildlifeInitialStaminaState(),
        staminaRatio: 0.01,
        fatigueTier: 'winded',
      },
      true,
      1
    );

    expect(depleted.state.fatigueTier).toBe('drained');

    const stillDrained = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 0.32,
      },
      true,
      0
    );

    expect(stillDrained.state.isExhausted).toBe(true);

    const recovered = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 0.33,
      },
      true,
      0
    );

    expect(recovered.state.isExhausted).toBe(false);
    expect(recovered.state.fatigueTier).toBe('drained');
  });

  it('requires a full 100% heal after the third full depletion', () => {
    const depleted = advancingWildlifeStaminaTick(
      {
        ...creatingWildlifeInitialStaminaState(),
        staminaRatio: 0.01,
        fatigueTier: 'drained',
      },
      true,
      1
    );

    expect(depleted.state.fatigueTier).toBe('spent');
    expect(
      DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG.spent.useUnlockRatio
    ).toBe(1);

    const stillSpent = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 0.99,
      },
      true,
      0
    );

    expect(stillSpent.state.isExhausted).toBe(true);
    expect(stillSpent.state.fatigueTier).toBe('spent');

    const recovered = advancingWildlifeStaminaTick(
      {
        ...depleted.state,
        staminaRatio: 1,
      },
      false,
      0
    );

    expect(recovered.state.isExhausted).toBe(false);
    expect(recovered.state.fatigueTier).toBe('fresh');
  });

  it('resets fatigue to fresh when the bar refills fully', () => {
    const recovered = advancingWildlifeStaminaTick(
      {
        ...creatingWildlifeInitialStaminaState(),
        staminaRatio: 0.99,
        isExhausted: false,
        fatigueTier: 'winded',
      },
      false,
      1
    );

    expect(recovered.state.staminaRatio).toBe(1);
    expect(recovered.state.fatigueTier).toBe('fresh');
    expect(recovered.state.isExhausted).toBe(false);
  });

  it('accumulates runningForSeconds while sprinting and resets when stopped', () => {
    const first = advancingWildlifeStaminaTick(
      creatingWildlifeInitialStaminaState(),
      true,
      0.5
    );

    expect(first.isRunning).toBe(true);
    expect(first.state.runningForSeconds).toBeCloseTo(0.5);

    const second = advancingWildlifeStaminaTick(first.state, true, 0.25);

    expect(second.state.runningForSeconds).toBeCloseTo(0.75);

    const stopped = advancingWildlifeStaminaTick(second.state, false, 0.1);

    expect(stopped.isRunning).toBe(false);
    expect(stopped.state.runningForSeconds).toBe(0);
  });

  it.each([
    ['deer', 1.15],
    ['stag', 1.35],
    ['antilope', 1.5],
    ['oryx', 1.7],
    ['zebra', 1.5],
    ['ostrich', 1.3],
  ] as const)(
    'caps fleet prey (%s) stamina at species maxStaminaRatio %s',
    (speciesId, expectedCap) => {
      const species = resolvingWildlifeSpeciesDefinition(speciesId);
      expect(species).not.toBeNull();
      if (!species) {
        return;
      }
      const cap = resolvingWildlifeInstanceMaxStaminaRatio(
        { largeSizeFrame: null },
        species
      );

      expect(cap).toBe(expectedCap);

      const filled = advancingWildlifeStaminaTick(
        {
          ...creatingWildlifeInitialStaminaState(),
          staminaRatio: expectedCap - 0.01,
        },
        false,
        1,
        species.stamina,
        cap
      );

      expect(filled.state.staminaRatio).toBeLessThanOrEqual(expectedCap);
      expect(filled.state.staminaRatio).toBeGreaterThan(expectedCap - 0.01);
    }
  );
});
