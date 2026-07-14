import { describe, expect, it } from 'vitest';
import {
  resolvingWorldShrubBerryLootKindAtTileIndex,
  resolvingWorldShrubBerryLootKindFromUnit,
  WORLD_SHRUB_BERRY_LOOT_REGISTRY,
  WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT,
} from './worldShrubBerryLoot';

describe('worldShrubBerryLoot', () => {
  it('weights red berry for low unit floats', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0)).toBe('red_berry');
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.5)).toBe('red_berry');
  });

  it('weights blue berry for mid unit floats', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.7)).toBe('blue_berry');
  });

  it('weights golden berry for the rare band', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.81)).toBe(
      'golden_berry'
    );
  });

  it('weights tea leaves for the top band', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.9)).toBe('tea_leaves');
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.999)).toBe(
      'tea_leaves'
    );
  });

  it('rolls deterministically per tile index', () => {
    const first = resolvingWorldShrubBerryLootKindAtTileIndex(14, 22);
    const second = resolvingWorldShrubBerryLootKindAtTileIndex(14, 22);

    expect(first).toBe(second);
    expect(['red_berry', 'blue_berry', 'golden_berry', 'tea_leaves']).toContain(
      first
    );
  });

  it('covers every registry bucket at unit boundaries', () => {
    let cumulative = 0;

    for (const entry of WORLD_SHRUB_BERRY_LOOT_REGISTRY) {
      cumulative += entry.weight;
      const unit = (cumulative - 0.001) / WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT;
      expect(resolvingWorldShrubBerryLootKindFromUnit(unit)).toBe(
        entry.itemKind
      );
    }
  });

  it('totals registry weight to 100', () => {
    expect(WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT).toBe(100);
  });
});
