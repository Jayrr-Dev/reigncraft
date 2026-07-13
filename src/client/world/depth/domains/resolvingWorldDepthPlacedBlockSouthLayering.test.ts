import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { describe, expect, it } from 'vitest';

function creatingPlacedBlock(
  definitionId:
    | typeof DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD
    | typeof DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
  tileX: number,
  tileY: number,
  worldLayer: number,
  blockHeight: number
) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `${definitionId}-${tileX}-${tileY}-${worldLayer}`,
    plotId: 'plot-test',
    definitionId,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer,
    blockHeight,
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('placed block south layering', () => {
  it('draws avatar in front of pine when standing south on the same tile', () => {
    const pine = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      4
    );
    const pineZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 4);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.35, y: 10.4, layer: 1 },
      { placedBlocks: [pine] }
    );

    expect(bodyZ).toBeGreaterThan(pineZ);
  });

  it('draws avatar in front of pine when standing on its south rim at surface layer', () => {
    const pine = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      4
    );
    const pineZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 4);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.4, y: 10.85, layer: 4 },
      { placedBlocks: [pine] }
    );

    expect(bodyZ).toBeGreaterThan(pineZ);
  });

  it('draws avatar in front of a solid wall when standing south on the same tile', () => {
    const wall = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      10,
      10,
      8,
      8
    );
    const wallZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 8);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.35, y: 10.4, layer: 1 },
      { placedBlocks: [wall] }
    );

    expect(bodyZ).toBeGreaterThan(wallZ);
  });

  it('still tucks under a floating roof on the same tile', () => {
    const roof = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      6,
      1
    );
    const roofZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 6);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.35, y: 10.4, layer: 1 },
      { placedBlocks: [roof] }
    );

    expect(bodyZ).toBeLessThan(roofZ);
  });

  it('still tucks under a low roof with two+ air layers', () => {
    const roof = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      3,
      1
    );
    const roofZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 3);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.35, y: 10.4, layer: 1 },
      { placedBlocks: [roof] }
    );

    expect(bodyZ).toBeLessThan(roofZ);
  });

  it('still tucks behind a pine when standing north of it', () => {
    const pine = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      4
    );
    const pineZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 4);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 9.4, y: 9.4, layer: 1 },
      { placedBlocks: [pine] }
    );

    expect(bodyZ).toBeLessThan(pineZ);
  });

  it('draws avatar in front of ground-flush 1H stone when standing south', () => {
    const stone = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      10,
      10,
      1,
      1
    );
    const stoneZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      1
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.55, y: 10.7, layer: 1 },
      { placedBlocks: [stone] }
    );

    expect(bodyZ).toBeGreaterThan(stoneZ);
  });

  it('draws avatar in front of formerly floated 1H stone (L=2) when standing south', () => {
    const stone = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      10,
      10,
      2,
      1
    );
    const stoneZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      2
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.55, y: 10.7, layer: 1 },
      { placedBlocks: [stone] }
    );

    expect(bodyZ).toBeGreaterThan(stoneZ);
  });

  it('draws avatar in front of floor Half (L=2 H=2) when standing south on flat ground', () => {
    const half = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      2,
      2
    );
    const halfZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      2
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.55, y: 10.7, layer: 1 },
      { placedBlocks: [half] }
    );

    expect(bodyZ).toBeGreaterThan(halfZ);
  });

  it('draws avatar in front of floor Half when standing west on flat ground', () => {
    const half = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      2,
      2
    );
    const halfZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      2
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 9.45, y: 10.55, layer: 1 },
      { placedBlocks: [half] }
    );

    expect(bodyZ).toBeGreaterThan(halfZ);
  });

  it('draws avatar in front when feet sit on the south tip of a floor Block', () => {
    // Grid foot near tile center-south: nameplate above block, feet on south tip.
    const block = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      4
    );
    const blockZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      4
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.5, y: 10.95, layer: 1 },
      { placedBlocks: [block] }
    );

    expect(bodyZ).toBeGreaterThan(blockZ);
  });

  it('uses painted-foot offset when the logical grid anchor is still behind', () => {
    const block = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      4
    );
    const blockZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      4
    );
    const gridPoint = { x: 9.35, y: 9.35, layer: 1 };
    const anchorOnlyBodyZ = resolvingWorldDepthAvatarBodySortKey(gridPoint, {
      placedBlocks: [block],
    });
    const paintedFeetBodyZ = resolvingWorldDepthAvatarBodySortKey(gridPoint, {
      placedBlocks: [block],
      avatarFootOffsetBelowGridAnchorPx: 14,
    });

    expect(anchorOnlyBodyZ).toBeLessThan(blockZ);
    expect(paintedFeetBodyZ).toBeGreaterThan(blockZ);
  });

  it('draws avatar in front of two continuous Half blocks stacked from ground', () => {
    const lowerHalf = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      2,
      2
    );
    const upperHalf = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      4,
      2
    );
    const stackZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
      10,
      10,
      4
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.35, y: 10.4, layer: 1 },
      { placedBlocks: [lowerHalf, upperHalf] }
    );

    expect(bodyZ).toBeGreaterThan(stackZ);
  });

  it('covers avatar with a high floating slab when standing north (top side)', () => {
    const roof = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      6,
      1
    );
    const roofZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 6);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.4, y: 9.4, layer: 1 },
      { placedBlocks: [roof], avatarFootOffsetBelowGridAnchorPx: 14 }
    );

    expect(bodyZ).toBeLessThan(roofZ);
  });

  it('draws avatar in front of a high floating slab when standing south', () => {
    const roof = creatingPlacedBlock(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
      10,
      10,
      6,
      1
    );
    const roofZ = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(10, 10, 6);
    const bodyZ = resolvingWorldDepthAvatarBodySortKey(
      { x: 10.5, y: 11.4, layer: 1 },
      { placedBlocks: [roof], avatarFootOffsetBelowGridAnchorPx: 14 }
    );

    expect(bodyZ).toBeGreaterThan(roofZ);
  });
});
