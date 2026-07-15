import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_CENTRALITY_SEARCH_STEP_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_MIN_RADIUS_PADDING_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_VOLCANO_OFFSETS,
} from '@/components/world/domains/definingWorldPlazaBiomeDevTeleportConstants';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES,
  DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_CENTRALITY_MIN,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaFirelandsCentralityAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsCentralityAtTileIndex';
import {
  checkingWorldPlazaFirelandsVolcanoFootprintOccupiesTileAtTileIndex,
  resolvingWorldPlazaFirelandsBlockingPropAtTileIndex,
  resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { checkingWorldPlazaGridPointOccupiesWalkingBlockedTile } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';

/**
 * Dev-only Firelands teleport destination search.
 *
 * @module components/world/domains/findingWorldPlazaFirelandsTeleportWorldPointForDev
 */

/**
 * Returns true when a tile is a safe dev-teleport landing spot in Firelands.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function checkingWorldPlazaFirelandsDevTeleportCandidateAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    checkingWorldPlazaFirelandsVolcanoFootprintOccupiesTileAtTileIndex(
      tileX,
      tileY
    )
  ) {
    return false;
  }

  const blockingProp = resolvingWorldPlazaFirelandsBlockingPropAtTileIndex(
    tileX,
    tileY
  );

  if (blockingProp?.blocksMovement) {
    return false;
  }

  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY);
  const gridPoint: DefiningWorldPlazaWorldPoint = {
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: surfaceLayer,
  };

  if (checkingWorldPlazaGridPointOccupiesWalkingBlockedTile(gridPoint, false)) {
    return false;
  }

  return !checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
    tileX,
    tileY,
    surfaceLayer,
    true
  );
}

/**
 * Converts a tile index into a centered grid-space teleport point.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function buildingWorldPlazaFirelandsDevTeleportWorldPointAtTileIndex(
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
 * Minimum Chebyshev radius where Firelands may appear for teleport search.
 */
function resolvingWorldPlazaFirelandsDevTeleportMinSearchRadiusTiles(): number {
  return (
    DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID +
    DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_MIN_RADIUS_PADDING_TILES
  );
}

/**
 * Tries to land beside a volcano centerpiece outside the spawn clearing.
 */
function findingWorldPlazaFirelandsVolcanoTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  const minRadius =
    resolvingWorldPlazaFirelandsDevTeleportMinSearchRadiusTiles();
  const maxRadius =
    DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
  const cellSize = DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES;
  const anchorOffset =
    DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE;
  const cellMin = Math.floor(-maxRadius / cellSize);
  const cellMax = Math.floor(maxRadius / cellSize);

  for (let cellY = cellMin; cellY <= cellMax; cellY += 1) {
    for (let cellX = cellMin; cellX <= cellMax; cellX += 1) {
      const structureAnchorTileX = cellX * cellSize + anchorOffset;
      const structureAnchorTileY = cellY * cellSize + anchorOffset;

      if (
        Math.max(
          Math.abs(structureAnchorTileX),
          Math.abs(structureAnchorTileY)
        ) < minRadius
      ) {
        continue;
      }

      const volcanoAnchor =
        resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
          structureAnchorTileX,
          structureAnchorTileY
        );

      if (
        !volcanoAnchor ||
        volcanoAnchor.tileX !== structureAnchorTileX ||
        volcanoAnchor.tileY !== structureAnchorTileY
      ) {
        continue;
      }

      for (const offset of DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_VOLCANO_OFFSETS) {
        const landingTileX = volcanoAnchor.tileX + offset.tileX;
        const landingTileY = volcanoAnchor.tileY + offset.tileY;

        if (
          checkingWorldPlazaFirelandsDevTeleportCandidateAtTileIndex(
            landingTileX,
            landingTileY
          )
        ) {
          return buildingWorldPlazaFirelandsDevTeleportWorldPointAtTileIndex(
            landingTileX,
            landingTileY
          );
        }
      }
    }
  }

  return null;
}

/**
 * Walks expanding Chebyshev rings outside the spawn clearing for Firelands.
 */
function findingWorldPlazaFirelandsCentralityTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  const minRadius =
    resolvingWorldPlazaFirelandsDevTeleportMinSearchRadiusTiles();
  const maxRadius =
    DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
  const step =
    DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_CENTRALITY_SEARCH_STEP_TILES;
  let bestTile: { tileX: number; tileY: number; centrality: number } | null =
    null;

  for (let radius = minRadius; radius <= maxRadius; radius += step) {
    for (let offset = -radius; offset <= radius; offset += step) {
      const ringCandidates: readonly {
        tileX: number;
        tileY: number;
      }[] = [
        { tileX: offset, tileY: -radius },
        { tileX: offset, tileY: radius },
        { tileX: -radius, tileY: offset },
        { tileX: radius, tileY: offset },
      ];

      for (const candidate of ringCandidates) {
        if (
          (candidate.tileX === -radius || candidate.tileX === radius) &&
          (candidate.tileY === -radius || candidate.tileY === radius) &&
          offset !== -radius
        ) {
          continue;
        }

        if (
          !checkingWorldPlazaFirelandsDevTeleportCandidateAtTileIndex(
            candidate.tileX,
            candidate.tileY
          )
        ) {
          continue;
        }

        const centrality = resolvingWorldPlazaFirelandsCentralityAtTileIndex(
          candidate.tileX,
          candidate.tileY
        );

        if (centrality <= 0) {
          continue;
        }

        if (!bestTile || centrality > bestTile.centrality) {
          bestTile = {
            tileX: candidate.tileX,
            tileY: candidate.tileY,
            centrality,
          };
        }

        if (
          centrality >= DEFINING_WORLD_PLAZA_FIRELANDS_VOLCANO_CENTRALITY_MIN
        ) {
          return buildingWorldPlazaFirelandsDevTeleportWorldPointAtTileIndex(
            candidate.tileX,
            candidate.tileY
          );
        }
      }
    }

    if (bestTile) {
      return buildingWorldPlazaFirelandsDevTeleportWorldPointAtTileIndex(
        bestTile.tileX,
        bestTile.tileY
      );
    }
  }

  return null;
}

/**
 * Resolves a dev-teleport destination inside the nearest interesting Firelands region.
 *
 * Prefers a walkable tile beside a volcano centerpiece, then falls back to the
 * nearest high-centrality walkable Firelands tile outside the spawn clearing.
 */
export function findingWorldPlazaFirelandsTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  return (
    findingWorldPlazaFirelandsVolcanoTeleportWorldPointForDev() ??
    findingWorldPlazaFirelandsCentralityTeleportWorldPointForDev()
  );
}
