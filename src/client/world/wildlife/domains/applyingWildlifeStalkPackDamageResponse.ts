/**
 * Applies a pack-wide flee, enrage, or regroup response to stalking hunters.
 *
 * @module components/world/wildlife/domains/applyingWildlifeStalkPackDamageResponse
 */

import { applyingWildlifeStalkPackEvent } from '@/components/world/wildlife/domains/applyingWildlifeStalkPackEvent';
import type { DefiningWildlifeStalkEventKind } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPackResponseKind,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeStalkPackCommittedRoll } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackCommittedRoll';
import { resolvingWildlifeStalkPackDamageResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackDamageResponse';
import { resolvingWildlifeStalkPlayerApproachResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPlayerApproachResponse';

export type ApplyingWildlifeStalkPackDamageResponseParams = {
  store: ManagingWildlifeInstanceStore;
  damagedInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function resolvingWildlifeStalkPackResponseEvent(
  response: DefiningWildlifeStalkPackResponseKind,
  source: 'damage' | 'approach'
): DefiningWildlifeStalkEventKind {
  if (response === 'flee') {
    return source === 'damage' ? 'DAMAGED_ROLL_FLEE' : 'RETREAT_DONE_ROLL_FLEE';
  }

  if (response === 'regroup') {
    return 'RETREAT_DONE_ROLL_REGROUP';
  }

  return source === 'damage' ? 'DAMAGED_ROLL_ENRAGE' : 'RETREAT_DONE_ROLL_ENRAGE';
}

export type ApplyingWildlifeStalkPackResponseParams = {
  store: ManagingWildlifeInstanceStore;
  anchorInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  response: DefiningWildlifeStalkPackResponseKind;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  reactedAtMs?: number | null;
  playerUserId?: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  playerPosition?: DefiningWildlifeInstance['position'] | null;
};

/** Applies one pack-wide stalk response via the phase machine. */
export function applyingWildlifeStalkPackResponse({
  store,
  anchorInstance,
  species,
  preyTargetId,
  nearbyInstances,
  response,
  nowMs,
  resolveSpecies,
  reactedAtMs = null,
  playerUserId = null,
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  playerPosition = null,
}: ApplyingWildlifeStalkPackResponseParams): void {
  applyingWildlifeStalkPackEvent({
    store,
    anchorInstance,
    species,
    preyTargetId,
    nearbyInstances,
    eventKind: resolvingWildlifeStalkPackResponseEvent(response, 'approach'),
    nowMs,
    resolveSpecies,
    reactedAtMs,
    playerUserId,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    playerPosition,
  });
}

/**
 * Rolls once per pack and applies flee or full attack to every hunting PackHunter.
 */
export function applyingWildlifeStalkPackDamageResponse({
  store,
  damagedInstance,
  species,
  preyTargetId,
  nearbyInstances,
  nowMs,
  resolveSpecies,
}: ApplyingWildlifeStalkPackDamageResponseParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: damagedInstance,
    nearbyInstances,
    preyTargetId,
  });

  if (packmates.length === 0) {
    return;
  }

  const existingResponse = resolvingWildlifeStalkPackCommittedRoll(packmates);
  const response =
    existingResponse ?? resolvingWildlifeStalkPackDamageResponse(packmates);

  applyingWildlifeStalkPackEvent({
    store,
    anchorInstance: damagedInstance,
    species,
    preyTargetId,
    nearbyInstances,
    eventKind: resolvingWildlifeStalkPackResponseEvent(response, 'damage'),
    nowMs,
    resolveSpecies,
  });
}
