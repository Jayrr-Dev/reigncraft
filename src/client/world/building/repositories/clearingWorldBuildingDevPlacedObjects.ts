/**
 * Clears every persisted world building plot and placed block (development only).
 *
 * @module components/world/building/repositories/clearingWorldBuildingDevPlacedObjects
 */

/** Dev-only API route for wiping all world building persistence. */
const CLEARING_WORLD_BUILDING_DEV_PLACED_OBJECTS_API_PATH =
  "/api/world/building/dev/clear-all" as const;

/** Successful clear response payload. */
export interface ClearingWorldBuildingDevPlacedObjectsResult {
  deletedPlotCount: number;
  deletedBlockCount: number;
}

/**
 * Deletes all rows from `world_plots` and `world_placed_blocks` via the dev API.
 */
export async function clearingWorldBuildingDevPlacedObjects(): Promise<ClearingWorldBuildingDevPlacedObjectsResult> {
  const response = await fetch(CLEARING_WORLD_BUILDING_DEV_PLACED_OBJECTS_API_PATH, {
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? "Could not clear world building plots and blocks.");
  }

  return (await response.json()) as ClearingWorldBuildingDevPlacedObjectsResult;
}
