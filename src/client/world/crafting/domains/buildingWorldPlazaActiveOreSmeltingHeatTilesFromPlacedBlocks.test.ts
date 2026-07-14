import { creatingWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY,
  DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks } from '@/components/world/crafting/domains/buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks';
import { formattingWorldPlazaActiveOreSmeltingHeatTileKey } from '@/components/world/crafting/domains/managingWorldPlazaActiveOreSmeltingHeatTilesStore';
import {
  computingWorldPlazaOreSmeltingAdjacentTemperatureCelsius,
  DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { describe, expect, it } from 'vitest';

describe('buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks', () => {
  it('paints footprint tiles plus one Chebyshev ring while smelting', () => {
    const heatCelsiusByTile =
      buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks(
        [
          creatingWorldBuildingPlacedBlock({
            blockId: 'kiln-anchor',
            plotId: 'plot-test',
            definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
            tilePosition: { tileX: 10, tileY: 10 },
            ownerId: 'player-test',
            placedAt: '2026-01-01T00:00:00.000Z',
            metadata: {
              [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
                'kiln-anchor',
              [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
                DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_ANCHOR,
            },
          }),
          creatingWorldBuildingPlacedBlock({
            blockId: 'kiln-anchor:fp:11:10',
            plotId: 'plot-test',
            definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
            tilePosition: { tileX: 11, tileY: 10 },
            ownerId: 'player-test',
            placedAt: '2026-01-01T00:00:00.000Z',
            metadata: {
              [DEFINING_WORLD_BUILDING_FOOTPRINT_GROUP_ID_METADATA_KEY]:
                'kiln-anchor',
              [DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_METADATA_KEY]:
                DEFINING_WORLD_BUILDING_FOOTPRINT_ROLE_SATELLITE,
            },
          }),
        ],
        new Set(['kiln-anchor'])
      );
    const adjacentCelsius =
      computingWorldPlazaOreSmeltingAdjacentTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS
      );

    expect(
      heatCelsiusByTile.get(
        formattingWorldPlazaActiveOreSmeltingHeatTileKey(10, 10)
      )
    ).toBe(DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS);
    expect(
      heatCelsiusByTile.get(
        formattingWorldPlazaActiveOreSmeltingHeatTileKey(11, 10)
      )
    ).toBe(DEFINING_WORLD_PLAZA_TEMPERATURE_ORE_SMELTING_CELSIUS);
    expect(
      heatCelsiusByTile.get(
        formattingWorldPlazaActiveOreSmeltingHeatTileKey(9, 10)
      )
    ).toBe(adjacentCelsius);
    expect(
      heatCelsiusByTile.has(
        formattingWorldPlazaActiveOreSmeltingHeatTileKey(10, 12)
      )
    ).toBe(false);
  });

  it('ignores inactive stations', () => {
    const heatCelsiusByTile =
      buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks(
        [
          creatingWorldBuildingPlacedBlock({
            blockId: 'bloomery-1',
            plotId: 'plot-test',
            definitionId: DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
            tilePosition: { tileX: 4, tileY: 5 },
            ownerId: 'player-test',
            placedAt: '2026-01-01T00:00:00.000Z',
          }),
        ],
        new Set()
      );

    expect(heatCelsiusByTile.size).toBe(0);
  });
});
