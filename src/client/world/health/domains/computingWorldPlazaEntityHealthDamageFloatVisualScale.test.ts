import {
  computingWorldPlazaEntityHealthDamageFloatFontSizePx,
  computingWorldPlazaEntityHealthDamageFloatLifetimeMs,
} from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageFloatVisualScale';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityHealthDamageFloatVisualScale', () => {
  it('grows font size with |σ| for high rolls and low-tier visual weight', () => {
    const normal = computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: 'damage',
      deviationScore: 0,
    });
    const high = computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: 'damage_fatal',
      deviationScore: 3.5,
    });
    const softened = computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: 'damage_softened',
      deviationScore: -1.25,
    });
    const blocked = computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: 'damage_roll_blocked',
      deviationScore: -2.25,
    });
    const dodged = computingWorldPlazaEntityHealthDamageFloatFontSizePx({
      kind: 'damage_dodged',
      deviationScore: -3.5,
    });

    expect(high).toBeGreaterThan(normal);
    expect(dodged).toBeGreaterThan(blocked);
    expect(blocked).toBeGreaterThan(softened);
    expect(softened).toBeGreaterThanOrEqual(normal);
  });

  it('extends linger time for extreme |σ| outcomes', () => {
    const normal = computingWorldPlazaEntityHealthDamageFloatLifetimeMs({
      kind: 'damage',
      deviationScore: 0,
    });
    const extreme = computingWorldPlazaEntityHealthDamageFloatLifetimeMs({
      kind: 'damage_fatal',
      deviationScore: 4,
    });

    expect(extreme).toBeGreaterThan(normal);
  });
});
