import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_STEP_TILES,
} from '@/components/world/domains/definingWorldPlazaBiomeDevTeleportConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { findingWorldPlazaFirelandsTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaFirelandsTeleportWorldPointForDev';
import { findingWorldPlazaFrostsinkTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaFrostsinkTeleportWorldPointForDev';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { checkingWorldPlazaGridPointOccupiesWalkingBlockedTile } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';

/**
 * Dev-only nearest-biome teleport destination search.
 *
 * @module components/world/domains/findingWorldPlazaBiomeTeleportWorldPointForDev
 */

export type FindingWorldPlazaBiomeTeleportWorldPointForDevParams = {
  biomeKind: DefiningWorldPlazaBiomeKind;
  /** Search origin in grid space; defaults to world origin. */
  originWorldPoint?: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'> | null;
};

/**
 * Converts a tile index into a centered grid-space teleport point.
 */
function buildingWorldPlazaBiomeDevTeleportWorldPointAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaWorldPoint {
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY);

  return {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: surfaceLayer,
  };
}

/**
 * Returns true when a tile matches the target biome and is a safe landing spot.
 *
 * Ocean may land on water when no walkable ocean tile exists nearby.
 */
function checkingWorldPlazaBiomeDevTeleportCandidateAtTileIndex(
  tileX: number,
  tileY: number,
  biomeKind: DefiningWorldPlazaBiomeKind,
  allowBlockedWater: boolean
): boolean {
  if (resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind !== biomeKind) {
    return false;
  }

  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY);
  const gridPoint: DefiningWorldPlazaWorldPoint = {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: surfaceLayer,
  };

  const isWalkingBlocked =
    checkingWorldPlazaGridPointOccupiesWalkingBlockedTile(gridPoint, false);

  if (isWalkingBlocked && !allowBlockedWater) {
    return false;
  }

  if (
    checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
      true
    )
  ) {
    return false;
  }

  return true;
}

/**
 * Walks expanding Chebyshev rings and returns the first matching landing tile.
 */
function findingWorldPlazaNearestBiomeTileTeleportWorldPointForDev(
  biomeKind: DefiningWorldPlazaBiomeKind,
  originTileX: number,
  originTileY: number,
  allowBlockedWater: boolean
): DefiningWorldPlazaWorldPoint | null {
  const maxRadius = DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_RADIUS_TILES;
  const step = DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_STEP_TILES;

  for (let radius = 0; radius <= maxRadius; radius += step) {
    if (radius === 0) {
      if (
        checkingWorldPlazaBiomeDevTeleportCandidateAtTileIndex(
          originTileX,
          originTileY,
          biomeKind,
          allowBlockedWater
        )
      ) {
        return buildingWorldPlazaBiomeDevTeleportWorldPointAtTileIndex(
          originTileX,
          originTileY
        );
      }

      continue;
    }

    for (let offset = -radius; offset <= radius; offset += step) {
      const ringCandidates: readonly {
        tileX: number;
        tileY: number;
      }[] = [
        { tileX: originTileX + offset, tileY: originTileY - radius },
        { tileX: originTileX + offset, tileY: originTileY + radius },
        { tileX: originTileX - radius, tileY: originTileY + offset },
        { tileX: originTileX + radius, tileY: originTileY + offset },
      ];

      for (const candidate of ringCandidates) {
        // Skip duplicate corner samples when offset hits ±radius.
        if (
          (candidate.tileX === originTileX - radius ||
            candidate.tileX === originTileX + radius) &&
          (candidate.tileY === originTileY - radius ||
            candidate.tileY === originTileY + radius) &&
          offset !== -radius
        ) {
          continue;
        }

        if (
          checkingWorldPlazaBiomeDevTeleportCandidateAtTileIndex(
            candidate.tileX,
            candidate.tileY,
            biomeKind,
            allowBlockedWater
          )
        ) {
          return buildingWorldPlazaBiomeDevTeleportWorldPointAtTileIndex(
            candidate.tileX,
            candidate.tileY
          );
        }
      }
    }
  }

  return null;
}

/**
 * Resolves a dev-teleport destination in the nearest region of the given biome.
 *
 * Firelands uses the volcano/centrality finder. Other biomes scan outward from
 * the player (or world origin) for the nearest walkable matching tile.
 */
export function findingWorldPlazaBiomeTeleportWorldPointForDev({
  biomeKind,
  originWorldPoint = null,
}: FindingWorldPlazaBiomeTeleportWorldPointForDevParams): DefiningWorldPlazaWorldPoint | null {
  if (biomeKind === 'firelands') {
    return findingWorldPlazaFirelandsTeleportWorldPointForDev();
  }

  if (biomeKind === 'frostsink') {
    return findingWorldPlazaFrostsinkTeleportWorldPointForDev();
  }

  const originTileX = Math.floor(originWorldPoint?.x ?? 0);
  const originTileY = Math.floor(originWorldPoint?.y ?? 0);

  return (
    findingWorldPlazaNearestBiomeTileTeleportWorldPointForDev(
      biomeKind,
      originTileX,
      originTileY,
      false
    ) ??
    (biomeKind === 'ocean'
      ? findingWorldPlazaNearestBiomeTileTeleportWorldPointForDev(
          biomeKind,
          originTileX,
          originTileY,
          true
        )
      : null)
  );
}
