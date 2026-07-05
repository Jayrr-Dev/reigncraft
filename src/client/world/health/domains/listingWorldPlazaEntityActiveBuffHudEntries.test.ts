import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { listingWorldPlazaEntityBuffDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  computingWorldPlazaEntityBuffHudRemainingSeconds,
  listingWorldPlazaEntityActiveBuffHudEntries,
} from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityBuffHudIcon } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaEntityActiveBuffHudEntries', () => {
  it('lists timed half-damage buff with icon and countdown metadata', () => {
    const nowMs = 1_000;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityBuff(state, 'half-damage-buff', nowMs);

    const entries = listingWorldPlazaEntityActiveBuffHudEntries({
      state,
      nowMs,
      defenderModifierIds: state.damageRollModifiers.map(
        (modifier) => modifier.id
      ),
      attackerModifierIds: [],
    });

    expect(entries).toEqual([
      expect.objectContaining({
        id: 'half-damage-buff',
        icon: 'ph:heart-half',
        expiresAtMs: nowMs + 30_000,
      }),
    ]);
    expect(
      computingWorldPlazaEntityBuffHudRemainingSeconds(
        entries[0]?.expiresAtMs ?? null,
        nowMs + 5_000
      )
    ).toBe(25);
  });
});

describe('resolvingWorldPlazaEntityBuffHudIcon', () => {
  it('maps every registered buff to an icon', () => {
    for (const descriptor of listingWorldPlazaEntityBuffDescriptors()) {
      expect(resolvingWorldPlazaEntityBuffHudIcon(descriptor.id)).toBeTruthy();
    }
  });
});
