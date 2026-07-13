import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { drawingWorldBuildingPlacementPreviewOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics';
import { Graphics } from 'pixi.js';
import { describe, expect, it, vi } from 'vitest';

const { drawingWorldPlazaCampfirePlacedBlockOnGraphicsMock } = vi.hoisted(
  () => ({
    drawingWorldPlazaCampfirePlacedBlockOnGraphicsMock: vi.fn(),
  })
);

vi.mock(
  '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics',
  () => ({
    drawingWorldPlazaCampfirePlacedBlockOnGraphics:
      drawingWorldPlazaCampfirePlacedBlockOnGraphicsMock,
  })
);

describe('drawingWorldBuildingPlacementPreviewOnGraphics', () => {
  it('draws the procedural campfire for an armed campfire placement', () => {
    const graphics = new Graphics();

    drawingWorldBuildingPlacementPreviewOnGraphics(
      graphics,
      4,
      6,
      true,
      0,
      DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      undefined,
      undefined,
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
    );

    expect(
      drawingWorldPlazaCampfirePlacedBlockOnGraphicsMock
    ).toHaveBeenCalledOnce();
    expect(
      drawingWorldPlazaCampfirePlacedBlockOnGraphicsMock
    ).toHaveBeenCalledWith(
      graphics,
      expect.objectContaining({
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: { tileX: 4, tileY: 6 },
        blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      })
    );
  });
});
