/**
 * Fishing catch escape chance unit tests.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingCatchEscapeChance.test
 */

import {
  computingWorldPlazaFishingCatchEscapeChance,
  rollingWorldPlazaFishingCatchEscaped,
} from '@/components/world/fishing/domains/computingWorldPlazaFishingCatchEscapeChance';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaFishingCatchEscapeChance', () => {
  it('lowers escape chance for better rod tiers', () => {
    const woodChance = computingWorldPlazaFishingCatchEscapeChance('wood', 1);
    const goldChance = computingWorldPlazaFishingCatchEscapeChance('gold', 1);

    expect(goldChance).toBeLessThan(woodChance);
  });

  it('lowers escape chance when harvest speed is higher', () => {
    const baseChance = computingWorldPlazaFishingCatchEscapeChance('iron', 1);
    const fasterChance = computingWorldPlazaFishingCatchEscapeChance(
      'iron',
      1.6
    );

    expect(fasterChance).toBeLessThan(baseChance);
  });

  it('lowers escape chance when the player reels in', () => {
    const baseChance = computingWorldPlazaFishingCatchEscapeChance(
      'wood',
      1,
      0
    );
    const reeledChance = computingWorldPlazaFishingCatchEscapeChance(
      'wood',
      1,
      0.08
    );

    expect(reeledChance).toBeLessThan(baseChance);
  });
});

describe('rollingWorldPlazaFishingCatchEscaped', () => {
  it('never escapes when chance is zero', () => {
    expect(rollingWorldPlazaFishingCatchEscaped(0, 0)).toBe(false);
  });

  it('escapes when roll lands inside the chance band', () => {
    expect(rollingWorldPlazaFishingCatchEscaped(0.2, 0.1)).toBe(true);
    expect(rollingWorldPlazaFishingCatchEscaped(0.2, 0.9)).toBe(false);
  });
});
