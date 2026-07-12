import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { indexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex';
import { updatingWorldPlazaEnvironmentalTemperatureSamplingContext } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildingWorldFireDevvitTileKey } from '../../../../shared/worldFireDevvit';

/** Deterministic lava tile used by the mocked lava checker. */
const AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST = {
  tileX: 40,
  tileY: -40,
} as const;

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: (tileX: number, tileY: number) =>
    tileX === AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileX &&
    tileY === AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileY,
}));

describe('averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
      placedBlocksByTile: new Map(),
      litCampfireTileKeys: new Set(),
    });
  });

  it('keeps painted heat-zone tiles at their source temperature', () => {
    const effectiveCelsius =
      resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
        tileX: 9,
        tileY: 9,
        isDaytime: true,
      });

    expect(effectiveCelsius).toBe(58);
  });

  it('warms neighboring tiles toward nearby heat sources', () => {
    const neighborTileX = 7;
    const neighborTileY = 9;
    const rawCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
      });
    const effectiveCelsius =
      resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
      });

    expect(effectiveCelsius).toBeGreaterThan(rawCelsius);
  });

  it('keeps lava tiles at full lava temperature', () => {
    expect(
      resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
        tileX: AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileX,
        tileY: AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileY,
        isDaytime: true,
      })
    ).toBe(DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS);
  });

  it('warms tiles adjacent to lava above their ambient source temperature', () => {
    const neighborTileX = AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileX + 1;
    const neighborTileY = AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileY;
    const rawCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
      });
    const effectiveCelsius =
      averagingWorldPlazaNeighborEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
      });

    expect(effectiveCelsius).toBeGreaterThan(rawCelsius);
    expect(effectiveCelsius).toBeGreaterThan(50);
  });

  it('warms tiles two steps from lava above their ambient source temperature', () => {
    const distantNeighborTileX = AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileX + 2;
    const distantNeighborTileY = AVERAGING_WORLD_PLAZA_LAVA_TILE_TEST.tileY;
    const rawCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: distantNeighborTileX,
        tileY: distantNeighborTileY,
        isDaytime: true,
      });
    const effectiveCelsius =
      resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
        tileX: distantNeighborTileX,
        tileY: distantNeighborTileY,
        isDaytime: true,
      });

    expect(effectiveCelsius).toBeGreaterThan(rawCelsius);
  });

  it('warms tiles adjacent to lit campfires', () => {
    const campfireTileX = 20;
    const campfireTileY = 20;
    const neighborTileX = campfireTileX + 1;
    const neighborTileY = campfireTileY;
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'campfire-test',
        plotId: 'plot-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: { tileX: campfireTileX, tileY: campfireTileY },
        ownerId: 'player-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
      placedBlocksByTile,
      litCampfireTileKeys: new Set([
        buildingWorldFireDevvitTileKey(
          campfireTileX,
          campfireTileY,
          DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
        ),
      ]),
    });

    const rawCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
        placedBlocksByTile,
      });
    const effectiveCelsius =
      resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex({
        tileX: neighborTileX,
        tileY: neighborTileY,
        isDaytime: true,
        placedBlocksByTile,
      });

    expect(
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: campfireTileX,
        tileY: campfireTileY,
        isDaytime: true,
        placedBlocksByTile,
      })
    ).toBe(DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS);
    expect(effectiveCelsius).toBeGreaterThan(rawCelsius);
  });

  it('does not radiate heat from unlit campfires', () => {
    const campfireTileX = 21;
    const campfireTileY = 21;
    const placedBlocksByTile = indexingWorldBuildingPlacedBlocksByTile([
      creatingWorldBuildingPlacedBlock({
        blockId: 'campfire-unlit-test',
        plotId: 'plot-test',
        definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
        tilePosition: { tileX: campfireTileX, tileY: campfireTileY },
        ownerId: 'player-test',
        placedAt: '2026-01-01T00:00:00.000Z',
      }),
    ]);

    updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
      placedBlocksByTile,
      litCampfireTileKeys: new Set(),
    });

    const ambientCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: campfireTileX,
        tileY: campfireTileY,
        isDaytime: true,
      });
    const campfireTileCelsius =
      computingWorldPlazaRawEnvironmentalTemperatureAtTileIndex({
        tileX: campfireTileX,
        tileY: campfireTileY,
        isDaytime: true,
        placedBlocksByTile,
      });

    expect(campfireTileCelsius).toBe(ambientCelsius);
    expect(campfireTileCelsius).not.toBe(
      DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS
    );
  });
});
