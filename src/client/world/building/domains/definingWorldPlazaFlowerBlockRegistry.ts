/**
 * Declarative placeable solid flower-dye blocks (one per herb species).
 * Cost is wood + matching flower (see material cost registry).
 *
 * @module components/world/building/domains/definingWorldPlazaFlowerBlockRegistry
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { creatingWorldBuildingBlockCssPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER,
} from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import { formattingWorldBuildingBlockSwatchColor } from '@/components/world/building/domains/formattingWorldBuildingBlockSwatchColor';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

const DEFINING_WORLD_PLAZA_FLOWER_SPECIES_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER
);

function darkeningWorldPlazaFlowerBlockStrokeColor(fillColor: number): number {
  const red = Math.floor(((fillColor >> 16) & 0xff) * 0.55);
  const green = Math.floor(((fillColor >> 8) & 0xff) * 0.55);
  const blue = Math.floor((fillColor & 0xff) * 0.55);

  return (red << 16) | (green << 8) | blue;
}

/**
 * Builds the persisted block definition id for one flower dye block.
 */
export function formattingWorldPlazaFlowerBlockDefinitionId(
  speciesId: WorldFlowerSpeciesId
): `decorative:flower:${WorldFlowerSpeciesId}` {
  return `decorative:flower:${speciesId}`;
}

/**
 * True when a block definition id is a per-species flower dye block.
 */
export function checkingWorldBuildingBlockDefinitionIdIsFlowerBlock(
  definitionId: string
): boolean {
  return (
    definitionId.startsWith('decorative:flower:') &&
    definitionId !== 'decorative:flower:patch'
  );
}

/**
 * Parses flower species from a flower block definition id.
 */
export function resolvingWorldPlazaFlowerSpeciesIdFromBlockDefinitionId(
  definitionId: string
): WorldFlowerSpeciesId | null {
  if (!checkingWorldBuildingBlockDefinitionIdIsFlowerBlock(definitionId)) {
    return null;
  }

  const speciesId = definitionId.slice('decorative:flower:'.length);

  if (!DEFINING_WORLD_PLAZA_FLOWER_SPECIES_ID_SET.has(speciesId)) {
    return null;
  }

  return speciesId as WorldFlowerSpeciesId;
}

/**
 * Builds passable solid-color dye blocks for every herb species.
 */
export function registeringWorldPlazaFlowerBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
    const fillColor =
      DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID[speciesId];
    const definitionId = formattingWorldPlazaFlowerBlockDefinitionId(speciesId);
    const petalHex = formattingWorldBuildingBlockSwatchColor(fillColor);

    definitions[definitionId] = {
      id: definitionId,
      name: DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID[speciesId],
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
      isInteractive: false,
      visualConfig: {
        label: 'Block',
        fillColor,
        strokeColor: darkeningWorldPlazaFlowerBlockStrokeColor(fillColor),
        paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(petalHex),
      },
    };
  }

  return definitions;
}
