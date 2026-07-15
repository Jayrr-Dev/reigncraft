/**
 * Fishing catch roll unit tests.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll.test
 */

import { DEFINING_WORLD_PLAZA_WATER_KIND_LAKE } from '@/components/world/domains/definingWorldPlazaWaterKind';
import {
  listingWorldPlazaFishingCatchEntriesForContext,
  resolvingWorldPlazaFishingCatchGrant,
  resolvingWorldPlazaFishingCatchRoll,
} from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll';

describe('resolvingWorldPlazaFishingCatchRoll', () => {
  it('lists lake catches for plains', () => {
    const eligible = listingWorldPlazaFishingCatchEntriesForContext({
      waterKind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
      biomeKind: 'plains',
    });

    expect(eligible.length).toBeGreaterThan(0);
    expect(
      eligible.every((entry) => entry.waterKinds.includes('lake'))
    ).toBe(true);
    expect(
      eligible.every(
        (entry) =>
          !entry.biomeKinds ||
          entry.biomeKinds.length === 0 ||
          entry.biomeKinds.includes('plains')
      )
    ).toBe(true);
  });

  it('includes beach-only striped bass on beach lakes', () => {
    const eligible = listingWorldPlazaFishingCatchEntriesForContext({
      waterKind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
      biomeKind: 'beach',
    });

    expect(
      eligible.some((entry) => entry.catchId === 'striped-bass')
    ).toBe(true);
  });

  it('excludes beach-only catches on plains lakes', () => {
    const eligible = listingWorldPlazaFishingCatchEntriesForContext({
      waterKind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
      biomeKind: 'plains',
    });

    expect(
      eligible.some((entry) => entry.catchId === 'striped-bass')
    ).toBe(false);
  });

  it('rolls a grantable catch', () => {
    const entry = resolvingWorldPlazaFishingCatchRoll(
      {
        waterKind: DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
        biomeKind: 'plains',
      },
      () => 0
    );

    expect(entry).not.toBeNull();

    if (!entry) {
      return;
    }

    const grant = resolvingWorldPlazaFishingCatchGrant(entry);
    expect(grant.itemTypeId.length).toBeGreaterThan(0);
    expect(grant.displayName.length).toBeGreaterThan(0);
  });
});
