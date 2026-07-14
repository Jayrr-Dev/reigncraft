import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldPlazaOreSmeltingStationReachable,
  resolvingWorldPlazaOreSmeltingNearbyStation,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingNearbyStation';
import { describe, expect, it } from 'vitest';

function creatingPlacedStation(
  definitionId: string,
  tileX: number,
  tileY: number,
  blockId = `${definitionId}-${tileX}-${tileY}`
): DefiningWorldBuildingPlacedBlock {
  return {
    blockId,
    plotId: 'plot-1',
    definitionId,
    tilePosition: creatingWorldBuildingTilePosition(tileX, tileY),
    worldLayer: 0,
    blockHeight: 1,
    ownerId: 'owner',
    placedAt: '2026-01-01T00:00:00.000Z',
    metadata: {},
  };
}

describe('resolvingWorldPlazaOreSmeltingNearbyStation', () => {
  it('returns null when no smelting stations are placed', () => {
    expect(
      resolvingWorldPlazaOreSmeltingNearbyStation({
        playerWorldPoint: { x: 10.5, y: 10.5 },
        placedBlocks: [
          creatingPlacedStation(
            DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
            10,
            10
          ),
        ],
      })
    ).toBeNull();
  });

  it('returns the bloomery when the player stands within reach', () => {
    const bloomery = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      10,
      10
    );

    expect(
      resolvingWorldPlazaOreSmeltingNearbyStation({
        playerWorldPoint: { x: 11.2, y: 11.1 },
        placedBlocks: [bloomery],
      })
    ).toBe(bloomery);
  });

  it('ignores stations outside the default player range', () => {
    expect(
      checkingWorldPlazaOreSmeltingStationReachable({
        playerWorldPoint: { x: 10.5, y: 10.5 },
        placedBlocks: [
          creatingPlacedStation(
            DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
            20,
            20
          ),
        ],
      })
    ).toBe(false);
  });

  it('picks the closer of two reachable stations', () => {
    const nearKiln = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
      10,
      10,
      'kiln-near'
    );
    const farBloomery = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      11,
      11,
      'bloomery-far'
    );

    expect(
      resolvingWorldPlazaOreSmeltingNearbyStation({
        playerWorldPoint: { x: 10.2, y: 10.2 },
        placedBlocks: [farBloomery, nearKiln],
      })?.blockId
    ).toBe('kiln-near');
  });
});
