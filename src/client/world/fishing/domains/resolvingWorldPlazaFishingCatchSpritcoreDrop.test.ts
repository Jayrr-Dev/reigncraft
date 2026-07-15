import { DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITCORE_AMOUNT_RANGE_BY_RARITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import type { DefiningWorldPlazaFishingCatchCatalogEntry } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import { resolvingWorldPlazaFishingCatchSpritcoreDrop } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchSpritcoreDrop';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/managingWorldPlazaGenerationFeatureStore',
  () => ({
    checkingWorldPlazaGenerationFeatureEnabled: vi.fn(() => true),
  })
);

import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

const featureMock = vi.mocked(checkingWorldPlazaGenerationFeatureEnabled);

function creatingCreatureEntry(
  rarity: DefiningWorldPlazaInventoryItemRarity
): DefiningWorldPlazaFishingCatchCatalogEntry {
  return {
    kind: 'creature',
    catchId: 'test-fish',
    rarity,
    waterKinds: [],
    rawDisplayName: 'Raw Test Fish',
    cookedDisplayName: 'Cooked Test Fish',
    rawItemTypeId: 'world-plaza-raw-test-fish',
    cookedItemTypeId: 'world-plaza-cooked-test-fish',
    rawHungerRestoreRatio: 0.1,
    cookedHungerRestoreRatio: 0.2,
    cookDurationMs: 2_000,
    carryWeight: 1.5,
    rawIconEmoji: '🐟',
    cookedIconEmoji: '🍖',
  };
}

describe('resolvingWorldPlazaFishingCatchSpritcoreDrop', () => {
  beforeEach(() => {
    featureMock.mockReturnValue(true);
  });

  it('returns null for junk catches', () => {
    expect(
      resolvingWorldPlazaFishingCatchSpritcoreDrop({
        kind: 'junk',
        catchId: 'plank',
        rarity: 'common',
        waterKinds: [],
        displayName: 'Plank',
        itemTypeId: 'world-plaza-fishing-junk-plank',
        carryWeight: 1,
        iconEmoji: '🪵',
      })
    ).toBeNull();
  });

  it('rolls within the rarity range for living catches', () => {
    const commonRange =
      DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITCORE_AMOUNT_RANGE_BY_RARITY.common;
    const godlyRange =
      DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITCORE_AMOUNT_RANGE_BY_RARITY.godly;

    const commonMin = resolvingWorldPlazaFishingCatchSpritcoreDrop({
      entry: creatingCreatureEntry('common'),
      rollUnit: () => 0,
    });
    const commonMax = resolvingWorldPlazaFishingCatchSpritcoreDrop({
      entry: creatingCreatureEntry('common'),
      rollUnit: () => 0.999,
    });
    const godlyMin = resolvingWorldPlazaFishingCatchSpritcoreDrop({
      entry: creatingCreatureEntry('godly'),
      rollUnit: () => 0,
    });

    expect(commonMin).toEqual({
      amount: commonRange.minInclusive,
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
      displayName: expect.any(String),
    });
    expect(commonMax?.amount).toBe(commonRange.maxInclusive);
    expect(godlyMin?.amount).toBe(godlyRange.minInclusive);
    expect(godlyMin!.amount).toBeGreaterThan(commonMax!.amount);
  });

  it('returns null when Spritcore leveling is disabled', () => {
    featureMock.mockReturnValue(false);

    expect(
      resolvingWorldPlazaFishingCatchSpritcoreDrop(
        creatingCreatureEntry('rare')
      )
    ).toBeNull();
  });
});
