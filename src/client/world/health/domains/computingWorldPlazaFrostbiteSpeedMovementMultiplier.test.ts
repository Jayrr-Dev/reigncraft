import { describe, expect, it } from 'vitest';
import {
  computingWorldPlazaFrostbiteSpeedMovementMultiplier,
  formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine,
} from '@/components/world/health/domains/computingWorldPlazaFrostbiteSpeedMovementMultiplier';

describe('computingWorldPlazaFrostbiteSpeedMovementMultiplier', () => {
  it('is full speed at zero stacks and 50% speed at max stacks', () => {
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(0)).toBe(1);
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(1000)).toBeCloseTo(
      0.5
    );
  });

  it('scales linearly with stack count', () => {
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(200)).toBeCloseTo(
      0.9
    );
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(500)).toBeCloseTo(
      0.75
    );
  });

  it('formats the HUD slow line from stacks', () => {
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(200)).toBe(
      '10% slower walking'
    );
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(1000)).toBe(
      '50% slower walking'
    );
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(0)).toBeNull();
  });
});
