import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldPlazaNavigationGridNodeWalkableForPlayer } from '@/components/world/navigation/domains/checkingWorldPlazaNavigationGridNodeWalkableForPlayer';
import { resolvingWorldPlazaNavigationPlayerMoveCost } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationPlayerMoveCost';
import { resolvingWorldPlazaNavigationSearchBoundsFromEndpoints } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationSearchBounds';
import { computingNavigationAStarPath } from '@/lib/navigation/computingNavigationAStarPath';
import { describe, expect, it } from 'vitest';

function creatingNavigationTestWallBlock(tileX: number, tileY: number) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `wall-${tileX}-${tileY}`,
    plotId: 'plot-test',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer: 4,
    blockHeight: 4,
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

function creatingNavigationTestRoofBlock(tileX: number, tileY: number) {
  return creatingWorldBuildingPlacedBlock({
    blockId: `roof-${tileX}-${tileY}`,
    plotId: 'plot-test',
    definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer: 4,
    blockHeight: 1,
    ownerId: 'owner-test',
    placedAt: '2026-01-01T00:00:00.000Z',
  });
}

describe('resolvingWorldPlazaNavigationPlayerMoveCost', () => {
  it('marks placed wall tiles impassable', () => {
    const wallBlock = creatingNavigationTestWallBlock(5, 5);

    expect(
      checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
        node: { x: 5, y: 5, layer: 1 },
        playerLayer: 1,
        placedBlocks: [wallBlock],
      })
    ).toBe(false);

    expect(
      checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
        node: { x: 4, y: 5, layer: 1 },
        playerLayer: 1,
        placedBlocks: [wallBlock],
      })
    ).toBe(true);
  });

  it('routes around a placed wall with A*', () => {
    const wallBlock = creatingNavigationTestWallBlock(5, 5);
    const start = { x: 3, y: 5, layer: 1 };
    const goal = { x: 7, y: 5, layer: 1 };
    const searchBounds = resolvingWorldPlazaNavigationSearchBoundsFromEndpoints(
      start,
      goal,
      8
    );
    const resolveMoveCost = resolvingWorldPlazaNavigationPlayerMoveCost({
      playerLayer: 1,
      searchBounds,
      placedBlocks: [wallBlock],
    });

    const result = computingNavigationAStarPath({
      start,
      goal,
      resolveMoveCost,
    });

    expect(result.status).toBe('found');
    expect(result.path.some((node) => node.x === 5 && node.y === 5)).toBe(false);
  });

  it('plans through a roof only when character height fits', () => {
    const roofBlock = creatingNavigationTestRoofBlock(5, 5);

    expect(
      checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
        node: { x: 5, y: 5, layer: 1 },
        playerLayer: 1,
        placedBlocks: [roofBlock],
        playerHeightWorldLayers: 4,
      })
    ).toBe(false);
    expect(
      checkingWorldPlazaNavigationGridNodeWalkableForPlayer({
        node: { x: 5, y: 5, layer: 1 },
        playerLayer: 1,
        placedBlocks: [roofBlock],
        playerHeightWorldLayers: 3.6,
      })
    ).toBe(true);
  });

  it('returns null for moves outside search bounds', () => {
    const resolveMoveCost = resolvingWorldPlazaNavigationPlayerMoveCost({
      playerLayer: 1,
      searchBounds: resolvingWorldPlazaNavigationSearchBoundsFromEndpoints(
        { x: 0, y: 0, layer: 1 },
        { x: 1, y: 0, layer: 1 },
        1
      ),
    });

    expect(resolveMoveCost({ x: 0, y: 0, layer: 1 }, { x: 5, y: 0, layer: 1 })).toBe(
      null
    );
  });
});
