import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD,
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM,
  type DefiningWorldBuildingPlacedBlockTopFaceTextureKind,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlockTopFaceTextureKind';
import { checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor } from '@/components/world/building/domains/definingWorldPlazaDyedWoodFloorBlockRegistry';
import { checkingWorldBuildingBlockDefinitionIdIsIngotWall } from '@/components/world/building/domains/definingWorldPlazaIngotWallBlockRegistry';
import { checkingWorldBuildingBlockDefinitionIdIsOreWall } from '@/components/world/building/domains/definingWorldPlazaOreWallBlockRegistry';
import { checkingWorldBuildingBlockDefinitionIdIsTreeFloor } from '@/components/world/building/domains/definingWorldPlazaTreeFloorBlockRegistry';

/**
 * Maps block definition ids to procedural top-face texture kinds.
 *
 * @module components/world/building/domains/resolvingWorldBuildingPlacedBlockTopFaceTextureKind
 */

/** Top-face texture kind keyed by block definition id. */
const RESOLVING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_BY_DEFINITION_ID: Partial<
  Record<
    DefiningWorldBuildingBlockDefinitionId,
    DefiningWorldBuildingPlacedBlockTopFaceTextureKind
  >
> = {
  [DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD]:
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD,
  [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM]:
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_WATER_STREAM,
};

/**
 * Resolves the procedural top-face texture kind for a block definition id.
 *
 * @param definitionId - Persisted block type id.
 */
export function resolvingWorldBuildingPlacedBlockTopFaceTextureKind(
  definitionId: DefiningWorldBuildingBlockDefinitionId
): DefiningWorldBuildingPlacedBlockTopFaceTextureKind | null {
  if (
    checkingWorldBuildingBlockDefinitionIdIsOreWall(definitionId) ||
    checkingWorldBuildingBlockDefinitionIdIsIngotWall(definitionId)
  ) {
    return DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_ORE_WALL;
  }

  if (
    checkingWorldBuildingBlockDefinitionIdIsTreeFloor(definitionId) ||
    checkingWorldBuildingBlockDefinitionIdIsDyedWoodFloor(definitionId)
  ) {
    return DEFINING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_PINE_WOOD;
  }

  return (
    RESOLVING_WORLD_BUILDING_PLACED_BLOCK_TOP_FACE_TEXTURE_KIND_BY_DEFINITION_ID[
      definitionId
    ] ?? null
  );
}
