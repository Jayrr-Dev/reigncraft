import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { checkingWorldPlazaNavigationPathNeedsReplan } from '@/components/world/navigation/domains/checkingWorldPlazaNavigationPathNeedsReplan';
import { DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT } from '@/components/world/navigation/domains/definingWorldPlazaNavigationConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaNavigationPathNeedsReplan', () => {
  it('replans after enough stuck frames', () => {
    expect(
      checkingWorldPlazaNavigationPathNeedsReplan({
        remainingWaypoints: [{ x: 3, y: 4, layer: 1 }],
        placedBlocks: [],
        previousPlacedBlockIds: new Set(),
        stuckFrameCount: DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT,
        stuckFrameThreshold: DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT,
      })
    ).toBe(true);
  });

  it('replans when a new block appears on the remaining path', () => {
    const placedBlock = creatingWorldBuildingPlacedBlock({
      blockId: 'new-wall',
      plotId: 'plot-test',
      definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
      tilePosition: creatingWorldBuildingTilePosition(5, 5),
      worldLayer: 4,
      blockHeight: 4,
      ownerId: 'owner-test',
      placedAt: '2026-01-01T00:00:00.000Z',
    });

    expect(
      checkingWorldPlazaNavigationPathNeedsReplan({
        remainingWaypoints: [{ x: 5, y: 5, layer: 1 }],
        placedBlocks: [placedBlock],
        previousPlacedBlockIds: new Set(),
        stuckFrameCount: 0,
        stuckFrameThreshold: DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT,
      })
    ).toBe(true);
  });
});
