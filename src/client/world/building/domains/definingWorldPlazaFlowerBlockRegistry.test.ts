import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingBlockDefinitionIdIsFlowerBlock,
  formattingWorldPlazaFlowerBlockDefinitionId,
  registeringWorldPlazaFlowerBlockDefinitions,
  resolvingWorldPlazaFlowerSpeciesIdFromBlockDefinitionId,
} from '@/components/world/building/domains/definingWorldPlazaFlowerBlockRegistry';
import { DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER } from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaFlowerBlockRegistry', () => {
  it('registers twelve flower patches with palette surfaces', () => {
    const definitions = registeringWorldPlazaFlowerBlockDefinitions();

    expect(Object.keys(definitions)).toHaveLength(12);

    for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
      const definitionId =
        formattingWorldPlazaFlowerBlockDefinitionId(speciesId);
      const definition = definitions[definitionId];

      expect(definition).toBeDefined();
      expect(definition?.category).toBe('decorative');
      expect(definition?.collisionShape).toBe(
        DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE
      );
      expect(
        checkingWorldBuildingBlockDefinitionIdIsFlowerBlock(definitionId)
      ).toBe(true);
      expect(
        resolvingWorldPlazaFlowerSpeciesIdFromBlockDefinitionId(definitionId)
      ).toBe(speciesId);
      expect(definition?.visualConfig.paletteSurface).toBeDefined();
      expect(resolvingWorldBuildingBlockDefinition(definitionId)?.id).toBe(
        definitionId
      );
    }
  });
});
