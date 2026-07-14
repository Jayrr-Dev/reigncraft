/**
 * Finds an armed bear trap under a world point.
 *
 * @module components/world/trap/domains/checkingWorldPlazaBearTrapTriggerAtPoint
 */

import { DEFINING_WORLD_PLAZA_BEAR_TRAP_TRIGGER_RADIUS_GRID } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { DefiningWorldPlazaBearTrapInstance } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  listingWorldPlazaBearTrapInstances,
  type ManagingWorldPlazaBearTrapInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';

/**
 * Returns the nearest armed trap within trigger radius, or null.
 */
export function checkingWorldPlazaBearTrapTriggerAtPoint(
  worldX: number,
  worldY: number,
  store?: ManagingWorldPlazaBearTrapInstanceStore
): DefiningWorldPlazaBearTrapInstance | null {
  const radius = DEFINING_WORLD_PLAZA_BEAR_TRAP_TRIGGER_RADIUS_GRID;
  const radiusSq = radius * radius;
  let nearest: DefiningWorldPlazaBearTrapInstance | null = null;
  let nearestDistSq = Number.POSITIVE_INFINITY;

  for (const instance of listingWorldPlazaBearTrapInstances(store)) {
    if (instance.state !== 'armed' || instance.snapStartedAtMs !== null) {
      continue;
    }

    const dx = instance.position.x - worldX;
    const dy = instance.position.y - worldY;
    const distSq = dx * dx + dy * dy;

    if (distSq > radiusSq || distSq >= nearestDistSq) {
      continue;
    }

    nearest = instance;
    nearestDistSq = distSq;
  }

  return nearest;
}
