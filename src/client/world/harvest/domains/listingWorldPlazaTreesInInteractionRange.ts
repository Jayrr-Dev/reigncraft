import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { computingWorldPlazaTreeChoppableLayerCount } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import { parsingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';

/** One tree whose chop popover was opened by a click. */
export type ListingWorldPlazaTreesInInteractionRangeEntry = {
  readonly tree: DefiningWorldPlazaTreeInstance;
  readonly tileX: number;
  readonly tileY: number;
  readonly remainingChoppableLayers: number;
};

/**
 * Lists trees whose interaction popover was opened by a click.
 */
export function listingWorldPlazaTreesInInteractionRange(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  selectedInteractableKeys: ReadonlySet<string>
): readonly ListingWorldPlazaTreesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaTreesInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableTreeSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tile.tileX,
      tile.tileY,
      placedBlocks
    );

    if (!tree) {
      continue;
    }

    const remainingChoppableLayers =
      computingWorldPlazaTreeChoppableLayerCount(tree);

    if (remainingChoppableLayers <= 0) {
      continue;
    }

    entries.push({
      tree,
      tileX: tile.tileX,
      tileY: tile.tileY,
      remainingChoppableLayers,
    });
  }

  return entries;
}
