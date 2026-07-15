import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingBlockDefinitionIdIsIngotWall,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_GOLD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_IRON,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_STEEL,
  registeringWorldPlazaIngotWallBlockDefinitions,
  resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaIngotWallBlockRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaIngotWallBlockRegistry', () => {
  it('registers six refined metal walls with palette surfaces', () => {
    const definitions = registeringWorldPlazaIngotWallBlockDefinitions();

    expect(Object.keys(definitions)).toHaveLength(6);

    for (const definitionId of [
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_IRON,
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_GOLD,
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_STEEL,
    ]) {
      const definition = definitions[definitionId];

      expect(definition).toBeDefined();
      expect(definition?.category).toBe('refined');
      expect(definition?.collisionShape).toBe(
        DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK
      );
      expect(
        checkingWorldBuildingBlockDefinitionIdIsIngotWall(definitionId)
      ).toBe(true);
      expect(definition?.visualConfig.paletteSurface).toBeDefined();
      expect(resolvingWorldBuildingBlockDefinition(definitionId)?.id).toBe(
        definitionId
      );
    }

    expect(
      resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId(
        DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_IRON
      )
    ).toBe('iron');
  });
});
