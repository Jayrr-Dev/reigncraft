import {
  listingWorldBuildingCutFootprintSetCells,
  resolvingWorldBuildingCutCellFraction,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";

/**
 * Grid-space axis-aligned squares for cut footprint sub-cells.
 *
 * @module components/world/building/domains/resolvingWorldBuildingCutFootprintGridSquare
 */

/** One filled cut sub-cell expressed as a grid-space square. */
export interface ResolvingWorldBuildingCutFootprintCellGridSquare {
  /** Square center X in grid space. */
  readonly centerGridX: number;
  /** Square center Y in grid space. */
  readonly centerGridY: number;
  /** Half side length in grid tiles. */
  readonly halfExtentGrid: number;
}

/**
 * Resolves the grid-space square for one cut sub-cell.
 *
 * @param tileX - Parent tile column index.
 * @param tileY - Parent tile row index.
 * @param col - Sub-cell column.
 * @param row - Sub-cell row.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function resolvingWorldBuildingCutFootprintCellGridSquare(
  tileX: number,
  tileY: number,
  col: number,
  row: number,
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): ResolvingWorldBuildingCutFootprintCellGridSquare {
  const cellFraction = resolvingWorldBuildingCutCellFraction(axisCellCount);

  return {
    centerGridX: tileX - 0.5 + (col + 0.5) * cellFraction,
    centerGridY: tileY - 0.5 + (row + 0.5) * cellFraction,
    halfExtentGrid: cellFraction / 2,
  };
}

/**
 * Lists grid squares for every filled sub-cell in a cut footprint mask.
 *
 * @param tileX - Parent tile column index.
 * @param tileY - Parent tile row index.
 * @param cutFootprintMask - Cut footprint mask.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function listingWorldBuildingCutFootprintColliderGridSquares(
  tileX: number,
  tileY: number,
  cutFootprintMask: number,
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): ResolvingWorldBuildingCutFootprintCellGridSquare[] {
  return listingWorldBuildingCutFootprintSetCells(
    cutFootprintMask,
    axisCellCount,
  ).map((cell) =>
    resolvingWorldBuildingCutFootprintCellGridSquare(
      tileX,
      tileY,
      cell.col,
      cell.row,
      axisCellCount,
    ),
  );
}
