/**
 * Charge wind-up: full-stamina animals pause briefly before sprinting.
 *
 * @module components/world/wildlife/domains/advancingWildlifeChargeWindup
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { resolvingWildlifeSpeciesChargeConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceAttackPowerMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type AdvancingWildlifeChargeWindupInput = {
  intent: DefiningWildlifeBehaviorIntent;
  instance: DefiningWildlifeInstance;
  speciesId: DefiningWildlifeSpeciesId;
  playerUserId: string | null;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  nowMs: number;
};

export type AdvancingWildlifeChargeWindupResult = {
  intent: DefiningWildlifeBehaviorIntent;
  chargeWindupStartedAtMs: number | null;
};

function checkingWildlifeIntentTargetsPlayer(
  intent: DefiningWildlifeBehaviorIntent,
  playerUserId: string | null
): boolean {
  if (!playerUserId) {
    return false;
  }

  return (
    (intent.mode === 'chase' || intent.mode === 'attack') &&
    intent.targetInstanceId === playerUserId
  );
}

/**
 * Holds charge-capable animals still for a short wind-up when stamina is full,
 * then releases the original chase/attack intent.
 */
export function advancingWildlifeChargeWindup(
  input: AdvancingWildlifeChargeWindupInput
): AdvancingWildlifeChargeWindupResult {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(input.speciesId);
  const { instance, intent, nowMs, playerPosition, playerUserId } = input;
  const chargeWindupStartedAtMs = instance.aiState.chargeWindupStartedAtMs;

  if (
    !chargeConfig ||
    !checkingWildlifeIntentTargetsPlayer(intent, playerUserId)
  ) {
    return { intent, chargeWindupStartedAtMs: null };
  }

  if (intent.mode === 'attack' && playerPosition) {
    const distanceToPlayer = Math.hypot(
      instance.position.x - playerPosition.x,
      instance.position.y - playerPosition.y
    );

    if (distanceToPlayer <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      return { intent, chargeWindupStartedAtMs };
    }
  }

  if (instance.staminaState.staminaRatio < chargeConfig.fullStaminaThreshold) {
    return { intent, chargeWindupStartedAtMs: null };
  }

  const startedAtMs = chargeWindupStartedAtMs ?? nowMs;
  const windupElapsedMs = nowMs - startedAtMs;

  if (windupElapsedMs < chargeConfig.windupMs) {
    return {
      intent: { mode: 'idle' },
      chargeWindupStartedAtMs: startedAtMs,
    };
  }

  return { intent, chargeWindupStartedAtMs: startedAtMs };
}

export function checkingWildlifeIsInActiveCharge(
  instance: DefiningWildlifeInstance,
  speciesId: DefiningWildlifeSpeciesId,
  nowMs: number
): boolean {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);
  const startedAtMs = instance.aiState.chargeWindupStartedAtMs;

  if (!chargeConfig || startedAtMs === null) {
    return false;
  }

  if (nowMs - startedAtMs < chargeConfig.windupMs) {
    return false;
  }

  return (
    instance.staminaState.staminaRatio > chargeConfig.chargeStaminaExitThreshold
  );
}

export function clearingWildlifeChargeWindupAfterStamina(
  speciesId: DefiningWildlifeSpeciesId,
  chargeWindupStartedAtMs: number | null,
  staminaState: DefiningWildlifeStaminaState
): number | null {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);

  if (!chargeConfig) {
    return chargeWindupStartedAtMs;
  }

  if (
    staminaState.isExhausted ||
    staminaState.staminaRatio < chargeConfig.fullStaminaThreshold
  ) {
    return null;
  }

  return chargeWindupStartedAtMs;
}

export function resolvingWildlifeMeleeAttackPower(
  baseAttackPower: number,
  speciesId: DefiningWildlifeSpeciesId,
  instance: DefiningWildlifeInstance,
  isRunning: boolean,
  nowMs: number
): number {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);

  if (!chargeConfig) {
    return Math.round(
      baseAttackPower * resolvingWildlifeInstanceAttackPowerMultiplier(instance)
    );
  }

  const isChargeDamage =
    isRunning || checkingWildlifeIsInActiveCharge(instance, speciesId, nowMs);

  if (!isChargeDamage) {
    return Math.round(
      baseAttackPower * resolvingWildlifeInstanceAttackPowerMultiplier(instance)
    );
  }

  return Math.round(
    baseAttackPower *
      chargeConfig.runDamageMultiplier *
      resolvingWildlifeInstanceAttackPowerMultiplier(instance)
  );
}
