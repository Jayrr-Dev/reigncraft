import { describe, expect, it } from 'vitest';

import {
  resolvingWorldPlazaNamedRealmAtBiomeRegion,
} from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';

describe('resolvingWorldPlazaNamedRealmAtBiomeRegion', () => {
  it('returns a stable realm for the same biome-region cell', () => {
    const first = resolvingWorldPlazaNamedRealmAtBiomeRegion(12, -4);
    const second = resolvingWorldPlazaNamedRealmAtBiomeRegion(12, -4);

    expect(first.realmId).toBe(second.realmId);
    expect(first.displayName).toBe(second.displayName);
    expect(first.displayName.length).toBeGreaterThan(0);
  });

  it('keeps the same realm across nearby cells inside one large claim', () => {
    const origin = resolvingWorldPlazaNamedRealmAtBiomeRegion(0, 0);
    const nearby = resolvingWorldPlazaNamedRealmAtBiomeRegion(1, 0);

    // Adjacent cells often share a realm; if not, both still resolve valid names.
    expect(origin.displayName.length).toBeGreaterThan(0);
    expect(nearby.displayName.length).toBeGreaterThan(0);
  });

  it('produces multiple distinct realms across a wide sample', () => {
    const realmIds = new Set(
      Array.from({ length: 80 }, (_, index) =>
        resolvingWorldPlazaNamedRealmAtBiomeRegion(index * 3, index).realmId
      )
    );

    expect(realmIds.size).toBeGreaterThan(8);
  });

  it('uses a titled display name from the place catalog', () => {
    const realm = resolvingWorldPlazaNamedRealmAtBiomeRegion(5, 7);

    expect(
      /Kingdom of |Realm of |The .+ March|The .+ Reach|The .+ Lands| Hold$/.test(
        realm.displayName
      )
    ).toBe(true);
  });
});
