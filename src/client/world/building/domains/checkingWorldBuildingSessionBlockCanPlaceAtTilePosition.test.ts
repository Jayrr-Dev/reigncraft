import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { checkingWorldBuildingSessionBlockCanPlaceAtTilePosition } from '@/components/world/building/domains/checkingWorldBuildingSessionBlockCanPlaceAtTilePosition';
import { DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { describe, expect, it } from 'vitest';

describe('checkingWorldBuildingSessionBlockCanPlaceAtTilePosition', () => {
  const foreignPlot = creatingWorldBuildingPlot({
    plotId: 'plot-foreign',
    ownerId: 'other-user',
    bounds: {
      minTileX: 4,
      minTileY: 4,
      maxTileX: 6,
      maxTileY: 6,
    },
    createdAt: '1970-01-01T00:00:00.000Z',
  });
  const ownedPlot = creatingWorldBuildingPlot({
    plotId: 'plot-owned',
    ownerId: 'user-1',
    bounds: {
      minTileX: 0,
      minTileY: 0,
      maxTileX: 2,
      maxTileY: 2,
    },
    createdAt: '1970-01-01T00:00:00.000Z',
  });

  it('allows campfire placement on unclaimed land', () => {
    expect(
      checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
        [foreignPlot, ownedPlot],
        [],
        { tileX: 10, tileY: 10 },
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        0,
        0,
        DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
      ),
    ).toBe(true);
  });

  it('rejects placement on another players claim', () => {
    expect(
      checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
        [foreignPlot, ownedPlot],
        [],
        { tileX: 5, tileY: 5 },
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        0,
        0,
        DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
      ),
    ).toBe(false);
  });

  it('rejects placement on the actors own claim', () => {
    expect(
      checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
        [foreignPlot, ownedPlot],
        [],
        { tileX: 1, tileY: 1 },
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        0,
        0,
        DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
      ),
    ).toBe(false);
  });
});
