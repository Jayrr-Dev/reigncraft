/**
 * Scans for one herd landmark stand tile near the animal.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeHerdLandmarkTargetPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeHerdLandmarkTileMatches } from '@/components/world/wildlife/domains/checkingWildlifeHerdLandmarkTileMatches';
import {
  DEFINING_WILDLIFE_HERD_LANDMARK_MIN_TRAVEL_GRID,
  DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_MIN_TRAVEL_GRID,
  DEFINING_WILDLIFE_HERD_LANDMARK_SALT,
  DEFINING_WILDLIFE_HERD_LANDMARK_SCAN_RADIUS_GRID,
  type DefiningWildlifeHerdLandmarkKind,
} from '@/components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeWanderRoamArea } from '@/components/world/wildlife/domains/resolvingWildlifeWanderRoamArea';
import { checkingRandomWalkPointWithinArea } from '@/lib/probability/checkingRandomWalkPointWithinArea';

export type ResolvingWildlifeHerdLandmarkTargetPointParams = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly roamAnchor: DefiningWorldPlazaWorldPoint;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly landmarkKind: DefiningWildlifeHerdLandmarkKind;
  readonly pairIndex: number;
};

type ResolvingWildlifeHerdLandmarkCandidate = {
  readonly tileX: number;
  readonly tileY: number;
  readonly distanceGrid: number;
};

function resolvingWildlifeHerdLandmarkMinTravelGrid(
  landmarkKind: DefiningWildlifeHerdLandmarkKind
): number {
  if (landmarkKind === 'pasture') {
    return DEFINING_WILDLIFE_HERD_LANDMARK_PASTURE_MIN_TRAVEL_GRID;
  }

  return DEFINING_WILDLIFE_HERD_LANDMARK_MIN_TRAVEL_GRID;
}

/**
 * Returns a seeded stand point for the landmark kind, or null when nothing
 * matching sits inside the roam envelope within scan range.
 */
export function resolvingWildlifeHerdLandmarkTargetPoint({
  position,
  roamAnchor,
  species,
  landmarkKind,
  pairIndex,
}: ResolvingWildlifeHerdLandmarkTargetPointParams): DefiningWorldPlazaWorldPoint | null {
  const area = resolvingWildlifeWanderRoamArea(roamAnchor, species);
  const originTileX = Math.floor(position.x);
  const originTileY = Math.floor(position.y);
  const minTravelGrid =
    resolvingWildlifeHerdLandmarkMinTravelGrid(landmarkKind);
  const candidates: ResolvingWildlifeHerdLandmarkCandidate[] = [];

  for (
    let radius = Math.ceil(minTravelGrid);
    radius <= DEFINING_WILDLIFE_HERD_LANDMARK_SCAN_RADIUS_GRID;
    radius += 1
  ) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      for (const offsetY of [-radius, radius]) {
        const tileX = originTileX + offsetX;
        const tileY = originTileY + offsetY;
        const point = { x: tileX + 0.5, y: tileY + 0.5 };
        const distanceGrid = Math.hypot(
          point.x - position.x,
          point.y - position.y
        );

        if (distanceGrid < minTravelGrid) {
          continue;
        }

        if (!checkingRandomWalkPointWithinArea(point, area)) {
          // Non-territorial roam envelopes are small (±3). Landmark travel may
          // leave that box so herds can actually reach water / tree lines.
          if (species.territory) {
            continue;
          }
        }

        if (
          !checkingWildlifeHerdLandmarkTileMatches(tileX, tileY, landmarkKind)
        ) {
          continue;
        }

        candidates.push({ tileX, tileY, distanceGrid });
      }
    }

    for (let offsetY = -radius + 1; offsetY <= radius - 1; offsetY += 1) {
      for (const offsetX of [-radius, radius]) {
        const tileX = originTileX + offsetX;
        const tileY = originTileY + offsetY;
        const point = { x: tileX + 0.5, y: tileY + 0.5 };
        const distanceGrid = Math.hypot(
          point.x - position.x,
          point.y - position.y
        );

        if (distanceGrid < minTravelGrid) {
          continue;
        }

        if (!checkingRandomWalkPointWithinArea(point, area)) {
          if (species.territory) {
            continue;
          }
        }

        if (
          !checkingWildlifeHerdLandmarkTileMatches(tileX, tileY, landmarkKind)
        ) {
          continue;
        }

        candidates.push({ tileX, tileY, distanceGrid });
      }
    }

    if (candidates.length > 0) {
      break;
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  const pickRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    originTileX,
    originTileY,
    DEFINING_WILDLIFE_HERD_LANDMARK_SALT + pairIndex * 7 + 3
  );
  const picked =
    candidates[
      Math.min(candidates.length - 1, Math.floor(pickRoll * candidates.length))
    ];

  return {
    x: picked.tileX + 0.5,
    y: picked.tileY + 0.5,
    layer: roamAnchor.layer,
  };
}
