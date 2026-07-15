/**
 * Lists mushrooms whose pick popover was opened by a click.
 *
 * @module components/world/mushrooms/domains/listingWorldPlazaMushroomsInInteractionRange
 */

import { checkingWorldPlazaMushroomDecorationAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomDecorationAtTileIndex';
import {
  formattingWorldPlazaPickedMushroomTileKey,
  type DefiningWorldPlazaPickedMushroomTileState,
} from '@/components/world/mushrooms/domains/managingWorldPlazaLocalPickedMushrooms';
import { parsingWorldPlazaInteractableMushroomSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableMushroomSelectionKey';

export type ListingWorldPlazaMushroomsInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

export function listingWorldPlazaMushroomsInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  pickedMushroomStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedMushroomTileState
  >
): readonly ListingWorldPlazaMushroomsInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaMushroomsInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableMushroomSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tileKey = formattingWorldPlazaPickedMushroomTileKey(
      tile.tileX,
      tile.tileY
    );

    if (pickedMushroomStateByTileKey?.get(tileKey)?.isPicked) {
      continue;
    }

    if (
      !checkingWorldPlazaMushroomDecorationAtTileIndex(tile.tileX, tile.tileY)
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
