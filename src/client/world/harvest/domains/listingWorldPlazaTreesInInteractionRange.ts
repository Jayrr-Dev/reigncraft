import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import {
  applyingWorldPlazaTreeChopStateToInstance,
  computingWorldPlazaTreeChoppableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
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
  selectedInteractableKeys: ReadonlySet<string>,
  choppedTreeStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaChoppedTreeTileState
  >
): readonly ListingWorldPlazaTreesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaTreesInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableTreeSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const baseTree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
      tile.tileX,
      tile.tileY,
      placedBlocks
    );

    if (!baseTree) {
      continue;
    }

    const tree = applyingWorldPlazaTreeChopStateToInstance(
      baseTree,
      choppedTreeStateByTileKey?.get(
        formattingWorldPlazaChoppedTreeTileKey(tile.tileX, tile.tileY)
      )
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
