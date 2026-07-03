import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Minimum spawn ring radius from origin (grid tiles). */
const DEFINING_WORLD_PLAZA_ONLINE_SPAWN_MIN_RADIUS_GRID = 2;

/** Additional spawn radius steps (grid tiles). */
const DEFINING_WORLD_PLAZA_ONLINE_SPAWN_RADIUS_STEP_GRID = 1;

/** Number of spawn radius steps around the origin. */
const DEFINING_WORLD_PLAZA_ONLINE_SPAWN_RADIUS_STEPS = 4;

/**
 * Spreads new online players around the origin so joins do not stack perfectly.
 *
 * @param userId - Auth user id used for deterministic placement.
 */
export function resolvingWorldPlazaOnlineSpawnOffset(
  userId: string,
): DefiningWorldPlazaWorldPoint {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = (hash << 5) - hash + userId.charCodeAt(index);
    hash |= 0;
  }

  const angleDegrees = Math.abs(hash) % 360;
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const radiusStep = Math.abs(hash) % DEFINING_WORLD_PLAZA_ONLINE_SPAWN_RADIUS_STEPS;
  const radiusGrid =
    DEFINING_WORLD_PLAZA_ONLINE_SPAWN_MIN_RADIUS_GRID +
    radiusStep * DEFINING_WORLD_PLAZA_ONLINE_SPAWN_RADIUS_STEP_GRID;

  return {
    x: Math.cos(angleRadians) * radiusGrid,
    y: Math.sin(angleRadians) * radiusGrid,
  };
}
