import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { indexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  checkingWorldPlazaWaterIsClimateFrozenAtTileIndex,
  checkingWorldPlazaWaterIsFrozenAtTileIndex,
} from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  resettingWorldPlazaTemperatureDebugOverride,
  settingWorldPlazaTemperatureDebugAmbientOffsetCelsius,
} from '@/components/world/health/domains/managingWorldPlazaTemperatureDebugOverrideStore';
import { afterEach, describe, expect, it } from 'vitest';

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

describe('checkingWorldPlazaWaterIsFrozenAtTileIndex', () => {
  afterEach(() => {
    resettingWorldPlazaTemperatureDebugOverride();
  });

  it('keeps warm-climate water liquid', () => {
    for (let tileY = -80; tileY <= 80; tileY += 1) {
      for (let tileX = -80; tileX <= 80; tileX += 1) {
        if (
          resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) &&
          !checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)
        ) {
          expect(checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)).toBe(
            false
          );
          return;
        }
      }
    }

    throw new Error('Expected at least one warm-climate water tile');
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

  it('freezes warm-climate water when debug ambient offset drops local temp below 0°C', () => {
    let warmWaterTile: { tileX: number; tileY: number } | null = null;

    for (let tileY = -80; tileY <= 80; tileY += 1) {
      for (let tileX = -80; tileX <= 80; tileX += 1) {
        if (
          resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) &&
          !checkingWorldPlazaWaterIsClimateFrozenAtTileIndex(tileX, tileY)
        ) {
          warmWaterTile = { tileX, tileY };
          break;
        }
      }

      if (warmWaterTile) {
        break;
      }
    }

    if (!warmWaterTile) {
      throw new Error('Expected at least one warm-climate water tile');
    }

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY,
        { isDaytime: true }
      )
    ).toBe(false);

    settingWorldPlazaTemperatureDebugAmbientOffsetCelsius(-40);

    expect(
      checkingWorldPlazaWaterIsFrozenAtTileIndex(
        warmWaterTile.tileX,
        warmWaterTile.tileY,
        { isDaytime: true }
      )
    ).toBe(true);
  });
});
