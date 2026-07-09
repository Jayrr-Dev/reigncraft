import { resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import {
  applyingWorldPlazaRockMineStateToColumnRockMetadata,
  computingWorldPlazaRockMineableLayerCount,
} from '@/components/world/harvest/domains/applyingWorldPlazaRockMineStateToColumnRockMetadata';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { formattingWorldPlazaMinedRockTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import { parsingWorldPlazaInteractableRockSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';

/** One rock whose mine popover was opened by a click. */
export type ListingWorldPlazaRocksInInteractionRangeEntry = {
  readonly metadata: DefiningWorldPlazaColumnRockMetadata;
  readonly tileX: number;
  readonly tileY: number;
  readonly targetCenterX: number;
  readonly targetCenterY: number;
  readonly remainingMineableLayers: number;
};

/**
 * Lists rocks whose interaction popover was opened by a click.
 */
export function listingWorldPlazaRocksInInteractionRange(
  selectedInteractableKeys: ReadonlySet<string>,
  minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  >
): readonly ListingWorldPlazaRocksInInteractionRangeEntry[] {
  const entries: ListingWorldPlazaRocksInInteractionRangeEntry[] = [];

  for (const selectionKey of selectedInteractableKeys) {
    const tile = parsingWorldPlazaInteractableRockSelectionKey(selectionKey);

    if (!tile) {
      continue;
    }

    const baseMetadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
      tile.anchorTileX,
      tile.anchorTileY
    );

    if (!baseMetadata) {
      continue;
    }

    const metadata = applyingWorldPlazaRockMineStateToColumnRockMetadata(
      baseMetadata,
      minedRockStateByTileKey?.get(
        formattingWorldPlazaMinedRockTileKey(
          tile.anchorTileX,
          tile.anchorTileY
        )
      )
    );

    if (!metadata) {
      continue;
    }

    const remainingMineableLayers =
      computingWorldPlazaRockMineableLayerCount(metadata);

    if (remainingMineableLayers <= 0) {
      continue;
    }

    const footprintCenter =
      resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata(
        metadata
      );

    entries.push({
      metadata,
      tileX: tile.anchorTileX,
      tileY: tile.anchorTileY,
      targetCenterX: footprintCenter.x,
      targetCenterY: footprintCenter.y,
      remainingMineableLayers,
    });
  }

  return entries;
}
