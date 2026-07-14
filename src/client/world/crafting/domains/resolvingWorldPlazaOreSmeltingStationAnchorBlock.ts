import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  listingWorldBuildingPlacedBlocksInFootprintGroup,
  resolvingWorldBuildingBlockPlacementFootprint,
  resolvingWorldBuildingPlacedBlockFootprintGroupId,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { checkingWorldPlazaOreSmeltingStationBlockDefinitionId } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import { formattingWorldPlazaInteractableBlockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableBlockSelectionKey';

/**
 * Resolves the drawable/smelting anchor for a station footprint tile.
 *
 * Satellite clicks and proximity hits still open the anchor station UI.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAnchorBlock
 */

/**
 * Returns the footprint anchor for an ore-smelting station block.
 */
export function resolvingWorldPlazaOreSmeltingStationAnchorBlock(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  block: DefiningWorldBuildingPlacedBlock
): DefiningWorldBuildingPlacedBlock {
  if (!checkingWorldPlazaOreSmeltingStationBlockDefinitionId(block.definitionId)) {
    return block;
  }

  if (!checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
    return block;
  }

  const groupId = resolvingWorldBuildingPlacedBlockFootprintGroupId(block);

  if (!groupId) {
    return block;
  }

  const anchorBlock = placedBlocks.find(
    (candidate) => candidate.blockId === groupId
  );

  return anchorBlock ?? block;
}

/**
 * True when the selection set includes this station (anchor or any satellite tile).
 */
export function checkingWorldPlazaOreSmeltingStationIsSelected(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  anchorBlock: DefiningWorldBuildingPlacedBlock,
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  for (const footprintBlock of listingWorldBuildingPlacedBlocksInFootprintGroup(
    placedBlocks,
    anchorBlock
  )) {
    if (
      selectedInteractableBlockKeys.has(
        formattingWorldPlazaInteractableBlockSelectionKey(footprintBlock)
      )
    ) {
      return true;
    }
  }

  return selectedInteractableBlockKeys.has(
    formattingWorldPlazaInteractableBlockSelectionKey(anchorBlock)
  );
}

/**
 * Footprint center grid point used for proximity and label anchoring.
 */
export function resolvingWorldPlazaOreSmeltingStationFootprintCenterTile(
  block: DefiningWorldBuildingPlacedBlock
): { readonly tileX: number; readonly tileY: number } {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
  const footprint = definition
    ? resolvingWorldBuildingBlockPlacementFootprint(definition)
    : { tileWidth: 1, tileHeight: 1 };

  return {
    tileX: block.tilePosition.tileX + (footprint.tileWidth - 1) * 0.5,
    tileY: block.tilePosition.tileY + (footprint.tileHeight - 1) * 0.5,
  };
}
