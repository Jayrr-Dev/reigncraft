import { checkingWorldPlazaLongGrassDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLongGrassDecorationAtTileIndex';
import type { DefiningWorldPlazaClearedLongGrassTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { formattingWorldPlazaClearedLongGrassTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalClearedLongGrass';
import { parsingWorldPlazaInteractableLongGrassSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableLongGrassSelectionKey';

/** One long-grass clump whose search popover was opened by a click. */
export type ListingWorldPlazaLongGrassInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
};

/**
 * Lists long-grass clumps whose interaction popover was opened by a click.
 */
export function listingWorldPlazaLongGrassInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  clearedLongGrassStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaClearedLongGrassTileState
  >
): readonly ListingWorldPlazaLongGrassInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaLongGrassInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableLongGrassSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const tileKey = formattingWorldPlazaClearedLongGrassTileKey(
      tile.tileX,
      tile.tileY
    );

    if (clearedLongGrassStateByTileKey?.get(tileKey)?.isCleared) {
      continue;
    }

    if (
      !checkingWorldPlazaLongGrassDecorationAtTileIndex(tile.tileX, tile.tileY)
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
