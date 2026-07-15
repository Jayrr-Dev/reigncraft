/**
 * Applies specialty-weapon on-hit side effects to wildlife and the player.
 *
 * @module components/world/equipment/domains/applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects
 */

import {
  encodingWorldPlazaSpecialtyWeaponForcedTierValue,
  formattingWorldPlazaSpecialtyWeaponModifierId,
  type DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc,
} from '@/components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { applyingWorldPlazaEntityHealthTemperatureImpulse } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { addingWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWorldPlazaSpecialtyWeaponMeleeHitSideEffectsParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly playerHealthState: DefiningWorldPlazaEntityHealthState;
  readonly swingEv: number;
  readonly nowMs: number;
  readonly potentialDamageProc: DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc | null;
  readonly selfCurseProc: DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc | null;
  readonly bleedProc: DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc | null;
  readonly temperatureProc: DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc | null;
  readonly weaponId: string;
};

export type ApplyingWorldPlazaSpecialtyWeaponMeleeHitSideEffectsResult = {
  readonly instance: DefiningWildlifeInstance;
  readonly playerHealthState: DefiningWorldPlazaEntityHealthState;
};

/**
 * Plants fated damage / bleed / temperature on the target, or self-curses the player.
 */
export function applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects({
  instance,
  playerHealthState,
  swingEv,
  nowMs,
  potentialDamageProc,
  selfCurseProc,
  bleedProc,
  temperatureProc,
  weaponId,
}: ApplyingWorldPlazaSpecialtyWeaponMeleeHitSideEffectsParams): ApplyingWorldPlazaSpecialtyWeaponMeleeHitSideEffectsResult {
  let nextInstance = instance;
  let nextPlayerHealth = playerHealthState;

  if (potentialDamageProc && !nextInstance.isDead && swingEv > 0) {
    const pendingExpectedDamage = Math.max(
      1,
      Math.round(swingEv * potentialDamageProc.pendingEvRatio)
    );
    nextInstance = {
      ...nextInstance,
      healthState: applyingWorldPlazaEntityHealthPotentialDamage({
        state: nextInstance.healthState,
        pendingExpectedDamage,
        resolveDelayMs: potentialDamageProc.resolveDelayMs,
        nowMs,
      }),
    };
  }

  if (bleedProc && !nextInstance.isDead) {
    nextInstance = {
      ...nextInstance,
      healthState: applyingWorldPlazaEntityHealthBleedStack(
        nextInstance.healthState,
        bleedProc.severity,
        bleedProc.flatExpectedDamage,
        nowMs
      ),
    };
  }

  if (temperatureProc && !nextInstance.isDead) {
    nextInstance = {
      ...nextInstance,
      healthState: applyingWorldPlazaEntityHealthTemperatureImpulse(
        nextInstance.healthState,
        temperatureProc.deltaCelsius
      ),
    };
  }

  if (selfCurseProc) {
    nextPlayerHealth = addingWorldPlazaEntityHealthDamageRollModifier(
      nextPlayerHealth,
      {
        id: formattingWorldPlazaSpecialtyWeaponModifierId(
          weaponId,
          `self-curse-${selfCurseProc.tier}`
        ),
        kind: 'forced_tier',
        value: encodingWorldPlazaSpecialtyWeaponForcedTierValue(
          selfCurseProc.tier
        ),
        expiresAtMs: nowMs + selfCurseProc.durationMs,
      }
    );
  }

  return {
    instance: nextInstance,
    playerHealthState: nextPlayerHealth,
  };
}
