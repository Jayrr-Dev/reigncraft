/**
 * Removes live night-only wildlife when the shared cycle is daytime.
 *
 * @module components/world/wildlife/domains/despawningWildlifeNightOnlyInstancesDuringDaytime
 */

import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/**
 * Night-only elites (e.g. Omega Wolf) must not linger after sunrise.
 * Clears live instances and known anchors so the next night can hydrate again.
 */
export function despawningWildlifeNightOnlyInstancesDuringDaytime(
  store: ManagingWildlifeInstanceStore,
  isDaytime: boolean
): void {
  if (!isDaytime) {
    return;
  }

  for (const [instanceId, instance] of store.instances) {
    if (!checkingWildlifeSpeciesIsNightOnlySpawn(instance.speciesId)) {
      continue;
    }

    store.instances.delete(instanceId);
    store.knownAnchorIds.delete(instance.anchorId);
    store.pendingRespawns.delete(instance.anchorId);
  }

  for (const [anchorId, pending] of store.pendingRespawns) {
    if (!checkingWildlifeSpeciesIsNightOnlySpawn(pending.speciesId)) {
      continue;
    }

    store.pendingRespawns.delete(anchorId);
    store.knownAnchorIds.delete(anchorId);
  }
}
