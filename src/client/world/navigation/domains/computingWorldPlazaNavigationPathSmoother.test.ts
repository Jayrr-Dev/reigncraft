import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { computingWorldPlazaNavigationPathSmoother } from '@/components/world/navigation/domains/computingWorldPlazaNavigationPathSmoother';
import { resolvingWorldPlazaNavigationPlayerMoveCost } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationPlayerMoveCost';
import { resolvingWorldPlazaNavigationSearchBoundsFromEndpoints } from '@/components/world/navigation/domains/resolvingWorldPlazaNavigationSearchBounds';
import type { DefiningNavigationMoveCostResolver } from '@/lib/navigation/definingNavigationGridTypes';
import { describe, expect, it } from 'vitest';

function creatingOpenGridMoveCostResolver(
  blockedNodes: ReadonlySet<string> = new Set()
): DefiningNavigationMoveCostResolver {
  return (from, to) => {
    const toKey = `${to.x},${to.y},${to.layer ?? 0}`;

    if (blockedNodes.has(toKey)) {
      return null;
    }

    const deltaX = Math.abs(to.x - from.x);
    const deltaY = Math.abs(to.y - from.y);

    if (deltaX > 1 || deltaY > 1 || deltaX + deltaY === 0) {
      return null;
    }

    return deltaX !== 0 && deltaY !== 0 ? Math.SQRT2 : 1;
  };
}

function creatingNavigationSmootherWallBlock(tileX: number, tileY: number) {
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

describe('computingWorldPlazaNavigationPathSmoother', () => {
  it('collapses an L-shaped open path to endpoints', () => {
    const path = [
      { x: 0, y: 0, layer: 1 },
      { x: 0, y: 1, layer: 1 },
      { x: 0, y: 2, layer: 1 },
      { x: 1, y: 2, layer: 1 },
      { x: 2, y: 2, layer: 1 },
    ];

    const smoothed = computingWorldPlazaNavigationPathSmoother({
      path,
      resolveMoveCost: creatingOpenGridMoveCostResolver(),
    });

    expect(smoothed).toEqual([
      { x: 0, y: 0, layer: 1 },
      { x: 2, y: 2, layer: 1 },
    ]);
  });

  it('keeps a corner waypoint when line-of-sight is blocked', () => {
    const wallBlock = creatingNavigationSmootherWallBlock(1, 1);
    const start = { x: 0, y: 0, layer: 1 };
    const goal = { x: 2, y: 2, layer: 1 };
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
    const path = [
      { x: 0, y: 0, layer: 1 },
      { x: 0, y: 2, layer: 1 },
      { x: 2, y: 2, layer: 1 },
    ];

    const smoothed = computingWorldPlazaNavigationPathSmoother({
      path,
      resolveMoveCost,
    });

    expect(smoothed.length).toBe(3);
  });
});
