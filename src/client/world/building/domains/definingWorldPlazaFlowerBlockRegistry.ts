/**
 * Declarative placeable flower patch blocks (one per herb species).
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
  DEFINING_WORLD_PLAZA_FLOWER_PATCH_GROUND_COLOR,
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

function creatingWorldPlazaFlowerPatchPaletteSurface(
  petalColor: number
): ReturnType<typeof creatingWorldBuildingBlockCssPaletteSurface> {
  const petalHex = formattingWorldBuildingBlockSwatchColor(petalColor);
  const groundHex = formattingWorldBuildingBlockSwatchColor(
    DEFINING_WORLD_PLAZA_FLOWER_PATCH_GROUND_COLOR
  );

  return creatingWorldBuildingBlockCssPaletteSurface(
    `radial-gradient(circle at 28% 32%, ${petalHex} 0 14%, transparent 15%), radial-gradient(circle at 68% 40%, ${petalHex} 0 12%, transparent 13%), radial-gradient(circle at 48% 68%, ${petalHex} 0 11%, transparent 12%), ${groundHex}`
  );
}

/**
 * Builds the persisted block definition id for one flower patch.
 */
export function formattingWorldPlazaFlowerBlockDefinitionId(
  speciesId: WorldFlowerSpeciesId
): `decorative:flower:${WorldFlowerSpeciesId}` {
  return `decorative:flower:${speciesId}`;
}

/**
 * True when a block definition id is a per-species flower patch.
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
 * Builds passable flower patch definitions for every herb species.
 */
export function registeringWorldPlazaFlowerBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
    const petalColor =
      DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID[speciesId];
    const definitionId = formattingWorldPlazaFlowerBlockDefinitionId(speciesId);

    definitions[definitionId] = {
      id: definitionId,
      name: DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID[speciesId],
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
      isInteractive: false,
      visualConfig: {
        label: 'Flower',
        fillColor: petalColor,
        strokeColor: darkeningWorldPlazaFlowerBlockStrokeColor(petalColor),
        paletteSurface: creatingWorldPlazaFlowerPatchPaletteSurface(petalColor),
      },
    };
  }

  return definitions;
}
