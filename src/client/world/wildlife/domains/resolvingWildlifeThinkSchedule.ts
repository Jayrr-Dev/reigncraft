/**
 * Per-instance think offset seeding and should-think checks.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeThinkSchedule
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_AI_LOD_MID_RADIUS_GRID,
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS,
  DEFINING_WILDLIFE_THINK_OFFSET_SALT,
  resolvingWildlifeThinkIntervalMs,
} from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Seeds `lastThinkAtMs` so instances spread their first think across one
 * near-interval window instead of all firing on the same frame.
 */
export function seedingWildlifeInitialThinkAtMs(
  anchor: DefiningWildlifeSpawnAnchor,
  nowMs: number
): number {
  const offsetUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_THINK_OFFSET_SALT + anchor.packIndex
  );
  const offsetMs = offsetUnit * DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS;

  return nowMs - offsetMs;
}

export type CheckingWildlifeShouldThinkParams = {
  lastThinkAtMs: number;
  position: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  nowMs: number;
};

/**
 * Returns true when enough time has elapsed for this instance to think.
 */
export function checkingWildlifeShouldThink({
  lastThinkAtMs,
  position,
  playerPosition,
  nowMs,
}: CheckingWildlifeShouldThinkParams): boolean {
  const distanceToPlayer = playerPosition
    ? Math.hypot(position.x - playerPosition.x, position.y - playerPosition.y)
    : DEFINING_WILDLIFE_AI_LOD_MID_RADIUS_GRID + 1;
  const thinkIntervalMs = resolvingWildlifeThinkIntervalMs(distanceToPlayer);

  return nowMs - lastThinkAtMs >= thinkIntervalMs;
}
