import { describe, expect, it } from 'vitest';
import {
  computingWorldToolHarvestYieldPerLayer,
  resolvingWorldToolHarvestSwingYield,
  resolvingWorldToolHarvestYieldStats,
  WORLD_TOOL_HARVEST_YIELD_BY_TIER,
} from './worldToolHarvestYield';

describe('resolvingWorldToolHarvestYieldStats', () => {
  it('uses wood baseline for missing tiers', () => {
    expect(resolvingWorldToolHarvestYieldStats(null)).toEqual(
      WORLD_TOOL_HARVEST_YIELD_BY_TIER.wood
    );
    expect(resolvingWorldToolHarvestYieldStats('obsidian')).toEqual(
      WORLD_TOOL_HARVEST_YIELD_BY_TIER.wood
    );
  });

  it('returns steel yield of 3 per layer and 3 layers per swing', () => {
    expect(resolvingWorldToolHarvestYieldStats('steel')).toEqual({
      layersPerSwing: 3,
      yieldPerLayerMin: 3,
      yieldPerLayerMax: 3,
    });
  });
});

describe('computingWorldToolHarvestYieldPerLayer', () => {
  it('rolls gold yield between 1 and 5', () => {
    const gold = WORLD_TOOL_HARVEST_YIELD_BY_TIER.gold;

    expect(computingWorldToolHarvestYieldPerLayer(gold, () => 0)).toBe(1);
    expect(computingWorldToolHarvestYieldPerLayer(gold, () => 0.99)).toBe(5);
  });
});

describe('resolvingWorldToolHarvestSwingYield', () => {
  it('resolves wood to one layer and one resource', () => {
    expect(resolvingWorldToolHarvestSwingYield('wood', () => 0)).toEqual({
      layersPerSwing: 1,
      resourcePerLayer: 1,
    });
  });
});
