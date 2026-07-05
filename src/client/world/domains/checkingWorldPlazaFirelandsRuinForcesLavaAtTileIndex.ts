import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { computingWorldPlazaFirelandsStructureAnchorTileIndex } from '@/components/world/domains/computingWorldPlazaFirelandsStructureAnchorTileIndex';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MAX,
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MIN,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE,
  DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS,
  DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS,
} from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import { resolvingWorldPlazaFirelandsCentralityAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsCentralityAtTileIndex';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Ruin blueprint placement and forced-lava tiles inside Firelands clusters.
 *
 * @module components/world/domains/checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex
 */

/**
 * Returns true when the tile is a structure spacing anchor for a ruin cluster.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsRuinSpacingAnchorAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const anchorTile = computingWorldPlazaFirelandsStructureAnchorTileIndex(
    tileX,
    tileY
  );

  return anchorTile.tileX === tileX && anchorTile.tileY === tileY;
}

/**
 * Picks a ruin blueprint id for one structure anchor from a stable hash.
 *
 * @param anchorTileX - Ruin anchor column.
 * @param anchorTileY - Ruin anchor row.
 */
function pickingWorldPlazaFirelandsRuinBlueprintIndexAtAnchor(
  anchorTileX: number,
  anchorTileY: number
): number | null {
  if (
    !checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(anchorTileX, anchorTileY)
  ) {
    return null;
  }

  const centrality = resolvingWorldPlazaFirelandsCentralityAtTileIndex(
    anchorTileX,
    anchorTileY
  );

  if (
    centrality < DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MIN ||
    centrality > DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CENTRALITY_MAX
  ) {
    return null;
  }

  const placementRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    7127
  );

  if (placementRoll < 0.34) {
    return null;
  }

  const blueprintRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    9049
  );

  return Math.floor(
    blueprintRoll * DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS.length
  );
}

/**
 * Returns true when the tile should always render as lava inside a ruin blueprint.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsRuinForcesLavaAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return false;
  }

  const cellSize = DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES;
  const anchorOffset =
    DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE;
  const baseAnchorX = Math.floor(tileX / cellSize) * cellSize + anchorOffset;
  const baseAnchorY = Math.floor(tileY / cellSize) * cellSize + anchorOffset;

  for (
    let searchOffsetY =
      -DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
    searchOffsetY <=
    DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
    searchOffsetY += 1
  ) {
    for (
      let searchOffsetX =
        -DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
      searchOffsetX <=
      DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_CELL_SEARCH_RADIUS_CELLS;
      searchOffsetX += 1
    ) {
      const anchorTileX = baseAnchorX + searchOffsetX * cellSize;
      const anchorTileY = baseAnchorY + searchOffsetY * cellSize;
      const blueprintIndex =
        pickingWorldPlazaFirelandsRuinBlueprintIndexAtAnchor(
          anchorTileX,
          anchorTileY
        );

      if (blueprintIndex === null) {
        continue;
      }

      const blueprint =
        DEFINING_WORLD_PLAZA_FIRELANDS_RUIN_BLUEPRINTS[blueprintIndex];
      const offsetTileX = tileX - anchorTileX;
      const offsetTileY = tileY - anchorTileY;

      for (const lavaTile of blueprint.lavaTiles) {
        if (
          lavaTile.offsetTileX === offsetTileX &&
          lavaTile.offsetTileY === offsetTileY
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Resolves a ruin prop blueprint index for one anchor tile, if any.
 *
 * @param anchorTileX - Ruin anchor column.
 * @param anchorTileY - Ruin anchor row.
 */
export function resolvingWorldPlazaFirelandsRuinBlueprintIndexAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number
): number | null {
  return pickingWorldPlazaFirelandsRuinBlueprintIndexAtAnchor(
    anchorTileX,
    anchorTileY
  );
}
