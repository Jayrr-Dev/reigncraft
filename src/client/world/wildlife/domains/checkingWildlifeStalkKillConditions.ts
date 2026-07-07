/**
 * Kill-window predicates for stalker temperament animals.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkKillConditions
 */

import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import {
  DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT,
  DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
  DEFINING_WILDLIFE_STALK_PREY_LOW_HEALTH_RATIO,
  DEFINING_WILDLIFE_STALK_PREY_STAMINA_DEPLETED_RATIO,
  DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type CheckingWildlifeStalkWeaknessKillTriggerParams = {
  preyHealthRatio: number | null;
  preyStaminaRatio: number | null;
  preyStaminaIsDepleted: boolean;
  preyStillDurationMs: number;
};

export type CheckingWildlifeStalkKillConditionsParams =
  CheckingWildlifeStalkWeaknessKillTriggerParams & {
    stalkingElapsedMs: number;
  };

export type CheckingWildlifeStalkPackSurroundCommitParams =
  CheckingWildlifeStalkWeaknessKillTriggerParams & {
    stalkPackCount: number;
    stalkingElapsedMs: number;
  };

/** Returns true once the mandatory opening shadow phase has elapsed. */
export function checkingWildlifeStalkInitialPhaseComplete(
  stalkingElapsedMs: number
): boolean {
  return stalkingElapsedMs >= DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS;
}

/** Prey weakness signals that can end the shadow phase. */
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

/** Returns true when stalkers should stop shadowing and attack the prey. */
export function checkingWildlifeStalkKillConditions({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkingElapsedMs,
}: CheckingWildlifeStalkKillConditionsParams): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  return checkingWildlifeStalkWeaknessKillTriggers({
    preyHealthRatio,
    preyStaminaRatio,
    preyStaminaIsDepleted,
    preyStillDurationMs,
  });
}

/**
 * Returns true when a large pack may coordinate a surround after a weakness trigger.
 * Pack size is a prerequisite, not a kill trigger on its own.
 */
export function checkingWildlifeStalkPackSurroundCommit({
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkPackCount,
  stalkingElapsedMs,
}: CheckingWildlifeStalkPackSurroundCommitParams): boolean {
  if (!checkingWildlifeStalkInitialPhaseComplete(stalkingElapsedMs)) {
    return false;
  }

  if (stalkPackCount < DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT) {
    return false;
  }

  return checkingWildlifeStalkWeaknessKillTriggers({
    preyHealthRatio,
    preyStaminaRatio,
    preyStaminaIsDepleted,
    preyStillDurationMs,
  });
}
