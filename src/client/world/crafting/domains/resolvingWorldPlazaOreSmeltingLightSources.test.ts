import { creatingWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_RADIUS_SCALE,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingLightConstants';
import { resolvingWorldPlazaOreSmeltingLightSources } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingLightSources';
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

describe('resolvingWorldPlazaOreSmeltingLightSources', () => {
  it('returns no lights when no stations are active', () => {
    expect(
      resolvingWorldPlazaOreSmeltingLightSources(
        [
          creatingPlacedStation(
            DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
            10,
            10
          ),
        ],
        new Set()
      )
    ).toEqual([]);
  });

  it('ignores anvils and inactive smelting stations', () => {
    const bloomery = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
      10,
      10,
      'bloomery-1'
    );
    const anvil = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_ANVIL,
      12,
      12,
      'anvil-1'
    );

    expect(
      resolvingWorldPlazaOreSmeltingLightSources(
        [bloomery, anvil],
        new Set(['anvil-1'])
      )
    ).toEqual([]);
  });

  it('emits one glow centered on each active kiln / stove / bloomery', () => {
    const kiln = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
      10,
      10,
      'kiln-1'
    );
    const stove = creatingPlacedStation(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
      14,
      14,
      'stove-1'
    );

    const lights = resolvingWorldPlazaOreSmeltingLightSources(
      [kiln, stove],
      new Set(['kiln-1', 'stove-1'])
    );

    expect(lights).toHaveLength(2);
    expect(lights[0]).toMatchObject({
      id: 'ore-smelting:kiln-1',
      brightness: DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_BRIGHTNESS,
      radiusScale: DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_RADIUS_SCALE,
    });
    expect(lights[1]?.id).toBe('ore-smelting:stove-1');
  });
});
