/**
 * Resolves which bear-trap sprite sheet column to draw.
 *
 * @module components/world/trap/domains/resolvingWorldPlazaBearTrapSpriteFrame
 */

import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SNAP_DURATION_MS,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { DefiningWorldPlazaBearTrapInstance } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';

/**
 * Armed idle → open. Closed idle → closed. During snap → early / mid / closed.
 */
export function resolvingWorldPlazaBearTrapSpriteFrame(
  instance: DefiningWorldPlazaBearTrapInstance,
  nowMs: number
): number {
  if (instance.state === 'armed' && instance.snapStartedAtMs === null) {
    return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN;
  }

  if (instance.snapStartedAtMs === null) {
    return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.CLOSED;
  }

  const elapsedMs = Math.max(0, nowMs - instance.snapStartedAtMs);
  const progress = Math.min(
    1,
    elapsedMs / DEFINING_WORLD_PLAZA_BEAR_TRAP_SNAP_DURATION_MS
  );

  if (progress < 1 / 3) {
    return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN;
  }

  if (progress < 2 / 3) {
    return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.SNAP_EARLY;
  }

  if (progress < 1) {
    return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.SNAP_MID;
  }

  return DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.CLOSED;
}
