import { syncingWorldPlazaEquippedSpecialtyWeaponModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaEquippedSpecialtyWeaponModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('syncingWorldPlazaEquippedSpecialtyWeaponModifiers', () => {
  it('applies Glass Needle attack speed while equipped', () => {
    const next = syncingWorldPlazaEquippedSpecialtyWeaponModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      'world-plaza-weapon-glass-needle',
      1000
    );
    expect(
      next.movementModifiers.some(
        (modifier) =>
          modifier.kind === 'attack_speed' && modifier.multiplier === 1.12
      )
    ).toBe(true);
  });

  it('applies Siphon Fang lifesteal while equipped', () => {
    const next = syncingWorldPlazaEquippedSpecialtyWeaponModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      'world-plaza-weapon-siphon-fang',
      1000
    );
    expect(next.physicalDamageLifestealModifiers[0]?.ratio).toBe(0.15);
  });

  it('clears modifiers when unequipped', () => {
    const equipped = syncingWorldPlazaEquippedSpecialtyWeaponModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      'world-plaza-weapon-siphon-fang',
      1000
    );
    const cleared = syncingWorldPlazaEquippedSpecialtyWeaponModifiers(
      equipped,
      null,
      2000
    );
    expect(cleared.physicalDamageLifestealModifiers).toHaveLength(0);
  });
});
