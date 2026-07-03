/**
 * Cut footprint mask: a sub-cell grid describing which parts of a tile a placed
 * block fills. The mask is a bitfield where bit (row * axisCellCount + col) is
 * set when that sub-cell is filled. Supported grid sizes are 2x2, 3x3, 4x4, and 5x5.
 *
 * @module components/world/building/domains/definingWorldBuildingCutFootprintConstants
 */

/** Supported cut grid sizes along each tile axis. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNTS = [2, 3, 4, 5] as const;

/** One supported cut grid axis cell count. */
export type DefiningWorldBuildingCutGridAxisCellCount =
  (typeof DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNTS)[number];

/** Default cut grid size (4x4, backward compatible with existing blocks). */
export const DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT = 4 as const;

/** Legacy alias for the default 4x4 axis cell count. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT =
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;

/** Total sub-cells in the default 4x4 grid. */
export const DEFINING_WORLD_BUILDING_CUT_CELL_COUNT =
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT *
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT;

/** Fraction of a tile that one default-grid sub-cell spans on each axis. */
export const DEFINING_WORLD_BUILDING_CUT_CELL_FRACTION =
  1 / DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT;

/** Mask with every sub-cell filled on the default 4x4 grid. */
export const DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK =
  (1 << DEFINING_WORLD_BUILDING_CUT_CELL_COUNT) - 1;

/** Mask with no sub-cells filled. */
export const DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_EMPTY_MASK = 0;

/** Metadata key persisted on placed blocks for the cut footprint mask. */
export const DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_METADATA_KEY =
  "cutFootprintMask" as const;

/** Metadata key persisted on placed blocks for the cut grid axis cell count. */
export const DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_METADATA_KEY =
  "cutGridAxisCellCount" as const;

/** One filled sub-cell coordinate within a cut grid. */
export interface DefiningWorldBuildingCutFootprintCell {
  /** Column index along +tileX. */
  readonly col: number;
  /** Row index along +tileY. */
  readonly row: number;
}

/**
 * Returns true when the axis cell count is a supported cut grid size.
 *
 * @param axisCellCount - Candidate grid size.
 */
export function checkingWorldBuildingCutGridAxisCellCountSupported(
  axisCellCount: number,
): axisCellCount is DefiningWorldBuildingCutGridAxisCellCount {
  return DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNTS.includes(
    axisCellCount as DefiningWorldBuildingCutGridAxisCellCount,
  );
}

/**
 * Clamps an arbitrary value into a supported cut grid axis cell count.
 *
 * @param candidateAxisCellCount - Raw axis count from UI, metadata, or persistence.
 */
export function normalizingWorldBuildingCutGridAxisCellCount(
  candidateAxisCellCount: number | null | undefined,
): DefiningWorldBuildingCutGridAxisCellCount {
  if (
    typeof candidateAxisCellCount === "number" &&
    checkingWorldBuildingCutGridAxisCellCountSupported(
      Math.floor(candidateAxisCellCount),
    )
  ) {
    return Math.floor(
      candidateAxisCellCount,
    ) as DefiningWorldBuildingCutGridAxisCellCount;
  }

  return DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
}

/**
 * Resolves the total sub-cell count for a cut grid size.
 *
 * @param axisCellCount - Grid size along each tile axis.
 */
export function countingWorldBuildingCutGridCellCount(
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const normalizedAxisCellCount =
    normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);

  return normalizedAxisCellCount * normalizedAxisCellCount;
}

/**
 * Resolves the fraction of a tile that one sub-cell spans on each axis.
 *
 * @param axisCellCount - Grid size along each tile axis.
 */
export function resolvingWorldBuildingCutCellFraction(
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  return 1 / normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);
}

/**
 * Resolves the full mask for a cut grid size (every sub-cell filled).
 *
 * @param axisCellCount - Grid size along each tile axis.
 */
export function resolvingWorldBuildingCutFootprintFullMask(
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const cellCount = countingWorldBuildingCutGridCellCount(axisCellCount);

  return (1 << cellCount) - 1;
}

/**
 * Resolves the bit index for a sub-cell coordinate.
 *
 * @param col - Column index.
 * @param row - Row index.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function resolvingWorldBuildingCutFootprintCellBitIndex(
  col: number,
  row: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const normalizedAxisCellCount =
    normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);

  return row * normalizedAxisCellCount + col;
}

/**
 * Clamps an arbitrary value into a valid mask integer, defaulting to full.
 *
 * @param candidateMask - Raw mask from UI, metadata, or persistence.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function normalizingWorldBuildingCutFootprintMask(
  candidateMask: number | null | undefined,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const fullMask = resolvingWorldBuildingCutFootprintFullMask(axisCellCount);

  if (typeof candidateMask !== "number" || !Number.isFinite(candidateMask)) {
    return fullMask;
  }

  const flooredMask = Math.floor(candidateMask);

  return flooredMask & fullMask;
}

/**
 * Returns true when a sub-cell is filled in the mask.
 *
 * @param mask - Cut footprint mask.
 * @param col - Column index.
 * @param row - Row index.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function checkingWorldBuildingCutFootprintCellSet(
  mask: number,
  col: number,
  row: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): boolean {
  const bitIndex = resolvingWorldBuildingCutFootprintCellBitIndex(
    col,
    row,
    axisCellCount,
  );

  return (mask & (1 << bitIndex)) !== 0;
}

/**
 * Sets one sub-cell in the mask to filled or empty and returns the next mask.
 *
 * @param mask - Current cut footprint mask.
 * @param col - Column index.
 * @param row - Row index.
 * @param shouldSetCell - True to fill the cell, false to clear it.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function applyingWorldBuildingCutFootprintCellState(
  mask: number,
  col: number,
  row: number,
  shouldSetCell: boolean,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const bitIndex = resolvingWorldBuildingCutFootprintCellBitIndex(
    col,
    row,
    axisCellCount,
  );
  const normalizedMask = normalizingWorldBuildingCutFootprintMask(
    mask,
    axisCellCount,
  );
  const cellBit = 1 << bitIndex;

  if (shouldSetCell) {
    return normalizedMask | cellBit;
  }

  return normalizedMask & ~cellBit;
}

/**
 * Toggles one sub-cell in the mask and returns the next mask.
 *
 * @param mask - Current cut footprint mask.
 * @param col - Column index.
 * @param row - Row index.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function togglingWorldBuildingCutFootprintCell(
  mask: number,
  col: number,
  row: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  const bitIndex = resolvingWorldBuildingCutFootprintCellBitIndex(
    col,
    row,
    axisCellCount,
  );

  return (
    normalizingWorldBuildingCutFootprintMask(mask, axisCellCount) ^ (1 << bitIndex)
  );
}

/**
 * Returns the number of filled sub-cells in the mask.
 *
 * @param mask - Cut footprint mask.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function countingWorldBuildingCutFootprintSetCells(
  mask: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): number {
  let normalizedMask = normalizingWorldBuildingCutFootprintMask(
    mask,
    axisCellCount,
  );
  let setCellCount = 0;

  while (normalizedMask !== 0) {
    normalizedMask &= normalizedMask - 1;
    setCellCount += 1;
  }

  return setCellCount;
}

/**
 * Returns true when every sub-cell is filled.
 *
 * @param mask - Cut footprint mask.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function checkingWorldBuildingCutFootprintIsFull(
  mask: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): boolean {
  return (
    normalizingWorldBuildingCutFootprintMask(mask, axisCellCount) ===
    resolvingWorldBuildingCutFootprintFullMask(axisCellCount)
  );
}

/**
 * Returns true when no sub-cell is filled.
 *
 * @param mask - Cut footprint mask.
 */
export function checkingWorldBuildingCutFootprintIsEmpty(mask: number): boolean {
  return mask === DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_EMPTY_MASK;
}

/**
 * Lists filled sub-cells ordered back-to-front for isometric draw order.
 *
 * @param mask - Cut footprint mask.
 * @param axisCellCount - Grid size along each tile axis.
 */
export function listingWorldBuildingCutFootprintSetCells(
  mask: number,
  axisCellCount: number = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
): DefiningWorldBuildingCutFootprintCell[] {
  const normalizedAxisCellCount =
    normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);
  const normalizedMask = normalizingWorldBuildingCutFootprintMask(
    mask,
    normalizedAxisCellCount,
  );
  const cells: DefiningWorldBuildingCutFootprintCell[] = [];

  for (let row = 0; row < normalizedAxisCellCount; row += 1) {
    for (let col = 0; col < normalizedAxisCellCount; col += 1) {
      if (
        checkingWorldBuildingCutFootprintCellSet(
          normalizedMask,
          col,
          row,
          normalizedAxisCellCount,
        )
      ) {
        cells.push({ col, row });
      }
    }
  }

  return cells.sort(
    (leftCell, rightCell) =>
      leftCell.col + leftCell.row - (rightCell.col + rightCell.row),
  );
}
