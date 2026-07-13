import { checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex } from '@/components/world/building/domains/checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { describe, expect, it } from 'vitest';

function creatingHalfBlock(
  blockId: string,
  worldLayer: number,
  blockHeight = 2
) {
  return creatingWorldBuildingPlacedBlock({
    blockId,
    plotId: 'plot',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
    tilePosition: { tileX: 10, tileY: 10 },
    worldLayer,
    blockHeight,
    ownerId: 'owner',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex', () => {
  it('treats a standalone elevated Half as floating overhead', () => {
    expect(
      checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
        10,
        10,
        1,
        [creatingHalfBlock('upper', 4)]
      )
    ).toBe(true);
  });

  it('does not treat two stacked Half blocks as floating overhead', () => {
    expect(
      checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
        10,
        10,
        1,
        [creatingHalfBlock('lower', 2), creatingHalfBlock('upper', 4)]
      )
    ).toBe(false);
  });

  it('recognizes a continuous two-Half stack on elevation layer 2', () => {
    expect(
      checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
        10,
        10,
        2,
        [creatingHalfBlock('lower', 3), creatingHalfBlock('upper', 5)]
      )
    ).toBe(false);
  });

  it('does not treat two stacked Slabs (L2+L3) as floating overhead', () => {
    expect(
      checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
        10,
        10,
        1,
        [creatingHalfBlock('lower', 2, 1), creatingHalfBlock('upper', 3, 1)]
      )
    ).toBe(false);
  });

  it('keeps overhead behavior when a support layer is missing', () => {
    expect(
      checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex(
        10,
        10,
        1,
        [
          creatingHalfBlock('ground', 1, 1),
          creatingHalfBlock('upper', 4),
        ]
      )
    ).toBe(true);
  });
});
