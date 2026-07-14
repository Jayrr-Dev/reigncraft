/**
 * Maps block definitions to palette material icons (Lucide or custom SVG ids).
 *
 * @module components/world/building/domains/resolvingWorldBuildingBlockPaletteMaterialIcon
 */

import {
  BrickWall as BrickWallIcon,
  DoorClosed as DoorClosedIcon,
  Droplets as DropletsIcon,
  Flower2 as Flower2Icon,
  Mountain as MountainIcon,
  PanelTop as PanelTopIcon,
  Signpost as SignpostIcon,
  TreeDeciduous as TreeDeciduousIcon,
  type LucideIcon,
} from 'lucide-react';

import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_DECORATIVE_FLOWER_PATCH,
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC,
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_ROCK_LARGE,
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { checkingWorldBuildingBlockDefinitionIdIsOreWall } from '@/components/world/building/domains/definingWorldPlazaOreWallBlockRegistry';

/** Custom inline SVG ids for blocks without a clear Lucide match. */
export const DEFINING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_ICON_CUSTOM_CHEST =
  'custom:chest' as const;

/** Custom inline SVG ids rendered by the palette material icon component. */
export type DefiningWorldBuildingBlockPaletteMaterialCustomIconId =
  typeof DEFINING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_ICON_CUSTOM_CHEST;

/** Resolved palette material icon source. */
export type DefiningWorldBuildingBlockPaletteMaterialIconSource =
  | {
      readonly kind: 'lucide';
      readonly icon: LucideIcon;
    }
  | {
      readonly kind: 'custom';
      readonly customIconId: DefiningWorldBuildingBlockPaletteMaterialCustomIconId;
    };

/** Fallback Lucide icon when a block has no explicit material mapping. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_FALLBACK_ICON =
  PanelTopIcon;

/** Lucide icon shown per block id in the palette swatch center. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_LUCIDE_ICON_BY_ID: Partial<
  Record<DefiningWorldBuildingBlockDefinitionId, LucideIcon>
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]: TreeDeciduousIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_ROCK_LARGE]: MountainIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM]: DropletsIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE]: BrickWallIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD]: PanelTopIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_DOOR_WOODEN]: DoorClosedIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_SIGN_WOODEN]: SignpostIcon,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_DECORATIVE_FLOWER_PATCH]: Flower2Icon,
};

/** Custom SVG icon shown per block id in the palette swatch center. */
const RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_BY_ID: Partial<
  Record<
    DefiningWorldBuildingBlockDefinitionId,
    DefiningWorldBuildingBlockPaletteMaterialCustomIconId
  >
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_FUNCTIONAL_CHEST_BASIC]:
    DEFINING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_ICON_CUSTOM_CHEST,
};

/**
 * Resolves the material icon source for a block definition id.
 *
 * @param definitionId - Persisted block type id.
 */
export function resolvingWorldBuildingBlockPaletteMaterialIcon(
  definitionId: DefiningWorldBuildingBlockDefinitionId
): DefiningWorldBuildingBlockPaletteMaterialIconSource {
  const customIconId =
    RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_CUSTOM_ICON_BY_ID[
      definitionId
    ];

  if (customIconId) {
    return {
      kind: 'custom',
      customIconId,
    };
  }

  if (
    definitionId === DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_STONE ||
    checkingWorldBuildingBlockDefinitionIdIsOreWall(definitionId)
  ) {
    return {
      kind: 'lucide',
      icon: BrickWallIcon,
    };
  }

  return {
    kind: 'lucide',
    icon:
      RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_LUCIDE_ICON_BY_ID[
        definitionId
      ] ?? RESOLVING_WORLD_BUILDING_BLOCK_PALETTE_MATERIAL_FALLBACK_ICON,
  };
}
