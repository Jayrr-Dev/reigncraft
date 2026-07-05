import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { listingWorldBuildingPlacedBlocksAtTileFromIndex } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { resolvingWorldPlazaTemperatureAreaProfileAtTileIndex } from '@/components/world/health/domains/definingWorldPlazaTemperatureAreaProfiles';
import { listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile } from '@/components/world/health/domains/resolvingWorldPlazaBlockEnvironmentalTemperatureLevel';

export type CheckingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndexParams =
  {
    tileX: number;
    tileY: number;
    placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  };

/**
 * Returns true when a tile owns a heat/cold source that should not be diluted
 * by neighbor averaging (lava, painted zones, temperature blocks).
 */
export function checkingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndex({
  tileX,
  tileY,
  placedBlocksByTile,
}: CheckingWorldPlazaTileHasAssignableEnvironmentalTemperatureSourceAtTileIndexParams): boolean {
  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return true;
  }

  if (resolvingWorldPlazaTemperatureAreaProfileAtTileIndex(tileX, tileY)) {
    return true;
  }

  if (placedBlocksByTile === undefined) {
    return false;
  }

  const placedBlocks = listingWorldBuildingPlacedBlocksAtTileFromIndex(
    placedBlocksByTile,
    tileX,
    tileY
  );

  return (
    listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile(placedBlocks)
      .length > 0
  );
}
