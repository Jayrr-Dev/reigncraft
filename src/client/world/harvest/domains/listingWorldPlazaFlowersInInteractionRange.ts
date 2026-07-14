import { checkingWorldPlazaPickableFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { formattingWorldPlazaPickedFlowerTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { parsingWorldPlazaInteractableFlowerSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';

/** One biome flower whose pick popover was opened by a click. */
export type ListingWorldPlazaFlowersInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Lists biome flowers whose interaction popover was opened by a click.
 */
export function listingWorldPlazaFlowersInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  pickedFlowerStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
  >
): readonly ListingWorldPlazaFlowersInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaFlowersInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableFlowerSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tileKey = formattingWorldPlazaPickedFlowerTileKey(
      tile.tileX,
      tile.tileY
    );

    if (pickedFlowerStateByTileKey?.get(tileKey)?.isPicked) {
      continue;
    }

    if (
      !checkingWorldPlazaPickableFlowerDecorationAtTileIndex(
        tile.tileX,
        tile.tileY
      )
    ) {
      continue;
    }

    entries.push({
      tileX: tile.tileX,
      tileY: tile.tileY,
      targetCenterX: tile.tileX + 0.5,
      targetCenterY: tile.tileY + 0.5,
    });
  }

  return entries;
}
