import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor,
  formattingWorldPlazaDyedWoodFloorBlockDefinitionId,
  registeringWorldPlazaDyedWoodFloorBlockDefinitions,
  resolvingWorldPlazaFlowerSpeciesIdFromDyedWoodFloorBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaDyedWoodFloorBlockRegistry';
import { DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER } from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaDyedWoodFloorBlockRegistry', () => {
  it('registers twelve flower-stained wood floors with palette surfaces', () => {
    const definitions = registeringWorldPlazaDyedWoodFloorBlockDefinitions();

    expect(Object.keys(definitions)).toHaveLength(12);

    for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
      const definitionId =
        formattingWorldPlazaDyedWoodFloorBlockDefinitionId(speciesId);
      const definition = definitions[definitionId];

      expect(definition).toBeDefined();
      expect(definition?.category).toBe('floors');
      expect(definition?.collisionShape).toBe(
        DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE
      );
      expect(
        checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor(definitionId)
      ).toBe(true);
      expect(
        resolvingWorldPlazaFlowerSpeciesIdFromDyedWoodFloorBlockDefinitionId(
          definitionId
        )
      ).toBe(speciesId);
      expect(definition?.name).toContain('wood');
      expect(definition?.visualConfig.paletteSurface).toBeDefined();
      expect(resolvingWorldBuildingBlockDefinition(definitionId)?.id).toBe(
        definitionId
      );
    }
  });
});
