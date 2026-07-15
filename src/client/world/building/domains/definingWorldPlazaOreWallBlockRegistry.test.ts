import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_CLAY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COAL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COPPER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_GOLD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_IRON,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_LEAD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_NITER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SCARLET,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SILVER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SULFUR,
  checkingWorldBuildingBlockDefinitionIdIsOreWall,
  registeringWorldPlazaOreWallBlockDefinitions,
} from '@/components/world/building/domains/definingWorldPlazaOreWallBlockRegistry';
import { describe, expect, it } from 'vitest';

const EXPECTED_ORE_WALL_IDS = [
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_CLAY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_IRON,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SILVER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_GOLD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COPPER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COAL,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_NITER,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SCARLET,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_LEAD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SULFUR,
] as const;

describe('definingWorldPlazaOreWallBlockRegistry', () => {
  it('registers ten distinct ore walls with palette surfaces', () => {
    const definitions = registeringWorldPlazaOreWallBlockDefinitions();

    expect(Object.keys(definitions)).toHaveLength(10);

    for (const definitionId of EXPECTED_ORE_WALL_IDS) {
      const definition = definitions[definitionId];

      expect(definition).toBeDefined();
      expect(definition?.category).toBe('ores');
      expect(definition?.collisionShape).toBe(
        DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK
      );
      expect(
        checkingWorldBuildingBlockDefinitionIdIsOreWall(definitionId)
      ).toBe(true);
      expect(definition?.visualConfig.paletteSurface).toBeDefined();
      expect(resolvingWorldBuildingBlockDefinition(definitionId)?.id).toBe(
        definitionId
      );
    }

    expect(
      definitions[DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_CLAY]
        ?.visualConfig.fillColor
    ).toBe(0xc4895a);
    expect(
      definitions[DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SULFUR]
        ?.visualConfig.fillColor
    ).toBe(0x6a6238);
  });
});
