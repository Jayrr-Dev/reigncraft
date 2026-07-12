/**
 * Soft departure lifecycle for fairies (sunrise wander-away and betrayal flee).
 *
 * @module components/world/wildlife/domains/advancingWildlifeNightOnlyWanderAwayDuringDaytime
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import { checkingWildlifeSpeciesWandersAwayAtDaybreak } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesWandersAwayAtDaybreak';
import {
  DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DESPAWN_DISTANCE_GRID,
  DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

function resolvingDistanceGrid(
  a: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'>,
  b: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'>
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function removingWildlifeWanderAwayInstance(
  store: ManagingWildlifeInstanceStore,
  instanceId: string,
  anchorId: string
): void {
  store.instances.delete(instanceId);
  store.knownAnchorIds.delete(anchorId);
  store.pendingRespawns.delete(anchorId);
}

function checkingWildlifeFairyShouldSoftDespawn(
  startedAtMs: number,
  position: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'>,
  playerCenter: Pick<DefiningWorldPlazaWorldPoint, 'x' | 'y'>,
  nowMs: number
): boolean {
  const elapsedMs = nowMs - startedAtMs;
  const distanceFromPlayer = resolvingDistanceGrid(position, playerCenter);

  return (
    elapsedMs >= DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS ||
    distanceFromPlayer >=
      DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DESPAWN_DISTANCE_GRID
  );
}

/**
 * Stamps daybreak departure at sunrise, keeps betrayal departures alive at
 * night, and soft-despawns finished wander-aways.
 */
export function advancingWildlifeNightOnlyWanderAwayDuringDaytime(
  store: ManagingWildlifeInstanceStore,
  isDaytime: boolean,
  playerCenter: DefiningWorldPlazaWorldPoint,
  nowMs: number
): void {
  for (const [instanceId, instance] of store.instances) {
    if (!checkingWildlifeSpeciesWandersAwayAtDaybreak(instance.speciesId)) {
      continue;
    }

    if (!checkingWildlifeSpeciesIsNightOnlySpawn(instance.speciesId)) {
      continue;
    }

    if (instance.isDead) {
      continue;
    }

    const softDepartureStartedAtMs = instance.softDepartureStartedAtMs ?? null;
    const softDepartureReason = instance.softDepartureReason ?? null;

    if (!isDaytime) {
      if (softDepartureStartedAtMs == null) {
        continue;
      }

      // Betrayal keeps fleeing at night until despawn. Daybreak-only stamps
      // clear if the cycle flips back to night mid-departure.
      if (softDepartureReason !== 'betrayal') {
        store.instances.set(instanceId, {
          ...instance,
          softDepartureStartedAtMs: null,
          softDepartureReason: null,
        });
        continue;
      }

      if (
        checkingWildlifeFairyShouldSoftDespawn(
          softDepartureStartedAtMs,
          instance.position,
          playerCenter,
          nowMs
        )
      ) {
        removingWildlifeWanderAwayInstance(
          store,
          instanceId,
          instance.anchorId
        );
      }

      continue;
    }

    const departureStartedAtMs = softDepartureStartedAtMs ?? nowMs;

    if (
      checkingWildlifeFairyShouldSoftDespawn(
        departureStartedAtMs,
        instance.position,
        playerCenter,
        nowMs
      )
    ) {
      removingWildlifeWanderAwayInstance(store, instanceId, instance.anchorId);
      continue;
    }

    if (softDepartureStartedAtMs == null) {
      store.instances.set(instanceId, {
        ...instance,
        softDepartureStartedAtMs: departureStartedAtMs,
        softDepartureReason: 'daybreak',
      });
    }
  }
}
