import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_AMPLITUDE_PX,
  DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_DURATION_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

const shakeUntilMsByTileKey = new Map<string, number>();

/**
 * Starts a short screen-space shake on one tree tile.
 */
export function registeringWorldPlazaTreeShake(
  tileX: number,
  tileY: number,
  nowMs: number
): void {
  shakeUntilMsByTileKey.set(
    formattingWorldPlazaChoppedTreeTileKey(tileX, tileY),
    nowMs + DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_DURATION_MS
  );
}

/**
 * Returns a decaying horizontal shake offset for one tree tile.
 */
export function computingWorldPlazaTreeShakeOffsetPx(
  tileX: number,
  tileY: number,
  nowMs: number
): number {
  const tileKey = formattingWorldPlazaChoppedTreeTileKey(tileX, tileY);
  const shakeUntilMs = shakeUntilMsByTileKey.get(tileKey);

  if (shakeUntilMs === undefined || nowMs >= shakeUntilMs) {
    shakeUntilMsByTileKey.delete(tileKey);
    return 0;
  }

  const remainingMs = shakeUntilMs - nowMs;
  const progress =
    1 - remainingMs / DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_DURATION_MS;
  const decay = 1 - progress;
  const oscillation = Math.sin(progress * Math.PI * 6);

  return (
    oscillation * DEFINING_WORLD_PLAZA_TREE_CHOP_SHAKE_AMPLITUDE_PX * decay
  );
}
