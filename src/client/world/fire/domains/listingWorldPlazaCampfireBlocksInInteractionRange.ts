import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaCampfireInteractionTileKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireInteractionTileKey';
import { listingWildlifeRawMeatItemTypeIdsInInventory } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

export type DefiningWorldPlazaCampfireInteractionAction =
  | 'light'
  | 'add-wood'
  | 'cook'
  | 'brew-tea';

/** One campfire block with a visible interaction popover. */
export type ListingWorldPlazaCampfireBlocksInInteractionRangeEntry = {
  readonly block: DefiningWorldBuildingPlacedBlock;
  readonly actions: readonly DefiningWorldPlazaCampfireInteractionAction[];
};

function findingWorldPlazaCampfireFireCellAtBlock(
  block: DefiningWorldBuildingPlacedBlock,
  fireCells: readonly WorldFireDevvitCell[]
): WorldFireDevvitCell | null {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return (
    fireCells.find(
      (cell) =>
        cell.kind === 'campfire' &&
        cell.fuelRemainingMs > 0 &&
        cell.tileX === block.tilePosition.tileX &&
        cell.tileY === block.tilePosition.tileY &&
        cell.worldLayer === worldLayer
    ) ?? null
  );
}

/**
 * Lists campfire blocks whose interaction popover was opened by a click.
 */
export function listingWorldPlazaCampfireBlocksInInteractionRange(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  fireCells: readonly WorldFireDevvitCell[],
  selectedCampfireTileKeys: ReadonlySet<string>,
  inventorySlots: readonly { itemTypeId: string; quantity: number }[] = [],
  hasBrewableTeaPot = false
): readonly ListingWorldPlazaCampfireBlocksInInteractionRangeEntry[] {
  const hasRawMeat =
    listingWildlifeRawMeatItemTypeIdsInInventory(inventorySlots).length > 0;
  const entries: ListingWorldPlazaCampfireBlocksInInteractionRangeEntry[] = [];

  for (const block of placedBlocks) {
    if (
      block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
    ) {
      continue;
    }

    if (
      !selectedCampfireTileKeys.has(
        formattingWorldPlazaCampfireInteractionTileKey(block)
      )
    ) {
      continue;
    }

    const fireCell = findingWorldPlazaCampfireFireCellAtBlock(block, fireCells);
    const actions: DefiningWorldPlazaCampfireInteractionAction[] = fireCell
      ? [
          'add-wood',
          ...(hasRawMeat ? (['cook'] as const) : []),
          ...(hasBrewableTeaPot ? (['brew-tea'] as const) : []),
        ]
      : ['light'];

    entries.push({
      block,
      actions,
    });
  }

  return entries;
}
