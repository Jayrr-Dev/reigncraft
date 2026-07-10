import { describe, expect, it } from 'vitest';
import {
  computingWorldPlazaFrostbiteSpeedMovementMultiplier,
  formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine,
} from '@/components/world/health/domains/computingWorldPlazaFrostbiteSpeedMovementMultiplier';

describe('computingWorldPlazaFrostbiteSpeedMovementMultiplier', () => {
  it('is full speed at zero stacks and 25% speed at max stacks', () => {
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(0)).toBe(1);
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(1000)).toBeCloseTo(
      0.25
    );
  });

  it('scales linearly with stack count', () => {
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(200)).toBeCloseTo(
      0.85
    );
    expect(computingWorldPlazaFrostbiteSpeedMovementMultiplier(500)).toBeCloseTo(
      0.625
    );
  });

  it('formats the HUD slow line from stacks', () => {
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(200)).toBe(
      '15% slower walking'
    );
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(1000)).toBe(
      '75% slower walking'
    );
    expect(formattingWorldPlazaFrostbiteSpeedSlowHudEffectLine(0)).toBeNull();
  });
});
