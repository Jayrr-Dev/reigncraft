import { resolvingWorldPlazaGirlSampleRollDodgeDamageOptions } from '@/components/world/domains/resolvingWorldPlazaGirlSampleRollDodgeDamageOptions';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaGirlSampleRollDodgeDamageOptions', () => {
  it('applies frame-scaled incoming damage mitigation to physical hits during roll dodge', () => {
    expect(
      resolvingWorldPlazaGirlSampleRollDodgeDamageOptions({
        rollDodgeProgress: 0.45,
        damageKind: 'physical',
      }).ephemeralIncomingDamageMultiplier
    ).toBeCloseTo(0.05, 5);
  });

  it('leaves non-physical damage unchanged', () => {
    expect(
      resolvingWorldPlazaGirlSampleRollDodgeDamageOptions({
        rollDodgeProgress: 0.45,
        damageKind: 'toxic',
        baseOptions: { skipDamageRoll: true },
      })
    ).toEqual({ skipDamageRoll: true });
  });
});
