/**
 * Charge wind-up: full-stamina animals pause briefly before sprinting.
 *
 * @module components/world/wildlife/domains/advancingWildlifeChargeWindup
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { resolvingWildlifeSpeciesChargeConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeSpeciesId,
  DefiningWildlifeStaminaState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceAttackPowerMultiplier,
  resolvingWildlifeInstanceSpritcoreUpgradeAttackPowerBonus,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

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

/** True while sprinting or mid-charge for species with charge tuning. */
export function checkingWildlifeChargeRunAttackActive(
  instance: DefiningWildlifeInstance,
  speciesId: DefiningWildlifeSpeciesId,
  isRunning: boolean,
  nowMs: number
): boolean {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);

  if (!chargeConfig) {
    return false;
  }

  return (
    isRunning || checkingWildlifeIsInActiveCharge(instance, speciesId, nowMs)
  );
}

/**
 * Forces a critical EV roll when a charge species hits while sprinting /
 * mid-charge and `runForcesCritical` is set.
 */
export function resolvingWildlifeChargeRunAttackDamageOptions(
  instance: DefiningWildlifeInstance,
  speciesId: DefiningWildlifeSpeciesId,
  isRunning: boolean,
  nowMs: number
): Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'skipDamageRoll' | 'forcedDeviationScore'
> | null {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);

  if (
    !chargeConfig?.runForcesCritical ||
    !checkingWildlifeChargeRunAttackActive(
      instance,
      speciesId,
      isRunning,
      nowMs
    )
  ) {
    return null;
  }

  return {
    skipDamageRoll: false,
    forcedDeviationScore:
      encodingWorldPlazaEntityHealthDamageRollForcedTierValue('critical'),
  };
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
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  isRunning: boolean,
  nowMs: number
): number {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(species.speciesId);
  const spritcoreAttackBonus =
    resolvingWildlifeInstanceSpritcoreUpgradeAttackPowerBonus(instance);

  if (!chargeConfig) {
    return (
      Math.round(
        baseAttackPower *
          resolvingWildlifeInstanceAttackPowerMultiplier(
            species,
            instance,
            nowMs
          )
      ) + spritcoreAttackBonus
    );
  }

  const isChargeDamage = checkingWildlifeChargeRunAttackActive(
    instance,
    species.speciesId,
    isRunning,
    nowMs
  );

  if (!isChargeDamage) {
    return (
      Math.round(
        baseAttackPower *
          resolvingWildlifeInstanceAttackPowerMultiplier(
            species,
            instance,
            nowMs
          )
      ) + spritcoreAttackBonus
    );
  }

  return (
    Math.round(
      baseAttackPower *
        chargeConfig.runDamageMultiplier *
        resolvingWildlifeInstanceAttackPowerMultiplier(species, instance, nowMs)
    ) + spritcoreAttackBonus
  );
}
