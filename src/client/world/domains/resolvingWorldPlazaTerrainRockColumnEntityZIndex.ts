import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_SORT_FORWARD_FRACTION,
} from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { resolvingWorldPlazaIsometricEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex';
import type { DefiningWorldPlazaStoneDecoration } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';

/**
 * Entity-layer depth sort key for procedural terrain rock columns.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainRockColumnEntityZIndex
 */

/**
 * Returns the grid foot used for mega-boulder entity depth sorting.
 *
 * The sort key sits partway between the rear anchor and the front footprint
 * corner so the drawn mass occludes avatars behind the rock without painting
 * over avatars standing clearly in front.
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 * @param footprintTileWidth - Footprint width in tiles.
 * @param footprintTileHeight - Footprint height in tiles.
 */
function resolvingWorldPlazaTerrainRockColumnDepthSortGridPoint(
  anchorTileX: number,
  anchorTileY: number,
  footprintTileWidth: number,
  footprintTileHeight: number
): DefiningWorldPlazaWorldPoint {
  const forwardSpanX = Math.max(0, footprintTileWidth - 1);
  const forwardSpanY = Math.max(0, footprintTileHeight - 1);

  return {
    x:
      anchorTileX +
      forwardSpanX *
        DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_SORT_FORWARD_FRACTION,
    y:
      anchorTileY +
      forwardSpanY *
        DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_SORT_FORWARD_FRACTION,
  };
}

/**
 * Returns the depth-sort grid point for a column-rock's rendered graphics.
 *
 * Exposed so avatar occlusion predicates can compare against the exact same
 * foot the renderer sorts the boulder by. Comparing against the rear anchor
 * instead breaks the walkable pocket behind mega-boulders: an avatar standing
 * there sits deeper than the anchor, the tuck-behind test never fires, and the
 * avatar paints on top of the rock body.
 *
 * @param metadata - Anchor column-rock metadata.
 */
export function resolvingWorldPlazaTerrainRockColumnDepthSortGridPointFromMetadata(
  metadata: DefiningWorldPlazaColumnRockMetadata
): DefiningWorldPlazaWorldPoint {
  return resolvingWorldPlazaTerrainRockColumnDepthSortGridPoint(
    metadata.anchorTileX,
    metadata.anchorTileY,
    metadata.footprintTileWidth,
    metadata.footprintTileHeight
  );
}

/**
 * Returns the z-index for a rock boulder so it interleaves with avatars.
 *
 * Mega-boulders sort from a forward point inside their footprint so the body
 * hides avatars behind it while still losing to avatars clearly south on screen.
 * Avatars standing on a boulder cap still bump above the rock via
 * {@link resolvingWorldPlazaAvatarBodyEntityZIndex}.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placement - Optional resolved decoration or anchor metadata.
 */
export function resolvingWorldPlazaTerrainRockColumnEntityZIndex(
  tileX: number,
  tileY: number,
  placement:
    | DefiningWorldPlazaStoneDecoration
    | DefiningWorldPlazaColumnRockMetadata
    | null = null
): number {
  const anchorTileX =
    placement && 'columnRockAnchorTileX' in placement
      ? (placement.columnRockAnchorTileX ?? tileX)
      : (placement?.anchorTileX ?? tileX);
  const anchorTileY =
    placement && 'columnRockAnchorTileY' in placement
      ? (placement.columnRockAnchorTileY ?? tileY)
      : (placement?.anchorTileY ?? tileY);
  const footprintTileWidth =
    placement && 'columnRockFootprintTileWidth' in placement
      ? (placement.columnRockFootprintTileWidth ?? 1)
      : (placement?.footprintTileWidth ?? 1);
  const footprintTileHeight =
    placement && 'columnRockFootprintTileHeight' in placement
      ? (placement.columnRockFootprintTileHeight ?? 1)
      : (placement?.footprintTileHeight ?? 1);
  const depthSortGridPoint =
    resolvingWorldPlazaTerrainRockColumnDepthSortGridPoint(
      anchorTileX,
      anchorTileY,
      footprintTileWidth,
      footprintTileHeight
    );

  return (
    resolvingWorldPlazaIsometricEntityZIndex(depthSortGridPoint) +
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_DEPTH_BIAS
  );
}
