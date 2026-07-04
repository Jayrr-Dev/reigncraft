/**
 * Saved plaza coordinates persistence and query tuning.
 *
 * @module components/world/domains/definingWorldPlazaSavedCoordsConstants
 */

/** Maximum number of saved coordinate slots per player. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_MAX_COUNT = 3 as const;

/** localStorage key for the player's saved plaza tiles. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY =
  "world-plaza-saved-coords" as const;

/**
 * Resolves the localStorage key for saved plaza coordinates.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaSavedCoordsStorageKey(
  storageOwnerId: string | null,
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_SAVED_COORDS_STORAGE_KEY;
}

/** TanStack Query root key for saved plaza coordinates. */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_KEY_ROOT =
  "world-plaza-saved-coords" as const;

/** TanStack Query stale time for saved coordinates (ms). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_QUERY_STALE_TIME_MS = Infinity;

/** Screen-space distance below which the track arrow hides (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARRIVAL_THRESHOLD_PX = 18;

/** Orbit radius around the player for the direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_ORBIT_RADIUS_PX = 42;

/** Rendered width of the track direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_WIDTH_PX = 10;

/** Rendered height of the track direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_HEIGHT_PX = 16;
