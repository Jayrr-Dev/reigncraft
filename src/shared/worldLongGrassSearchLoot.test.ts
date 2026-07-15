import { describe, expect, it } from 'vitest';
import {
  checkingWorldLongGrassSearchLootIsClover,
  resolvingWorldLongGrassSearchLootEntryWeight,
  resolvingWorldLongGrassSearchLootKindAtTileIndex,
  resolvingWorldLongGrassSearchLootKindFromUnit,
  WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY,
  WORLD_LONG_GRASS_SEARCH_LOOT_TOTAL_WEIGHT,
  WORLD_LONG_GRASS_SEARCH_RARITY_WEIGHT,
} from './worldLongGrassSearchLoot';

describe('worldLongGrassSearchLoot', () => {
  it('uses rarity base weights unless overridden', () => {
    const thatch = WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY.find(
      (entry) => entry.itemKind === 'thatch_bundle'
    );
    const fourLeaf = WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY.find(
      (entry) => entry.itemKind === 'four_leaf'
    );

    expect(thatch).toBeDefined();
    expect(fourLeaf).toBeDefined();
    expect(resolvingWorldLongGrassSearchLootEntryWeight(thatch!)).toBe(
      WORLD_LONG_GRASS_SEARCH_RARITY_WEIGHT.common
    );
    expect(resolvingWorldLongGrassSearchLootEntryWeight(fourLeaf!)).toBe(3);
  });

  it('rolls deterministically per tile index', () => {
    const first = resolvingWorldLongGrassSearchLootKindAtTileIndex(14, 22);
    const second = resolvingWorldLongGrassSearchLootKindAtTileIndex(14, 22);

    expect(first).toBe(second);
  });

  it('covers every registry bucket at unit boundaries', () => {
    let cumulative = 0;

    for (const entry of WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY) {
      cumulative += resolvingWorldLongGrassSearchLootEntryWeight(entry);
      const unit =
        (cumulative - 0.001) / WORLD_LONG_GRASS_SEARCH_LOOT_TOTAL_WEIGHT;
      expect(resolvingWorldLongGrassSearchLootKindFromUnit(unit)).toBe(
        entry.itemKind
      );
    }
  });

  it('flags clover kinds for herbarium side effects', () => {
    expect(checkingWorldLongGrassSearchLootIsClover('three_leaf')).toBe(true);
    expect(checkingWorldLongGrassSearchLootIsClover('four_leaf')).toBe(true);
    expect(checkingWorldLongGrassSearchLootIsClover('thatch_bundle')).toBe(
      false
    );
  });

  it('keeps fourteen loot entries (12 materials + 2 clovers)', () => {
    expect(WORLD_LONG_GRASS_SEARCH_LOOT_REGISTRY).toHaveLength(14);
  });
});
