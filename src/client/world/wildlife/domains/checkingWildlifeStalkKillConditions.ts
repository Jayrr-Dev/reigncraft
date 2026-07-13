/**
 * Kill-window predicates for pack_hunter and solo stalker temperaments.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkKillConditions
 */

import {
  DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
  DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT,
  DEFINING_WILDLIFE_STALK_PREY_LOW_HEALTH_RATIO,
  DEFINING_WILDLIFE_STALK_PREY_STAMINA_DEPLETED_RATIO,
  DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeHungerDriveLevel,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeStalkConfidenceCommit } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackConfidenceCommit';

export type CheckingWildlifeStalkWeaknessKillTriggerParams = {
  preyHealthRatio: number | null;
  preyStaminaRatio: number | null;
  preyStaminaIsDepleted: boolean;
  preyStillDurationMs: number;
};

export type CheckingWildlifeStalkKillConditionsParams =
  CheckingWildlifeStalkWeaknessKillTriggerParams & {
    stalkingElapsedMs: number;
    stalkPackCount?: number;
    preyTargetId?: string | null;
    stalkingPreySinceMs?: number | null;
    nowMs?: number;
  };

export type CheckingWildlifeStalkPackSurroundCommitParams =
  CheckingWildlifeStalkWeaknessKillTriggerParams & {
    stalkPackCount: number;
    stalkingElapsedMs: number;
    preyTargetId?: string | null;
    stalkingPreySinceMs?: number | null;
    nowMs?: number;
  };

export type CheckingWildlifeSoloStalkerKillConditionsParams =
  CheckingWildlifeStalkWeaknessKillTriggerParams & {
    stalkingElapsedMs: number;
    hungerDriveLevel: DefiningWildlifeHungerDriveLevel;
    aggressionLevel: DefiningWildlifeAggressionLevel;
  };

/** Returns true once the mandatory opening shadow phase has elapsed. */
export function checkingWildlifeStalkInitialPhaseComplete(
  stalkingElapsedMs: number
): boolean {
  return stalkingElapsedMs >= DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS;
}

/** Prey weakness signals that force-open the kill window after the shadow phase. */
export function checkingWildlifeStalkWeaknessKillTriggers({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
}: CheckingWildlifeStalkWeaknessKillTriggerParams): boolean {
  if (
    preyHealthRatio !== null &&
    preyHealthRatio <= DEFINING_WILDLIFE_STALK_PREY_LOW_HEALTH_RATIO
  ) {
    return true;
  }

  if (
    preyStaminaIsDepleted ||
    (preyStaminaRatio !== null &&
      preyStaminaRatio <= DEFINING_WILDLIFE_STALK_PREY_STAMINA_DEPLETED_RATIO)
  ) {
    return true;
  }

  return preyStillDurationMs >= DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS;
}

export function resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey(
  prey: DefiningWildlifeStalkPreyContext
): CheckingWildlifeStalkWeaknessKillTriggerParams {
  return {
    preyHealthRatio: prey.healthRatio,
    preyStaminaRatio: prey.staminaRatio,
    preyStaminaIsDepleted: prey.staminaIsDepleted,
    preyStillDurationMs: prey.stillDurationMs,
  };
}

function checkingWildlifeStalkConfidenceCommitIfReady({
  stalkingElapsedMs,
  stalkPackCount,
  preyTargetId,
  stalkingPreySinceMs,
  nowMs,
}: {
  stalkingElapsedMs: number;
  stalkPackCount?: number;
  preyTargetId?: string | null;
  stalkingPreySinceMs?: number | null;
  nowMs?: number;
}): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  if (
    stalkPackCount === undefined ||
    !preyTargetId ||
    stalkingPreySinceMs === null ||
    stalkingPreySinceMs === undefined ||
    nowMs === undefined
  ) {
    return false;
  }

  return checkingWildlifeStalkConfidenceCommit({
    stalkPackCount,
    preyTargetId,
    stalkingPreySinceMs,
    nowMs,
  });
}

/**
 * Returns true when PackHunters should stop shadowing and attack the prey.
 * After the opening shadow: prey weakness force-commits, otherwise a pack-size
 * confidence roll may commit (higher chance with more wolves; 5+ is likely).
 * Once surrounding/attacking, the pack stays committed via attack-burst → re-flank.
 */
export function checkingWildlifeStalkKillConditions({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkingElapsedMs,
  stalkPackCount,
  preyTargetId,
  stalkingPreySinceMs,
  nowMs,
}: CheckingWildlifeStalkKillConditionsParams): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  if (
    checkingWildlifeStalkWeaknessKillTriggers({
      preyHealthRatio,
      preyStaminaRatio,
      preyStaminaIsDepleted,
      preyStillDurationMs,
    })
  ) {
    return true;
  }

  return checkingWildlifeStalkConfidenceCommitIfReady({
    stalkingElapsedMs,
    stalkPackCount,
    preyTargetId,
    stalkingPreySinceMs,
    nowMs,
  });
}

/**
 * Returns true when a pack may coordinate a surround after shadow.
 * Needs ≥3 hunters plus weakness or a successful confidence roll.
 */
export function checkingWildlifeStalkPackSurroundCommit({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkPackCount,
  stalkingElapsedMs,
  preyTargetId,
  stalkingPreySinceMs,
  nowMs,
}: CheckingWildlifeStalkPackSurroundCommitParams): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  if (stalkPackCount < DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT) {
    return false;
  }

  return checkingWildlifeStalkKillConditions({
    preyHealthRatio,
    preyStaminaRatio,
    preyStaminaIsDepleted,
    preyStillDurationMs,
    stalkingElapsedMs,
    stalkPackCount,
    preyTargetId,
    stalkingPreySinceMs,
    nowMs,
  });
}

/**
 * Solo stalker kill window: after the opening shadow, rush on prey weakness
 * or when the hunter is hungry/starving/aggressive (no pack confidence roll).
 */
export function checkingWildlifeSoloStalkerKillConditions({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkingElapsedMs,
  hungerDriveLevel,
  aggressionLevel,
}: CheckingWildlifeSoloStalkerKillConditionsParams): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  if (
    checkingWildlifeStalkWeaknessKillTriggers({
      preyHealthRatio,
      preyStaminaRatio,
      preyStaminaIsDepleted,
      preyStillDurationMs,
    })
  ) {
    return true;
  }

  if (aggressionLevel === 'aggressive') {
    return true;
  }

  return hungerDriveLevel === 'hungry' || hungerDriveLevel === 'starving';
}
