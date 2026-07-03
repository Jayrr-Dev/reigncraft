/**
 * Saved plaza tile coordinates for the Save Coords mechanic.
 *
 * @module components/world/domains/definingWorldPlazaSavedCoords
 */

/** Immutable saved tile coordinate on the plaza grid. */
export interface DefiningWorldPlazaSavedCoords {
  /** Stable id for list actions such as delete and track. */
  readonly savedCoordsId: string;
  readonly tileX: number;
  readonly tileY: number;
  /** Unix epoch ms when the coordinate was saved. */
  readonly savedAtMs: number;
}

/**
 * Creates a saved coordinate value object.
 *
 * @param tileX - Saved tile column index.
 * @param tileY - Saved tile row index.
 * @param savedAtMs - Save timestamp from {@link Date.now}.
 * @param savedCoordsId - Optional stable id when hydrating from storage.
 */
export function creatingWorldPlazaSavedCoords(
  tileX: number,
  tileY: number,
  savedAtMs: number,
  savedCoordsId?: string,
): DefiningWorldPlazaSavedCoords {
  return {
    savedCoordsId:
      savedCoordsId ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${tileX}-${tileY}-${savedAtMs}`),
    tileX,
    tileY,
    savedAtMs,
  };
}
