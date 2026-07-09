import type { DefiningWorldPlazaStoneDecoration } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { formattingWorldPlazaPickedPebbleTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { parsingWorldPlazaInteractablePebbleSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';

/** One pebble whose pick popover was opened by a click. */
export type ListingWorldPlazaPebblesInInteractionRangeEntry = {
  readonly decoration: DefiningWorldPlazaStoneDecoration;
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Lists pebbles whose interaction popover was opened by a click.
 */
export function listingWorldPlazaPebblesInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  pickedPebbleStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedPebbleTileState
  >
): readonly ListingWorldPlazaPebblesInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaPebblesInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractablePebbleSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tileKey = formattingWorldPlazaPickedPebbleTileKey(
      tile.tileX,
      tile.tileY
    );

    if (pickedPebbleStateByTileKey?.get(tileKey)?.isPicked) {
      continue;
    }

    const decoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
      tile.tileX,
      tile.tileY
    );

    if (!decoration || decoration.surfaceWorldLayer !== null) {
      continue;
    }

    entries.push({
      decoration,
      tileX: tile.tileX,
      tileY: tile.tileY,
      targetCenterX: tile.tileX + 0.5,
      targetCenterY: tile.tileY + 0.5,
    });
  }

  return entries;
}
