import { checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  checkingWorldBuildingGridPointBlockedByPlacedBlocks,
  checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex,
  resolvingWorldBuildingJumpForwardGridDistanceClampedToWall,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import {
  resolvingWorldBuildingJumpLandableSurfaceLayerAtTileIndex,
  resolvingWorldBuildingStandableWalkSurfaceLayerAtTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBlockedWorldPoint';
import { describe, expect, it } from 'vitest';

function creatingElevatedSlab(
  definitionId: string,
  worldLayer: number,
  blockHeight = 1
) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `roof-${definitionId}-${worldLayer}`,
    plotId: 'plot',
    definitionId,
    tilePosition: creatingWorldBuildingTilePosition(10, 10),
    worldLayer,
    blockHeight,
    ownerId: 'owner',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('walk under elevated slab', () => {
  it('uses character height to determine roof clearance', () => {
    expect(
      checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(1, 5, 1, 4)
    ).toBe(false);
    expect(
      checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(1, 4, 1, 4)
    ).toBe(true);
    expect(
      checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(1, 4, 1, 3.6)
    ).toBe(false);
    expect(
      checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(1, 5, 1, 5)
    ).toBe(true);
  });

  it('blocks or allows the same roof based on character height', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      4
    );

    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [roof],
        true,
        false,
        1,
        4
      )
    ).toBe(true);
    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [roof],
        true,
        false,
        1,
        3.6
      )
    ).toBe(false);
  });

  it('uses character height when validating jump landing headroom', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      4
    );

    expect(
      checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
        10,
        10,
        [roof],
        1,
        2,
        4
      )
    ).toBe(true);
    expect(
      checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
        10,
        10,
        [roof],
        1,
        2,
        3.6
      )
    ).toBe(false);
  });

  it('does not vertically overlap a L7 H1 slab from ground', () => {
    expect(
      checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(1, 7, 1)
    ).toBe(false);
  });

  it('does not block ground walk under a L7 pine slab', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      7
    );

    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [roof],
        true,
        false,
        1
      )
    ).toBe(false);
  });

  it('blocks walking through a pine tower that fills the standing layer', () => {
    const tower = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      2,
      2
    );

    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [tower],
        true,
        false,
        1
      )
    ).toBe(true);
  });

  it('blocks walking through a tall pine stack (L5 H5)', () => {
    const tower = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      5,
      5
    );

    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [tower],
        true,
        false,
        1
      )
    ).toBe(true);
  });

  it('does not block ground walk under a L7 stone slab', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      7
    );

    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [roof],
        true,
        false,
        1
      )
    ).toBe(false);
  });

  it('lets eject resolver keep the player under a L7 stone slab', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      7
    );

    const resolved = resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint(
      { x: 10, y: 10, layer: 1 },
      {
        placedBlocks: [roof],
        playerLayer: 1,
        fallbackPosition: { x: 9.2, y: 10, layer: 1 },
      }
    );

    expect(resolved.x).toBeCloseTo(10, 5);
    expect(resolved.y).toBeCloseTo(10, 5);
  });

  it('does not treat a floating L7 roof as an unjumpable jump-path wall', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      7
    );

    expect(
      resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
        { x: 8, y: 10 },
        { x: 1, y: 0 },
        3,
        [roof],
        1,
        7
      )
    ).toBe(3);
  });

  it('allows jump landing on ground under a floating L7 roof', () => {
    const roof = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      7
    );

    expect(
      checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
        10,
        10,
        [roof],
        1
      )
    ).toBe(false);
    expect(
      resolvingWorldBuildingJumpLandableSurfaceLayerAtTileIndex(
        10,
        10,
        [roof],
        1
      )
    ).toBe(1);
    expect(
      resolvingWorldBuildingStandableWalkSurfaceLayerAtTileIndex(10, 10, [roof])
    ).toBe(1);
  });

  it('still blocks jump landing into a solid L7 tower column', () => {
    const tower = creatingElevatedSlab(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      7,
      7
    );

    expect(
      checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
        10,
        10,
        [tower],
        1
      )
    ).toBe(true);
    expect(
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        { x: 10, y: 10, layer: 1 },
        [tower],
        true,
        false,
        1
      )
    ).toBe(true);
  });
});
