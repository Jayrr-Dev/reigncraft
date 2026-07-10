import { computingWorldPlazaEquipmentModifiedEv } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEquipmentModifiedEv', () => {
  it('returns base when modifier is missing', () => {
    expect(computingWorldPlazaEquipmentModifiedEv(300, undefined)).toBe(300);
  });

  it('adds additive modifiers', () => {
    expect(
      computingWorldPlazaEquipmentModifiedEv(300, {
        mode: 'additive',
        value: 50,
      })
    ).toBe(350);
  });

  it('multiplies multiplicative modifiers', () => {
    expect(
      computingWorldPlazaEquipmentModifiedEv(300, {
        mode: 'multiplicative',
        value: 1.45,
      })
    ).toBe(435);
  });
});
