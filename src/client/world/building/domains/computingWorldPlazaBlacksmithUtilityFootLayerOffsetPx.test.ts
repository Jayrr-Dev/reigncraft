import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx,
  resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint,
  resolvingWorldPlazaBlacksmithUtilityEntityZIndex,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { DEFINING_WORLD_DEPTH_BLACKSMITH_UTILITY_ENTITY_DEPTH_BIAS } from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx', () => {
  it('keeps ground flush utilities on the ground diamond', () => {
    expect(computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx(1, 1)).toBe(0);
  });

  it('sits stacked 1H utilities on the solid support top face', () => {
    // L = S + H with S = 1, H = 1 → L = 2. Feet must use S, not L.
    expect(
      computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx(2, 1)
    ).toBeCloseTo(0);
  });

  it('sits stacked utilities on elevated solid platforms', () => {
    // S = 4, H = 1 → L = 5. Feet at S = 4 → 3 layers above ground.
    expect(computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx(5, 1)).toBe(
      (4 - 1) * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX * -1
    );
  });

  it('uses the passable surface layer for 0H tiles', () => {
    expect(computingWorldPlazaBlacksmithUtilityFootLayerOffsetPx(4, 0)).toBe(
      (4 - 1) * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX * -1
    );
  });
});

describe('resolvingWorldPlazaBlacksmithUtilityEntityZIndex', () => {
  it('sorts 2x2 utilities from the footprint center foot', () => {
    const depthFoot = resolvingWorldPlazaBlacksmithUtilityDepthSortGridPoint(
      10,
      12,
      2,
      2
    );

    expect(depthFoot).toEqual({ x: 10.5, y: 12.5 });
    expect(resolvingWorldPlazaBlacksmithUtilityEntityZIndex(10, 12, 2, 2)).toBe(
      computingWorldDepthSortKey(depthFoot) +
        DEFINING_WORLD_DEPTH_BLACKSMITH_UTILITY_ENTITY_DEPTH_BIAS
    );
  });

  it('keeps 1x1 utilities on the anchor tile foot with coplanar avatar bias', () => {
    expect(resolvingWorldPlazaBlacksmithUtilityEntityZIndex(3, 5, 1, 1)).toBe(
      computingWorldDepthSortKey({ x: 3, y: 5 }) +
        DEFINING_WORLD_DEPTH_BLACKSMITH_UTILITY_ENTITY_DEPTH_BIAS
    );
  });
});
