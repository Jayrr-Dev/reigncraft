/**
 * Declarative walkable wood floors stained with flower dye.
 * Cost is wood + matching flower (see material cost registry).
 *
 * @module components/world/building/domains/definingWorldPlazaDyedWoodFloorBlockRegistry
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { creatingWorldBuildingBlockCssPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER,
} from '@/components/world/building/domains/definingWorldPlazaFlowerDyeConstants';
import { formattingWorldBuildingBlockSwatchColor } from '@/components/world/building/domains/formattingWorldBuildingBlockSwatchColor';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

/** Base plank brown under the flower stain. */
const DEFINING_WORLD_PLAZA_DYED_WOOD_BASE_PLANK_COLOR = 0xb08968;

const DEFINING_WORLD_PLAZA_FLOWER_SPECIES_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER
);

function darkeningWorldPlazaDyedWoodStrokeColor(fillColor: number): number {
  const red = Math.floor(((fillColor >> 16) & 0xff) * 0.55);
  const green = Math.floor(((fillColor >> 8) & 0xff) * 0.55);
  const blue = Math.floor((fillColor & 0xff) * 0.55);

  return (red << 16) | (green << 8) | blue;
}

function blendingWorldPlazaDyedWoodFillColor(dyeColor: number): number {
  const baseRed = (DEFINING_WORLD_PLAZA_DYED_WOOD_BASE_PLANK_COLOR >> 16) & 0xff;
  const baseGreen =
    (DEFINING_WORLD_PLAZA_DYED_WOOD_BASE_PLANK_COLOR >> 8) & 0xff;
  const baseBlue = DEFINING_WORLD_PLAZA_DYED_WOOD_BASE_PLANK_COLOR & 0xff;
  const dyeRed = (dyeColor >> 16) & 0xff;
  const dyeGreen = (dyeColor >> 8) & 0xff;
  const dyeBlue = dyeColor & 0xff;
  const mix = 0.55;

  const red = Math.floor(baseRed * (1 - mix) + dyeRed * mix);
  const green = Math.floor(baseGreen * (1 - mix) + dyeGreen * mix);
  const blue = Math.floor(baseBlue * (1 - mix) + dyeBlue * mix);

  return (red << 16) | (green << 8) | blue;
}

function creatingWorldPlazaDyedWoodPaletteSurface(
  dyeColor: number
): ReturnType<typeof creatingWorldBuildingBlockCssPaletteSurface> {
  const dyeHex = formattingWorldBuildingBlockSwatchColor(dyeColor);
  const baseHex = formattingWorldBuildingBlockSwatchColor(
    DEFINING_WORLD_PLAZA_DYED_WOOD_BASE_PLANK_COLOR
  );
  const shadeHex = formattingWorldBuildingBlockSwatchColor(
    darkeningWorldPlazaDyedWoodStrokeColor(
      blendingWorldPlazaDyedWoodFillColor(dyeColor)
    )
  );

  return creatingWorldBuildingBlockCssPaletteSurface(
    `repeating-linear-gradient(180deg, ${dyeHex} 0 18%, ${baseHex} 18% 42%, ${shadeHex} 42% 58%, ${dyeHex} 58% 78%, ${baseHex} 78% 100%)`
  );
}

/**
 * Builds the persisted block definition id for one flower-stained wood floor.
 */
export function formattingWorldPlazaDyedWoodFloorBlockDefinitionId(
  speciesId: WorldFlowerSpeciesId
): `basic:floor:dyed-${WorldFlowerSpeciesId}` {
  return `basic:floor:dyed-${speciesId}`;
}

/**
 * True when a block definition id is a flower-stained wood floor.
 */
export function checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor(
  definitionId: string
): boolean {
  return definitionId.startsWith('basic:floor:dyed-');
}

/**
 * Parses flower species from a dyed wood floor block definition id.
 */
export function resolvingWorldPlazaFlowerSpeciesIdFromDyedWoodFloorBlockDefinitionId(
  definitionId: string
): WorldFlowerSpeciesId | null {
  if (!checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor(definitionId)) {
    return null;
  }

  const speciesId = definitionId.slice('basic:floor:dyed-'.length);

  if (!DEFINING_WORLD_PLAZA_FLOWER_SPECIES_ID_SET.has(speciesId)) {
    return null;
  }

  return speciesId as WorldFlowerSpeciesId;
}

/**
 * Builds walkable flower-stained plank floors for every herb species.
 */
export function registeringWorldPlazaDyedWoodFloorBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const speciesId of DEFINING_WORLD_PLAZA_FLOWER_DYE_SPECIES_ORDER) {
    const dyeColor =
      DEFINING_WORLD_PLAZA_FLOWER_DYE_COLOR_BY_SPECIES_ID[speciesId];
    const fillColor = blendingWorldPlazaDyedWoodFillColor(dyeColor);
    const definitionId =
      formattingWorldPlazaDyedWoodFloorBlockDefinitionId(speciesId);
    const flowerName =
      DEFINING_WORLD_PLAZA_FLOWER_DYE_NAME_BY_SPECIES_ID[speciesId];

    definitions[definitionId] = {
      id: definitionId,
      name: `${flowerName} wood`,
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FLOORS,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
      isInteractive: false,
      visualConfig: {
        label: 'Floor',
        fillColor,
        strokeColor: darkeningWorldPlazaDyedWoodStrokeColor(fillColor),
        paletteSurface: creatingWorldPlazaDyedWoodPaletteSurface(dyeColor),
      },
    };
  }

  return definitions;
}
