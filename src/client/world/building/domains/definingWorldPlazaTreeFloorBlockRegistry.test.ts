import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingBlockDefinitionIdIsTreeFloor,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_BIRCH,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_CACTUS,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_PINE,
  DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER,
  registeringWorldPlazaTreeFloorBlockDefinitions,
  resolvingWorldPlazaTreeVariantFromFloorBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaTreeFloorBlockRegistry';
import { describe, expect, it } from 'vitest';

const EXPECTED_TREE_FLOOR_IDS = [
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_PINE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_BIRCH,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_CACTUS,
] as const;

describe('definingWorldPlazaTreeFloorBlockRegistry', () => {
  it('registers ten walkable tree floors with palette surfaces', () => {
    const definitions = registeringWorldPlazaTreeFloorBlockDefinitions();

    expect(Object.keys(definitions)).toHaveLength(10);

    for (const variant of DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER) {
      const definitionId = `basic:floor:tree-${variant}`;
      const definition = definitions[definitionId];

      expect(definition).toBeDefined();
      expect(definition?.category).toBe('floors');
      expect(definition?.collisionShape).toBe(
        DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE
      );
      expect(
        checkingWorldBuildingBlockDefinitionIdIsTreeFloor(definitionId)
      ).toBe(true);
      expect(
        resolvingWorldPlazaTreeVariantFromFloorBlockDefinitionId(definitionId)
      ).toBe(variant);
      expect(definition?.visualConfig.paletteSurface).toBeDefined();
      expect(resolvingWorldBuildingBlockDefinition(definitionId)?.id).toBe(
        definitionId
      );
    }
  });

  it('uses oak trunk color for the oak floor swatch', () => {
    const definitions = registeringWorldPlazaTreeFloorBlockDefinitions();

    expect(
      definitions[DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_OAK]
        ?.visualConfig.fillColor
    ).toBe(0x654731);
  });

  it('exports sample ids for palette defaults', () => {
    expect(EXPECTED_TREE_FLOOR_IDS).toContain(
      DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_PINE
    );
  });
});
