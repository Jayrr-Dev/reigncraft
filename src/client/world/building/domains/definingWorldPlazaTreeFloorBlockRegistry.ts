/**
 * Declarative placeable floor blocks for each tree variant species.
 * Walkable floors with plank-stripe palette swatches (no icon fallback).
 *
 * @module components/world/building/domains/definingWorldPlazaTreeFloorBlockRegistry
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { creatingWorldBuildingBlockCssPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import { formattingWorldBuildingBlockSwatchColor } from '@/components/world/building/domains/formattingWorldBuildingBlockSwatchColor';
import {
  type DefiningWorldPlazaTreeVariantKind,
  resolvingWorldPlazaTreeSpeciesForVariant,
} from '@/components/world/domains/definingWorldPlazaTreeConstants';

/** Display order for tree floor swatches in the Materials palette. */
export const DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER: readonly DefiningWorldPlazaTreeVariantKind[] =
  [
    'oak',
    'blossom',
    'willow',
    'acacia',
    'spruce',
    'birch',
    'pine',
    'palm',
    'deadwood',
    'cactus',
  ] as const;

/** Player-facing floor names keyed by tree variant. */
const DEFINING_WORLD_PLAZA_TREE_FLOOR_NAME_BY_VARIANT: Record<
  DefiningWorldPlazaTreeVariantKind,
  string
> = {
  oak: 'Oak',
  blossom: 'Blossom',
  willow: 'Willow',
  acacia: 'Acacia',
  spruce: 'Spruce',
  birch: 'Birch',
  pine: 'Pine',
  palm: 'Palm',
  deadwood: 'Deadwood',
  cactus: 'Cactus',
};

const DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER
);

function darkeningWorldPlazaTreeFloorStrokeColor(fillColor: number): number {
  const red = Math.floor(((fillColor >> 16) & 0xff) * 0.55);
  const green = Math.floor(((fillColor >> 8) & 0xff) * 0.55);
  const blue = Math.floor((fillColor & 0xff) * 0.55);

  return (red << 16) | (green << 8) | blue;
}

function creatingWorldPlazaTreeFloorPaletteSurface(
  trunkColor: number,
  canopyColors: readonly [number, number, number]
): ReturnType<typeof creatingWorldBuildingBlockCssPaletteSurface> {
  const trunkHex = formattingWorldBuildingBlockSwatchColor(trunkColor);
  const [baseCanopy, shadeCanopy, accentCanopy] = canopyColors.map(
    formattingWorldBuildingBlockSwatchColor
  );

  return creatingWorldBuildingBlockCssPaletteSurface(
    `repeating-linear-gradient(180deg, ${accentCanopy} 0 18%, ${baseCanopy} 18% 42%, ${shadeCanopy} 42% 58%, ${trunkHex} 58% 78%, ${baseCanopy} 78% 100%)`
  );
}

/**
 * Builds the persisted block definition id for one tree floor variant.
 */
export function formattingWorldPlazaTreeFloorBlockDefinitionId(
  variant: DefiningWorldPlazaTreeVariantKind
): `basic:floor:tree-${DefiningWorldPlazaTreeVariantKind}` {
  return `basic:floor:tree-${variant}`;
}

/**
 * True when a block definition id is a tree-species floor block.
 */
export function checkingWorldBuildingBlockDefinitionIdIsTreeFloor(
  definitionId: string
): boolean {
  return definitionId.startsWith('basic:floor:tree-');
}

/**
 * Parses tree variant from a tree floor block definition id.
 */
export function resolvingWorldPlazaTreeVariantFromFloorBlockDefinitionId(
  definitionId: string
): DefiningWorldPlazaTreeVariantKind | null {
  if (!checkingWorldBuildingBlockDefinitionIdIsTreeFloor(definitionId)) {
    return null;
  }

  const variant = definitionId.slice('basic:floor:tree-'.length);

  if (!DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_SET.has(variant)) {
    return null;
  }

  return variant as DefiningWorldPlazaTreeVariantKind;
}

/** Exported block id constants (palette order). */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_OAK =
  formattingWorldPlazaTreeFloorBlockDefinitionId('oak');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_BLOSSOM =
  formattingWorldPlazaTreeFloorBlockDefinitionId('blossom');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_WILLOW =
  formattingWorldPlazaTreeFloorBlockDefinitionId('willow');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_ACACIA =
  formattingWorldPlazaTreeFloorBlockDefinitionId('acacia');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_SPRUCE =
  formattingWorldPlazaTreeFloorBlockDefinitionId('spruce');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_BIRCH =
  formattingWorldPlazaTreeFloorBlockDefinitionId('birch');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_PINE =
  formattingWorldPlazaTreeFloorBlockDefinitionId('pine');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_PALM =
  formattingWorldPlazaTreeFloorBlockDefinitionId('palm');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_DEADWOOD =
  formattingWorldPlazaTreeFloorBlockDefinitionId('deadwood');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_TREE_CACTUS =
  formattingWorldPlazaTreeFloorBlockDefinitionId('cactus');

/**
 * Builds walkable floor definitions for every tree variant species.
 */
export function registeringWorldPlazaTreeFloorBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const variant of DEFINING_WORLD_PLAZA_TREE_FLOOR_VARIANT_ORDER) {
    const species = resolvingWorldPlazaTreeSpeciesForVariant(variant);
    const fillColor = species.trunkColor;
    const definitionId =
      formattingWorldPlazaTreeFloorBlockDefinitionId(variant);

    definitions[definitionId] = {
      id: definitionId,
      name: DEFINING_WORLD_PLAZA_TREE_FLOOR_NAME_BY_VARIANT[variant],
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_PASSABLE,
      isInteractive: false,
      visualConfig: {
        label: 'Floor',
        fillColor,
        strokeColor: darkeningWorldPlazaTreeFloorStrokeColor(fillColor),
        paletteSurface: creatingWorldPlazaTreeFloorPaletteSurface(
          species.trunkColor,
          species.canopyColors
        ),
      },
    };
  }

  return definitions;
}
