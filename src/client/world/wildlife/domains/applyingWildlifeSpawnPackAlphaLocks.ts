/**
 * Locks sticky area-pack alpha ids onto living nearby packmates.
 *
 * @module components/world/wildlife/domains/applyingWildlifeSpawnPackAlphaLocks
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { listingWildlifeNearbyPackmates } from '@/components/world/wildlife/domains/listingWildlifeNearbyPackmates';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';

export type ApplyingWildlifeSpawnPackAlphaLocksParams = {
  store: ManagingWildlifeInstanceStore;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  nowMs: number;
};

function checkingWildlifePackmateIsStillScattering(
  packmate: { packAlphaDeathScatterUntilMs?: number | null },
  nowMs: number
): boolean {
  const scatterUntilMs = packmate.packAlphaDeathScatterUntilMs ?? null;

  return scatterUntilMs !== null && nowMs < scatterUntilMs;
}

function checkingWildlifePackmateFinishedScatterWindow(
  packmate: { packAlphaDeathScatterUntilMs?: number | null },
  nowMs: number
): boolean {
  const scatterUntilMs = packmate.packAlphaDeathScatterUntilMs ?? null;

  return scatterUntilMs !== null && nowMs >= scatterUntilMs;
}

/**
 * Ensures every multi-member nearby pack shares one sticky alpha id.
 * Groups by proximity (stalk join radius), not spawn tile, so mixed packs hunt together.
 * Survivors of an alpha death stay unlocked until their scatter/regroup window ends,
 * then elect a new alpha from whoever regrouped nearby.
 */
export function applyingWildlifeSpawnPackAlphaLocks({
  store,
  resolveSpecies,
  nowMs,
}: ApplyingWildlifeSpawnPackAlphaLocksParams): void {
  const liveInstances = listingWildlifeInstances(store).filter(
    (instance) => !instance.isDead
  );
  const visitedInstanceIds = new Set<string>();

  for (const instance of liveInstances) {
    if (visitedInstanceIds.has(instance.instanceId)) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species || species.temperamentId !== 'pack_hunter') {
      continue;
    }

    const packmates = listingWildlifeNearbyPackmates({
      instance,
      instances: liveInstances,
      includeDead: false,
    });

    for (const packmate of packmates) {
      visitedInstanceIds.add(packmate.instanceId);
    }

    if (packmates.length <= 1) {
      const solo = packmates[0];

      if (!solo) {
        continue;
      }

      const stillScattering = checkingWildlifePackmateIsStillScattering(
        solo,
        nowMs
      );
      const finishedScatter = checkingWildlifePackmateFinishedScatterWindow(
        solo,
        nowMs
      );

      if (
        solo.packAlphaInstanceId ||
        (finishedScatter && solo.packAlphaDeathScatterUntilMs)
      ) {
        replacingWildlifeInstance(store, {
          ...solo,
          packAlphaInstanceId: null,
          packAlphaDeathScatterUntilMs: stillScattering
            ? solo.packAlphaDeathScatterUntilMs
            : null,
        });
      }

      continue;
    }

    const stillScattering = packmates.some((packmate) =>
      checkingWildlifePackmateIsStillScattering(packmate, nowMs)
    );

    if (stillScattering) {
      for (const packmate of packmates) {
        const livePackmate =
          store.instances.get(packmate.instanceId) ?? packmate;

        if (
          livePackmate.packAlphaInstanceId === null ||
          livePackmate.packAlphaInstanceId === undefined
        ) {
          continue;
        }

        replacingWildlifeInstance(store, {
          ...livePackmate,
          packAlphaInstanceId: null,
        });
      }

      continue;
    }

    const finishedScatter = packmates.some((packmate) =>
      checkingWildlifePackmateFinishedScatterWindow(packmate, nowMs)
    );
    const electionPackmates = finishedScatter
      ? packmates.map((packmate) => ({
          ...packmate,
          packAlphaInstanceId: null,
        }))
      : packmates;

    const alphaInstanceId = resolvingWildlifePackAlphaInstanceId({
      packmates: electionPackmates,
      resolveSpecies,
    });

    if (!alphaInstanceId) {
      continue;
    }

    for (const packmate of packmates) {
      const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

      if (
        livePackmate.packAlphaInstanceId === alphaInstanceId &&
        (livePackmate.packAlphaDeathScatterUntilMs === null ||
          livePackmate.packAlphaDeathScatterUntilMs === undefined)
      ) {
        continue;
      }

      replacingWildlifeInstance(store, {
        ...livePackmate,
        packAlphaInstanceId: alphaInstanceId,
        packAlphaDeathScatterUntilMs: null,
      });
    }
  }
}
