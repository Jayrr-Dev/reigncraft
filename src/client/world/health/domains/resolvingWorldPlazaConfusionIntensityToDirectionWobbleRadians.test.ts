import { resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians } from '@/components/world/health/domains/resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians', () => {
  it('orders wobble by intensity with 10 below 50 below 100', () => {
    const mildWobble =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(10);
    const moderateWobble =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(50);
    const severeWobble =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(100);

    expect(mildWobble).toBeLessThan(moderateWobble);
    expect(moderateWobble).toBeLessThan(severeWobble);
  });

  it('clamps intensities outside 1 to 100', () => {
    const belowMin =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(0);
    const atMin =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(1);
    const aboveMax =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(150);
    const atMax =
      resolvingWorldPlazaConfusionIntensityToDirectionWobbleRadians(100);

    expect(belowMin).toBe(atMin);
    expect(aboveMax).toBe(atMax);
  });
});
