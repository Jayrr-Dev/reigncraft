/**
 * Seeded landmark kind pick for one herd travel leg.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeHerdLandmarkKind
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_HERD_LANDMARK_KIND_WEIGHTS,
  DEFINING_WILDLIFE_HERD_LANDMARK_SALT,
  type DefiningWildlifeHerdLandmarkKind,
} from '@/components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants';

export type ResolvingWildlifeHerdLandmarkKindParams = {
  readonly tileX: number;
  readonly tileY: number;
  readonly pairIndex: number;
};

/**
 * Picks water, trees, or pasture from declarative weights. Stable for one
 * rest/travel pair so the whole herd shares the same destination kind.
 */
export function resolvingWildlifeHerdLandmarkKind({
  tileX,
  tileY,
  pairIndex,
}: ResolvingWildlifeHerdLandmarkKindParams): DefiningWildlifeHerdLandmarkKind {
  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_HERD_LANDMARK_SALT + pairIndex * 5 + 1
  );

  let cumulative = 0;

  for (const [kind, weight] of Object.entries(
    DEFINING_WILDLIFE_HERD_LANDMARK_KIND_WEIGHTS
  ) as [DefiningWildlifeHerdLandmarkKind, number][]) {
    cumulative += weight;

    if (roll < cumulative) {
      return kind;
    }
  }

  return 'pasture';
}
