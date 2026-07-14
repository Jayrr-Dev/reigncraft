import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldBuildingPlacedBlockIsFootprintSatellite } from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { checkingWorldPlazaOreSmeltingStationBlockDefinitionId } from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  checkingWorldPlazaOreSmeltingStationIsSelected,
  resolvingWorldPlazaOreSmeltingStationAnchorBlock,
} from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingStationAnchorBlock';

/**
 * Lists selected ore-smelting stations that should show a Refine label.
 *
 * @module components/world/crafting/domains/listingWorldPlazaOreSmeltingStationsInInteractionRange
 */

export type ListingWorldPlazaOreSmeltingStationsInInteractionRangeEntry = {
  readonly block: DefiningWorldBuildingPlacedBlock;
};

/**
 * Returns unique station anchors whose popover selection is active.
 */
export function listingWorldPlazaOreSmeltingStationsInInteractionRange(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  selectedInteractableBlockKeys: ReadonlySet<string>
): readonly ListingWorldPlazaOreSmeltingStationsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaOreSmeltingStationsInInteractionRangeEntry[] =
    [];
  const seenAnchorBlockIds = new Set<string>();

  for (const block of placedBlocks) {
    if (!checkingWorldPlazaOreSmeltingStationBlockDefinitionId(block.definitionId)) {
      continue;
    }

    if (checkingWorldBuildingPlacedBlockIsFootprintSatellite(block)) {
      continue;
    }

    const anchorBlock = resolvingWorldPlazaOreSmeltingStationAnchorBlock(
      placedBlocks,
      block
    );

    if (seenAnchorBlockIds.has(anchorBlock.blockId)) {
      continue;
    }

    if (
      !checkingWorldPlazaOreSmeltingStationIsSelected(
        placedBlocks,
        anchorBlock,
        selectedInteractableBlockKeys
      )
    ) {
      continue;
    }

    seenAnchorBlockIds.add(anchorBlock.blockId);
    entries.push({ block: anchorBlock });
  }

  return entries;
}
