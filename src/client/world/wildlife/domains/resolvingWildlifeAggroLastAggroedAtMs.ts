/**
 * Tracks the last moment a wildlife instance held an active combat target.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs
 */

/** Updates lastAggroedAtMs while combat is active; preserves it after release. */
export function resolvingWildlifeAggroLastAggroedAtMs(
  previousLastAggroedAtMs: number | null | undefined,
  activeTargetId: string | null,
  nowMs: number
): number | null {
  if (activeTargetId !== null) {
    return nowMs;
  }

  return previousLastAggroedAtMs ?? null;
}
