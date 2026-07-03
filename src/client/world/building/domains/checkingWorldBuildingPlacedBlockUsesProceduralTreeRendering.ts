import type { DefiningWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";

/**
 * Identifies placed blocks that render through the procedural tree pipeline.
 *
 * @module components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering
 */

/** Prefix shared by all natural tree block definition ids. */
export const DEFINING_WORLD_BUILDING_NATURAL_TREE_BLOCK_DEFINITION_ID_PREFIX =
  "natural:tree:" as const;

/**
 * Returns true when a block definition id refers to a placeable tree.
 *
 * @param definitionId - Block definition id from the registry.
 */
export function checkingWorldBuildingBlockDefinitionIdIsNaturalTree(
  definitionId: DefiningWorldBuildingBlockDefinitionId,
): boolean {
  return definitionId.startsWith(
    DEFINING_WORLD_BUILDING_NATURAL_TREE_BLOCK_DEFINITION_ID_PREFIX,
  );
}

/**
 * Returns true when a block definition renders via trunk/canopy tree graphics.
 *
 * @param definition - Block type definition.
 */
export function checkingWorldBuildingBlockDefinitionUsesProceduralTreeRendering(
  definition: DefiningWorldBuildingBlockDefinition,
): boolean {
  return checkingWorldBuildingBlockDefinitionIdIsNaturalTree(definition.id);
}

/**
 * Returns true when a placed block renders via trunk/canopy tree graphics.
 *
 * @param block - Placed block entity.
 */
export function checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(
  block: DefiningWorldBuildingPlacedBlock,
): boolean {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  return (
    definition !== null &&
    checkingWorldBuildingBlockDefinitionUsesProceduralTreeRendering(definition)
  );
}
