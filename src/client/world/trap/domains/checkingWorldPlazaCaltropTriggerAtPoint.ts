/**
 * Finds a caltrop under a world point.
 *
 * @module components/world/trap/domains/checkingWorldPlazaCaltropTriggerAtPoint
 */

import { DEFINING_WORLD_PLAZA_CALTROP_TRIGGER_RADIUS_GRID } from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import type { DefiningWorldPlazaCaltropInstance } from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';
import {
  listingWorldPlazaCaltropInstances,
  type ManagingWorldPlazaCaltropInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';

/**
 * Returns the nearest caltrop within trigger radius, or null.
 */
export function checkingWorldPlazaCaltropTriggerAtPoint(
  worldX: number,
  worldY: number,
  store?: ManagingWorldPlazaCaltropInstanceStore
): DefiningWorldPlazaCaltropInstance | null {
  const radius = DEFINING_WORLD_PLAZA_CALTROP_TRIGGER_RADIUS_GRID;
  const radiusSq = radius * radius;
  let nearest: DefiningWorldPlazaCaltropInstance | null = null;
  let nearestDistSq = Number.POSITIVE_INFINITY;

  for (const instance of listingWorldPlazaCaltropInstances(store)) {
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
