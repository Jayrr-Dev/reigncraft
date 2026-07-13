import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { resolvingWorldBuildingMinimumWorldLayerForBlockHeight } from '@/components/world/building/domains/resolvingWorldBuildingMinimumWorldLayerForBlockHeight';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldBuildingMinimumWorldLayerForBlockHeight', () => {
  it('keeps passable tiles on ground', () => {
    expect(
      resolvingWorldBuildingMinimumWorldLayerForBlockHeight(
        DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE
      )
    ).toBe(DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND);
  });

  it('anchors extruded presets flush on ground (L = H)', () => {
    expect(resolvingWorldBuildingMinimumWorldLayerForBlockHeight(1)).toBe(1);
    expect(resolvingWorldBuildingMinimumWorldLayerForBlockHeight(2)).toBe(2);
    expect(resolvingWorldBuildingMinimumWorldLayerForBlockHeight(4)).toBe(4);
  });
});
