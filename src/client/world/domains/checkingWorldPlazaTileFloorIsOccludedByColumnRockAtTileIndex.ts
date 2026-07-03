import { checkingWorldPlazaStoneDecorationUsesColumnRockRendering } from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex";

/**
 * Column rock tile detection for collision, surface layers, and entity sync.
 *
 * @module components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex
 */

/**
 * Returns true when a tile hosts a medium or large column rock boulder.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTileHasColumnRockAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY,
  );

  return (
    columnRockMetadata !== null &&
    checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
      columnRockMetadata.sizeTierIndex,
    )
  );
}

/**
 * Returns true when a floor grass diamond should be omitted for a column rock.
 *
 * Floor tiles stay visible under mega-boulders so the footprint keeps the local
 * biome color. Column rocks render on the entity layer above the floor, so the
 * grass does not show through the rock body.
 *
 * @param _tileX - Tile column index.
 * @param _tileY - Tile row index.
 */
export function checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(
  _tileX: number,
  _tileY: number,
): boolean {
  return false;
}
