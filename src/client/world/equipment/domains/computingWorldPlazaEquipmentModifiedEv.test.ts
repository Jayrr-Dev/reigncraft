import { computingWorldPlazaEquipmentModifiedEv } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import { computingWorldPlazaEquipmentAttackEvWithFlat } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
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

describe('computingWorldPlazaEquipmentAttackEvWithFlat', () => {
  it('applies multiplier then flat', () => {
    expect(computingWorldPlazaEquipmentAttackEvWithFlat(100, 1.15, 20)).toBe(
      135
    );
  });

  it('matches steel and gold mean EV at base 100', () => {
    expect(computingWorldPlazaEquipmentAttackEvWithFlat(100, 1.3, 50)).toBe(
      180
    );
  });
});
