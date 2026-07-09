import { describe, expect, it } from 'vitest';
import {
  computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier,
  formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine,
} from '@/components/world/health/domains/computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier';

describe('computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier', () => {
  it('is full regen at zero stacks and 25% regen at max stacks', () => {
    expect(computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(0)).toBe(
      1
    );
    expect(
      computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(1000)
    ).toBeCloseTo(0.25);
  });

  it('scales linearly with stack count', () => {
    expect(
      computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(200)
    ).toBeCloseTo(0.85);
    expect(
      computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(500)
    ).toBeCloseTo(0.625);
  });

  it('formats the HUD slow line from stacks', () => {
    expect(
      formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine(200)
    ).toBe('15% slower stamina regen');
    expect(
      formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine(1000)
    ).toBe('75% slower stamina regen');
    expect(
      formattingWorldPlazaFrostbiteStaminaRegenSlowHudEffectLine(0)
    ).toBeNull();
  });
});
