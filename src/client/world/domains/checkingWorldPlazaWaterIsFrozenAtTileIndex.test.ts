import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { indexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  checkingWorldPlazaWaterIsClimateFrozenAtTileIndex,
  checkingWorldPlazaWaterIsFrozenAtTileIndex,
} from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { describe, expect, it } from 'vitest';

function findingWorldPlazaClimateFrozenWaterTileIndexForTest(): {
  tileX: number;
  tileY: number;
} {
  for (let tileY = -500; tileY <= 500; tileY += 1) {
    for (let tileX = -500; tileX <= 500; tileX += 1) {
      if (checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)) {
        return { tileX, tileY };
      }
    }
  }

  throw new Error(
    'Expected at least one climate-frozen water tile in the search window'
  );
}

function findingWorldPlazaWarmClimateWaterTileIndexForTest(): {
  tileX: number;
  tileY: number;
} {
  for (let tileY = -80; tileY <= 80; tileY += 1) {
    for (let tileX = -80; tileX <= 80; tileX += 1) {
      if (
        resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) &&
        !checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)
      ) {
        return { tileX, tileY };
      }
    }
  }

  throw new Error('Expected at least one warm-climate water tile');
}

describe('checkingWorldPlazaWaterIsFrozenAtTileIndex', () => {
  it('keeps warm-climate water liquid without cold sources', () => {
    const warmWaterTile = findingWorldPlazaWarmClimateWaterTileIndexForTest();

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY
      )
    ).toBe(false);
  });

  it('keeps climate-frozen water solid without nearby heat', () => {
    const frozenWaterTile =
      findingWorldPlazaClimateFrozenWaterTileIndexForTest();

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        frozenWaterTile.tileX,
        frozenWaterTile.tileY,
        { isDaytime: true }
      )
    ).toBe(true);
  });

  it('thaws climate-frozen water when a campfire stands on the tile', () => {
    const frozenWaterTile =
      findingWorldPlazaClimateFrozenWaterTileIndexForTest();
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'campfire-thaw-test',
        plotId: 'plot-thaw-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: {
          tileX: frozenWaterTile.tileX,
          tileY: frozenWaterTile.tileY,
        },
        ownerId: 'player-thaw-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        frozenWaterTile.tileX,
        frozenWaterTile.tileY,
        { isDaytime: true, placedBlocksByTile }
      )
    ).toBe(false);
  });

  it('thaws climate-frozen water beside a campfire', () => {
    const frozenWaterTile =
      findingWorldPlazaClimateFrozenWaterTileIndexForTest();
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'campfire-thaw-neighbor-test',
        plotId: 'plot-thaw-neighbor-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: {
          tileX: frozenWaterTile.tileX + 1,
          tileY: frozenWaterTile.tileY,
        },
        ownerId: 'player-thaw-neighbor-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        frozenWaterTile.tileX,
        frozenWaterTile.tileY,
        { isDaytime: true, placedBlocksByTile }
      )
    ).toBe(false);
  });

  it('freezes warm-climate water when an ice block stands on the tile', () => {
    const warmWaterTile = findingWorldPlazaWarmClimateWaterTileIndexForTest();
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'ice-freeze-test',
        plotId: 'plot-freeze-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK,
        tilePosition: {
          tileX: warmWaterTile.tileX,
          tileY: warmWaterTile.tileY,
        },
        ownerId: 'player-freeze-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY,
        { isDaytime: true, placedBlocksByTile }
      )
    ).toBe(true);
  });

  it('freezes warm-climate water beside an ice block', () => {
    const warmWaterTile = findingWorldPlazaWarmClimateWaterTileIndexForTest();
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'ice-freeze-neighbor-test',
        plotId: 'plot-freeze-neighbor-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK,
        tilePosition: {
          tileX: warmWaterTile.tileX + 1,
          tileY: warmWaterTile.tileY,
        },
        ownerId: 'player-freeze-neighbor-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY,
        { isDaytime: true, placedBlocksByTile }
      )
    ).toBe(true);
  });

  it('lets campfire heat win over ice when both sit in the ring', () => {
    const warmWaterTile = findingWorldPlazaWarmClimateWaterTileIndexForTest();
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'ice-vs-fire-ice',
        plotId: 'plot-ice-vs-fire',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ICE_BLOCK,
        tilePosition: {
          tileX: warmWaterTile.tileX,
          tileY: warmWaterTile.tileY,
        },
        ownerId: 'player-ice-vs-fire',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
      creatingWorldBuildingPlacedBlock({
        blockId: 'ice-vs-fire-campfire',
        plotId: 'plot-ice-vs-fire',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: {
          tileX: warmWaterTile.tileX + 1,
          tileY: warmWaterTile.tileY,
        },
        ownerId: 'player-ice-vs-fire',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY,
        { isDaytime: true, placedBlocksByTile }
      )
    ).toBe(false);
  });
});
