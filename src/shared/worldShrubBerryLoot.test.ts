import { describe, expect, it } from 'vitest';
import {
  resolvingWorldShrubBerryLootKindAtTileIndex,
  resolvingWorldShrubBerryLootKindFromUnit,
  WORLD_SHRUB_BERRY_LOOT_REGISTRY,
  WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT,
} from './worldShrubBerryLoot';

describe('worldShrubBerryLoot', () => {
  it('weights coffee cherry for low unit floats', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0)).toBe('red_berry');
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.3)).toBe('red_berry');
  });

  it('weights blue berry for mid unit floats', () => {
    expect(resolvingWorldShrubBerryLootKindFromUnit(0.42)).toBe('blue_berry');
  });

  it('rolls deterministically per tile index', () => {
    const first = resolvingWorldShrubBerryLootKindAtTileIndex(14, 22);
    const second = resolvingWorldShrubBerryLootKindAtTileIndex(14, 22);

    expect(first).toBe(second);
    expect(
      WORLD_SHRUB_BERRY_LOOT_REGISTRY.map((entry) => entry.itemKind)
    ).toContain(first);
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

  it('totals registry weight to 925', () => {
    expect(WORLD_SHRUB_BERRY_LOOT_TOTAL_WEIGHT).toBe(925);
  });

  it('includes extended forage berries and leaves', () => {
    const kinds = WORLD_SHRUB_BERRY_LOOT_REGISTRY.map(
      (entry) => entry.itemKind
    );

    expect(kinds).toContain('cranberry');
    expect(kinds).toContain('moly');
    expect(kinds).toContain('lotus_fruit');
    expect(kinds).toHaveLength(22);
  });
});
