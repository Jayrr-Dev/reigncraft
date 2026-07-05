import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { computingWorldPlazaFirelandsStructureAnchorTileIndex } from '@/components/world/domains/computingWorldPlazaFirelandsStructureAnchorTileIndex';
import { DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
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

/** Max Chebyshev radius scanned from the plaza origin. */
const FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES = 2800;

/** Step size while scanning for a Firelands region. */
const FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_STEP_TILES = 32;

/** Tile offsets tried around a volcano anchor before falling back. */
const FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_VOLCANO_OFFSETS: readonly {
  readonly tileX: number;
  readonly tileY: number;
}[] = [
  { tileX: 5, tileY: 0 },
  { tileX: -5, tileY: 0 },
  { tileX: 0, tileY: 5 },
  { tileX: 0, tileY: -5 },
  { tileX: 4, tileY: 4 },
  { tileX: -4, tileY: 4 },
];

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
 * Tries to land beside a volcano centerpiece in the Firelands search window.
 */
function findingWorldPlazaFirelandsVolcanoTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  const minRadius =
    DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID + 16;

  for (
    let tileY = -FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
    tileY <= FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
    tileY += FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_STEP_TILES
  ) {
    for (
      let tileX =
        -FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
      tileX <= FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
      tileX += FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_STEP_TILES
    ) {
      if (Math.max(Math.abs(tileX), Math.abs(tileY)) < minRadius) {
        continue;
      }

      const structureAnchor =
        computingWorldPlazaFirelandsStructureAnchorTileIndex(tileX, tileY);
      const volcanoAnchor =
        resolvingWorldPlazaFirelandsVolcanoAnchorAtTileIndex(
          structureAnchor.tileX,
          structureAnchor.tileY
        );

      if (
        !volcanoAnchor ||
        volcanoAnchor.tileX !== structureAnchor.tileX ||
        volcanoAnchor.tileY !== structureAnchor.tileY
      ) {
        continue;
      }

      for (const offset of FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_VOLCANO_OFFSETS) {
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
 * Finds a high-centrality Firelands tile when no volcano landing is available.
 */
function findingWorldPlazaFirelandsCentralityTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  const minRadius =
    DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID + 16;
  let bestTile: { tileX: number; tileY: number; centrality: number } | null =
    null;

  for (
    let tileY = -FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
    tileY <= FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
    tileY += 8
  ) {
    for (
      let tileX =
        -FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
      tileX <= FINDING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES;
      tileX += 8
    ) {
      if (Math.max(Math.abs(tileX), Math.abs(tileY)) < minRadius) {
        continue;
      }

      if (
        !checkingWorldPlazaFirelandsDevTeleportCandidateAtTileIndex(
          tileX,
          tileY
        )
      ) {
        continue;
      }

      const centrality = resolvingWorldPlazaFirelandsCentralityAtTileIndex(
        tileX,
        tileY
      );

      if (centrality <= 0) {
        continue;
      }

      if (!bestTile || centrality > bestTile.centrality) {
        bestTile = { tileX, tileY, centrality };
      }
    }
  }

  if (!bestTile) {
    return null;
  }

  return buildingWorldPlazaFirelandsDevTeleportWorldPointAtTileIndex(
    bestTile.tileX,
    bestTile.tileY
  );
}

/**
 * Resolves a dev-teleport destination inside the nearest interesting Firelands region.
 *
 * Prefers a walkable tile beside a volcano centerpiece, then falls back to the
 * highest-centrality walkable Firelands tile in the search window.
 */
export function findingWorldPlazaFirelandsTeleportWorldPointForDev(): DefiningWorldPlazaWorldPoint | null {
  return (
    findingWorldPlazaFirelandsVolcanoTeleportWorldPointForDev() ??
    findingWorldPlazaFirelandsCentralityTeleportWorldPointForDev()
  );
}
