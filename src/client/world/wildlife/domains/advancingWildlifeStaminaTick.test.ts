import {
  advancingWildlifeStaminaTick,
  DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO,
} from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { resolvingWildlifeSpeciesExhaustedExitRatio } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import { describe, expect, it } from 'vitest';

describe('advancingWildlifeStaminaTick', () => {
  it('keeps other species exhausted until the default recovery threshold', () => {
    const recovered = advancingWildlifeStaminaTick(
      { staminaRatio: 0.4, isExhausted: true },
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
        { staminaRatio: 0.74, isExhausted: true },
        true,
        0,
        undefined,
        exitRatio
      );

      expect(stillWinded.state.isExhausted).toBe(true);

      const recovered = advancingWildlifeStaminaTick(
        { staminaRatio: 0.75, isExhausted: true },
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
      { staminaRatio: 0.5, isExhausted: true },
      true,
      1,
      undefined,
      boarExitRatio
    );

    expect(stillWinded.state.isExhausted).toBe(true);

    const recovered = advancingWildlifeStaminaTick(
      { staminaRatio: 0.99, isExhausted: true },
      true,
      1,
      undefined,
      boarExitRatio
    );

    expect(recovered.state.isExhausted).toBe(false);
  });
});
