/**
 * Placement failure reasons for the building domain.
 *
 * @module components/world/building/domains/definingWorldBuildingPlacementError
 */

/** Placement was rejected because the tile is already occupied. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED =
  "tileOccupied" as const;

/** Placement was rejected because the tile is outside the plot. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_OUTSIDE_PLOT =
  "outsidePlot" as const;

/** Placement was rejected because the actor does not own the plot. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NOT_PLOT_OWNER =
  "notPlotOwner" as const;

/** Placement was rejected because the plot reached its block cap. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_PLOT_BLOCK_LIMIT =
  "plotBlockLimit" as const;

/** Placement was rejected because the block definition id is unknown. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION =
  "unknownDefinition" as const;

/** Placement was rejected because no plot was found for the tile. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT = "noPlot" as const;

/** Placement was rejected because block height exceeds the anchor layer. */
export const DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_BLOCK_HEIGHT_EXCEEDS_LAYER =
  "blockHeightExceedsLayer" as const;

/** Typed placement failure codes. */
export type DefiningWorldBuildingPlacementErrorCode =
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_TILE_OCCUPIED
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_OUTSIDE_PLOT
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NOT_PLOT_OWNER
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_PLOT_BLOCK_LIMIT
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_UNKNOWN_DEFINITION
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_NO_PLOT
  | typeof DEFINING_WORLD_BUILDING_PLACEMENT_ERROR_BLOCK_HEIGHT_EXCEEDS_LAYER;

/** Domain-level placement failure. */
export interface DefiningWorldBuildingPlacementError {
  readonly code: DefiningWorldBuildingPlacementErrorCode;
  readonly message: string;
}

/** Discriminated union for placement attempts. */
export type DefiningWorldBuildingPlacementResult<TValue> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: DefiningWorldBuildingPlacementError };

/**
 * Wraps a successful placement result.
 *
 * @param value - Created entity or aggregate state.
 */
export function succeedingWorldBuildingPlacement<TValue>(
  value: TValue,
): DefiningWorldBuildingPlacementResult<TValue> {
  return { ok: true, value };
}

/**
 * Wraps a failed placement result.
 *
 * @param error - Placement failure details.
 */
export function failingWorldBuildingPlacement<TValue>(
  error: DefiningWorldBuildingPlacementError,
): DefiningWorldBuildingPlacementResult<TValue> {
  return { ok: false, error };
}
