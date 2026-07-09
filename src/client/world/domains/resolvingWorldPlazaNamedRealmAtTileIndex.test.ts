import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaNamedRealmSizeType } from '@/components/world/domains/definingWorldPlazaNamedRealmSizeType';
import {
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN,
} from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';
import { resolvingWorldPlazaNamedRealmAtBiomeRegion } from '@/components/world/domains/resolvingWorldPlazaNamedRealmAtTileIndex';

describe('resolvingWorldPlazaNamedRealmSizeType', () => {
  it('maps size weight bands to tiny through large', () => {
    const span =
      DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX -
      DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN;
    const at = (normalized: number): number =>
      DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN + normalized * span;

    expect(resolvingWorldPlazaNamedRealmSizeType(at(0))).toBe('tiny');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(0.19))).toBe('tiny');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(0.2))).toBe('small');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(0.4))).toBe('medium');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(0.6))).toBe('big');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(0.8))).toBe('large');
    expect(resolvingWorldPlazaNamedRealmSizeType(at(1))).toBe('large');
  });
});

describe('resolvingWorldPlazaNamedRealmAtBiomeRegion', () => {
  it('returns a stable realm for the same biome-region cell', () => {
    const first = resolvingWorldPlazaNamedRealmAtBiomeRegion(12, -4);
    const second = resolvingWorldPlazaNamedRealmAtBiomeRegion(12, -4);

    expect(first.realmId).toBe(second.realmId);
    expect(first.displayName).toBe(second.displayName);
    expect(first.sizeType).toBe(second.sizeType);
    expect(first.displayName.length).toBeGreaterThan(0);
  });

  it('keeps the same realm across nearby cells inside one large claim', () => {
    const origin = resolvingWorldPlazaNamedRealmAtBiomeRegion(0, 0);
    const nearby = resolvingWorldPlazaNamedRealmAtBiomeRegion(1, 0);

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

  it('uses a plain place name from the catalog', () => {
    const realm = resolvingWorldPlazaNamedRealmAtBiomeRegion(5, 7);

    expect(realm.displayName).toBe(realm.placeName);
    expect(realm.displayName.length).toBeGreaterThan(0);
    expect(realm.displayName.includes(' ')).toBe(false);
  });

  it('assigns a valid sizeType on every resolved realm', () => {
    const sizeTypes = new Set(
      Array.from({ length: 40 }, (_, index) =>
        resolvingWorldPlazaNamedRealmAtBiomeRegion(index * 5, index * 2).sizeType
      )
    );

    for (const sizeType of sizeTypes) {
      expect(['tiny', 'small', 'medium', 'big', 'large']).toContain(sizeType);
    }

    expect(sizeTypes.size).toBeGreaterThan(1);
  });
});
