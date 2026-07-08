/**
 * Applies a pack-wide flee, enrage, or regroup response when the player rushes a stalker.
 *
 * @module components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachResponse
 */

import { applyingWildlifeStalkPackResponse } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackDamageResponse';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeStalkPlayerApproachResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachResponse';

export type ApplyingWildlifeStalkPlayerApproachResponseParams = {
  store: ManagingWildlifeInstanceStore;
  triggerInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  playerUserId?: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  playerPosition?: DefiningWildlifeInstance['position'] | null;
};

/**
 * Rolls once per pack and applies flee, enrage, or regroup to every hunting stalker.
 */
export function applyingWildlifeStalkPlayerApproachResponse({
  store,
  triggerInstance,
  species,
  preyTargetId,
  nearbyInstances,
  nowMs,
  resolveSpecies,
  playerUserId = null,
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  playerPosition = null,
}: ApplyingWildlifeStalkPlayerApproachResponseParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: triggerInstance,
    nearbyInstances,
    preyTargetId,
  });

  if (packmates.length === 0) {
    return;
  }

  const existingResponse = packmates.find(
    (packmate) => packmate.aggroState.stalkPackResponse
  )?.aggroState.stalkPackResponse;
  const response =
    existingResponse ?? resolvingWildlifeStalkPlayerApproachResponse(packmates);

  applyingWildlifeStalkPackResponse({
    store,
    anchorInstance: triggerInstance,
    species,
    preyTargetId,
    nearbyInstances,
    response,
    nowMs,
    resolveSpecies,
    reactedAtMs: nowMs,
    playerUserId,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    playerPosition,
  });
}
