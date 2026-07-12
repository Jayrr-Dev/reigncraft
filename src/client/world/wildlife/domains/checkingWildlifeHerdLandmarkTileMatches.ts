/**
 * Tile predicates for herd landmark destinations.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHerdLandmarkTileMatches
 */

import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_BIOME_KINDS,
  type DefiningWildlifeHerdLandmarkKind,
} from '@/components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants';

const DEFINING_WILDLIFE_HERD_LANDMARK_NEIGHBOR_OFFSETS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function checkingWildlifeHerdLandmarkTileIsDryStand(
  tileX: number,
  tileY: number
): boolean {
  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (checkingWorldPlazaTreeBlocksGridTile(tileX, tileY)) {
    return false;
  }

  return true;
}

function checkingWildlifeHerdLandmarkHasNeighbor(
  tileX: number,
  tileY: number,
  predicate: (neighborX: number, neighborY: number) => boolean
): boolean {
  for (const [
    offsetX,
    offsetY,
  ] of DEFINING_WILDLIFE_HERD_LANDMARK_NEIGHBOR_OFFSETS) {
    if (predicate(tileX + offsetX, tileY + offsetY)) {
      return true;
    }
  }

  return false;
}

/** True when the tile is a valid stand point for the requested landmark kind. */
export function checkingWildlifeHerdLandmarkTileMatches(
  tileX: number,
  tileY: number,
  landmarkKind: DefiningWildlifeHerdLandmarkKind
): boolean {
  if (!checkingWildlifeHerdLandmarkTileIsDryStand(tileX, tileY)) {
    return false;
  }

  if (landmarkKind === 'water') {
    return checkingWildlifeHerdLandmarkHasNeighbor(
      tileX,
      tileY,
      (neighborX, neighborY) =>
        Boolean(resolvingWorldPlazaWaterAtTileIndex(neighborX, neighborY))
    );
  }

  if (landmarkKind === 'trees') {
    return checkingWildlifeHerdLandmarkHasNeighbor(
      tileX,
      tileY,
      (neighborX, neighborY) =>
        checkingWorldPlazaTreeBlocksGridTile(neighborX, neighborY)
    );
  }

  const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;

  return DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_BIOME_KINDS.has(biomeKind);
}
