import {
  checkingWorldBuildingDevvitBlockRowIsSession,
  hydratingWorldBuildingSessionBlocksPlot,
} from '@/components/world/building/domains/hydratingWorldBuildingSessionBlocksPlot';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';
import {
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
  WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL,
} from '../../../../shared/worldBuildingDevvit';
import { describe, expect, it } from 'vitest';

describe('hydratingWorldBuildingSessionBlocksPlot', () => {
  const sessionBlockRow = {
    id: 'campfire-session-1',
    plot_id: WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL,
    definition_id: 'utility:campfire',
    tile_x: 12,
    tile_y: 14,
    world_layer: 0,
    owner_id: 'user-1',
    metadata: {
      [WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY]: true,
    },
    placed_at: '1970-01-01T00:00:00.000Z',
  };

  it('detects session rows from plot id and metadata', () => {
    expect(checkingWorldBuildingDevvitBlockRowIsSession(sessionBlockRow)).toBe(
      true,
    );
  });

  it('hydrates session rows into a synthetic plot for rendering', () => {
    const sessionPlot = hydratingWorldBuildingSessionBlocksPlot([
      sessionBlockRow,
    ]);

    expect(sessionPlot).not.toBeNull();
    expect(
      listingWorldBuildingPlacedBlocksFromPlots(
        sessionPlot === null ? [] : [sessionPlot],
      ),
    ).toHaveLength(1);
  });
});
