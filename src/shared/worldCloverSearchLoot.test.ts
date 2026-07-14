import {
  resolvingWorldCloverSearchLootKindAtTileIndex,
  resolvingWorldCloverSearchLootKindFromUnit,
  WORLD_CLOVER_SEARCH_LOOT_REGISTRY,
  WORLD_CLOVER_SEARCH_LOOT_TOTAL_WEIGHT,
} from './worldCloverSearchLoot';
import { describe, expect, it } from 'vitest';

describe('worldCloverSearchLoot', () => {
  it('weights three-leaf clover for low unit floats', () => {
    expect(resolvingWorldCloverSearchLootKindFromUnit(0)).toBe('three_leaf');
    expect(resolvingWorldCloverSearchLootKindFromUnit(0.5)).toBe('three_leaf');
  });

  it('weights four-leaf clover for high unit floats', () => {
    expect(resolvingWorldCloverSearchLootKindFromUnit(0.99)).toBe('four_leaf');
  });

  it('rolls deterministically per tile index', () => {
    const first = resolvingWorldCloverSearchLootKindAtTileIndex(14, 22);
    const second = resolvingWorldCloverSearchLootKindAtTileIndex(14, 22);

    expect(first).toBe(second);
    expect(['three_leaf', 'four_leaf']).toContain(first);
  });

  it('covers every registry bucket at unit boundaries', () => {
    let cumulative = 0;

    for (const entry of WORLD_CLOVER_SEARCH_LOOT_REGISTRY) {
      cumulative += entry.weight;
      const unit = (cumulative - 0.001) / WORLD_CLOVER_SEARCH_LOOT_TOTAL_WEIGHT;
      expect(resolvingWorldCloverSearchLootKindFromUnit(unit)).toBe(
        entry.itemKind
      );
    }
  });
});
