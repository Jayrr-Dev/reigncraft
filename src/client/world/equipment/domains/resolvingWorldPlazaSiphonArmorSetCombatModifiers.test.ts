import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaSiphonArmorPiecesWorn,
  resolvingWorldPlazaSiphonArmorSetCombatBundle,
} from '@/components/world/equipment/domains/resolvingWorldPlazaSiphonArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('Siphon set combat modifiers', () => {
  it('applies piece absorb and 2-piece set absorb when two pieces worn', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-siphon-cowl',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-siphon-claws',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaSiphonArmorPiecesWorn(loadout)).toBe(2);

    const bundle = resolvingWorldPlazaSiphonArmorSetCombatBundle(loadout, 1000);

    expect(bundle.incomingDamageHealModifiers).toHaveLength(3);
    const absorbSum = bundle.incomingDamageHealModifiers.reduce(
      (sum, modifier) => sum + modifier.ratio,
      0
    );
    expect(absorbSum).toBeCloseTo(0.1);
    expect(bundle.physicalDamageLifestealModifiers).toHaveLength(0);
  });

  it('grants full-set absorb stack and outgoing lifesteal at 4 pieces', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-siphon-cowl',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-siphon-claws',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-siphon-carapace',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-siphon-treads',
        quantity: 1,
        slotIndex: -1,
      },
    };

    const synced = syncingWorldPlazaArmorWornCombatModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      loadout,
      1000
    );

    expect(
      synced.damageRollModifiers.some((modifier) =>
        modifier.id.includes('siphon:full-marker')
      )
    ).toBe(true);

    const absorbSum = synced.incomingDamageHealModifiers.reduce(
      (sum, modifier) => sum + modifier.ratio,
      0
    );
    // pieces 0.01+0.01+0.02+0.01 + set 0.08+0.07+0.10 = 0.30
    expect(absorbSum).toBeCloseTo(0.3);
    expect(synced.physicalDamageLifestealModifiers).toHaveLength(1);
    expect(synced.physicalDamageLifestealModifiers[0]?.ratio).toBe(0.08);
  });
});
