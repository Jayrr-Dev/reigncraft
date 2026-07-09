import {
  advancingWildlifeStaminaTick,
  creatingWildlifeInitialStaminaState,
  DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO,
} from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { resolvingWildlifeSpeciesExhaustedExitRatio } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeInstanceMaxStaminaRatio } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { describe, expect, it } from 'vitest';

describe('advancingWildlifeStaminaTick', () => {
  it('keeps other species exhausted until the default recovery threshold', () => {
    const recovered = advancingWildlifeStaminaTick(
      { staminaRatio: 0.4, isExhausted: true, runningForSeconds: 0 },
      true,
      1,
      undefined,
      DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO
    );

    expect(recovered.state.isExhausted).toBe(false);
  });

  it.each(['deer', 'stag', 'antilope', 'oryx', 'zebra', 'ostrich'] as const)(
    'keeps fleet prey (%s) exhausted until stamina recovers to 75%',
    (speciesId) => {
      const exitRatio = resolvingWildlifeSpeciesExhaustedExitRatio(speciesId);

      expect(exitRatio).toBe(0.75);

      const stillWinded = advancingWildlifeStaminaTick(
        { staminaRatio: 0.74, isExhausted: true, runningForSeconds: 0 },
        true,
        0,
        undefined,
        exitRatio
      );

      expect(stillWinded.state.isExhausted).toBe(true);

      const recovered = advancingWildlifeStaminaTick(
        { staminaRatio: 0.75, isExhausted: true, runningForSeconds: 0 },
        true,
        0,
        undefined,
        exitRatio
      );

      expect(recovered.state.isExhausted).toBe(false);
    }
  );

  it('keeps boars exhausted until they fully recover stamina', () => {
    const boarExitRatio = resolvingWildlifeSpeciesExhaustedExitRatio('boar');

    expect(boarExitRatio).toBe(0.98);

    const stillWinded = advancingWildlifeStaminaTick(
      { staminaRatio: 0.5, isExhausted: true, runningForSeconds: 0 },
      true,
      1,
      undefined,
      boarExitRatio
    );

    expect(stillWinded.state.isExhausted).toBe(true);

    const recovered = advancingWildlifeStaminaTick(
      { staminaRatio: 0.99, isExhausted: true, runningForSeconds: 0 },
      true,
      1,
      undefined,
      boarExitRatio
    );

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
          staminaRatio: expectedCap - 0.01,
          isExhausted: false,
          runningForSeconds: 0,
        },
        false,
        1,
        species.stamina,
        DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO,
        cap
      );

      expect(filled.state.staminaRatio).toBeLessThanOrEqual(expectedCap);
      expect(filled.state.staminaRatio).toBeGreaterThan(expectedCap - 0.01);
    }
  );
});
