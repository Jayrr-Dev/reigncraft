/**
 * Last plaza avatar position persistence and query tuning.
 *
 * @module components/world/domains/definingWorldPlazaLastPositionConstants
 */

/** localStorage key prefix for the last plaza avatar position. */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_STORAGE_KEY_PREFIX =
  "world-plaza-last-position" as const;

/** TanStack Query root key for remote last position loads. */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_KEY_ROOT =
  "world-plaza-last-position" as const;

/** TanStack Query stale time for remote last position (ms). */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_STALE_TIME_MS = 60_000;

/**
 * Poll cadence for cheap local writes and idle settle detection (ms).
 *
 * localStorage writes are free, so this stays tight for crash and refresh
 * safety. Server writes are gated separately by the settle and cooldown rules.
 */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_POLL_INTERVAL_MS = 1_000;

/** Minimum grid movement before a persist write is considered (tile units). */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_MIN_GRID_DELTA = 0.05;

/**
 * Idle duration after movement stops before the position is saved to the server.
 *
 * Game-style "save on settle": continuous wandering never hits the server, only
 * the spot where the player comes to rest does.
 */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_SETTLE_DELAY_MS = 1_500;

/**
 * Minimum gap between Supabase upserts (ms).
 *
 * Throttles rapid stop-start stutters so a fidgeting player cannot spam the
 * server with one write per micro-pause.
 */
export const DEFINING_WORLD_PLAZA_LAST_POSITION_SUPABASE_MIN_INTERVAL_MS =
  15_000;

/**
 * Resolves the localStorage key for one plaza session owner.
 *
 * @param onlineUserId - Auth user id, or null for guest sessions.
 */
export function resolvingWorldPlazaLastPositionStorageKey(
  onlineUserId: string | null,
): string {
  if (onlineUserId) {
    return `${DEFINING_WORLD_PLAZA_LAST_POSITION_STORAGE_KEY_PREFIX}:${onlineUserId}`;
  }

  return DEFINING_WORLD_PLAZA_LAST_POSITION_STORAGE_KEY_PREFIX;
}
