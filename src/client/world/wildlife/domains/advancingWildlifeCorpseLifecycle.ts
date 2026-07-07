/**
 * Removes faded corpses and queues distant random respawns.
 *
 * @module components/world/wildlife/domains/advancingWildlifeCorpseLifecycle
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID,
  queueingWildlifePendingRespawnFromDeadInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

function checkingWildlifePointWithinRadius(
  point: DefiningWorldPlazaWorldPoint,
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number
): boolean {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;

  return deltaX * deltaX + deltaY * deltaY <= radiusGrid * radiusGrid;
}

function checkingWildlifeCorpseShouldExpire(
  instance: DefiningWildlifeInstance,
  center: DefiningWorldPlazaWorldPoint,
  nowMs: number
): boolean {
  if (!instance.isDead || instance.diedAtMs === null) {
    return false;
  }

  const fadeAlpha = computingWildlifeCorpseFadeAlpha(instance.diedAtMs, nowMs);

  if (fadeAlpha <= 0) {
    return true;
  }

  return !checkingWildlifePointWithinRadius(
    instance.position,
    center,
    DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID
  );
}

/**
 * Expires corpses after fade-out or when they leave the despawn radius.
 */
export function advancingWildlifeCorpseLifecycle(
  store: ManagingWildlifeInstanceStore,
  center: DefiningWorldPlazaWorldPoint,
  nowMs: number
): void {
  for (const [instanceId, instance] of store.instances) {
    if (!checkingWildlifeCorpseShouldExpire(instance, center, nowMs)) {
      continue;
    }

    queueingWildlifePendingRespawnFromDeadInstance(store, instance);
    store.instances.delete(instanceId);
  }
}
