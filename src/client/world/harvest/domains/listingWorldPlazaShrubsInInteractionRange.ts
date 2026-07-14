import { checkingWorldPlazaShrubDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaShrubDecorationAtTileIndex';
import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { formattingWorldPlazaPickedShrubTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';
import { parsingWorldPlazaInteractableShrubSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableShrubSelectionKey';

/** One berry shrub whose pick popover was opened by a click. */
export type ListingWorldPlazaShrubsInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Lists unpicked berry shrubs whose interaction popover was opened by a click.
 */
export function listingWorldPlazaShrubsInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  pickedShrubStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedShrubTileState
  >
): readonly ListingWorldPlazaShrubsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaShrubsInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableShrubSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tileKey = formattingWorldPlazaPickedShrubTileKey(
      tile.tileX,
      tile.tileY
    );

    if (pickedShrubStateByTileKey?.get(tileKey)?.isPicked) {
      continue;
    }

    if (checkingWorldPlazaRuntimeShrubIsPicked(tile.tileX, tile.tileY)) {
      continue;
    }

    if (!checkingWorldPlazaShrubDecorationAtTileIndex(tile.tileX, tile.tileY)) {
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
