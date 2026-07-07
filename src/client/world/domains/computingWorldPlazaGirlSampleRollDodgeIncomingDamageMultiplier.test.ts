import {
  computingWorldPlazaGirlSampleRollDodgeDamageReductionRatio,
  computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier,
} from '@/components/world/domains/computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier', () => {
  it('returns null outside the dodge window', () => {
    expect(
      computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier(0.1)
    ).toBeNull();
  });

  it('ramps from 75% reduction at the dodge edges to 95% at the peak frame', () => {
    const edgeReduction =
      computingWorldPlazaGirlSampleRollDodgeDamageReductionRatio(0.15);
    const peakReduction =
      computingWorldPlazaGirlSampleRollDodgeDamageReductionRatio(0.45);

    expect(edgeReduction).toBeCloseTo(0.75, 5);
    expect(peakReduction).toBeCloseTo(0.95, 5);
    expect(
      computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier(0.45)
    ).toBeCloseTo(0.05, 5);
  });
});
