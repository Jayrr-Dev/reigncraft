import { checkingWorldPlazaEntityMovementBuffIsActive } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { resolvingWorldPlazaEntityDiseaseGrantTemplateBuffId } from '@/components/world/health/domains/applyingWorldPlazaEntityDiseaseStageGrant';
import type { DefiningWorldPlazaEntityBuffActionLock } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects';

function checkingWorldPlazaEntityTimedEffectInstanceLocksAction(
  instanceId: string,
  action: DefiningWorldPlazaEntityBuffActionLock
): boolean {
  const templateBuffId =
    resolvingWorldPlazaEntityDiseaseGrantTemplateBuffId(instanceId) ??
    instanceId;
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(templateBuffId);

  return descriptor?.actionLocks?.includes(action) === true;
}

function checkingWorldPlazaEntityModifierExpiresAfter(
  expiresAtMs: number | null,
  nowMs: number
): boolean {
  return expiresAtMs !== null && expiresAtMs > nowMs;
}

/**
 * Whether a jump, roll, or sprint action is locked by an active buff.
 */
export function checkingWorldPlazaEntityActionLocked(
  state: DefiningWorldPlazaEntityHealthState,
  action: DefiningWorldPlazaEntityBuffActionLock,
  nowMs: number
): boolean {
  for (const modifier of state.movementModifiers) {
    if (
      !checkingWorldPlazaEntityModifierExpiresAfter(modifier.expiresAtMs, nowMs)
    ) {
      continue;
    }

    if (
      checkingWorldPlazaEntityTimedEffectInstanceLocksAction(
        modifier.id,
        action
      )
    ) {
      return true;
    }
  }

  for (const modifier of state.incomingDamageModifiers) {
    if (
      !checkingWorldPlazaEntityModifierExpiresAfter(modifier.expiresAtMs, nowMs)
    ) {
      continue;
    }

    if (
      checkingWorldPlazaEntityTimedEffectInstanceLocksAction(
        modifier.id,
        action
      )
    ) {
      return true;
    }
  }

  if (
    action === 'sprint' &&
    checkingWorldPlazaEntityMovementBuffIsActive(
      state,
      DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID,
      nowMs
    )
  ) {
    return true;
  }

  return false;
}

/** Prefix for disease-scoped buff instance ids. */
export function buildingWorldPlazaEntityDiseaseGrantBuffInstanceId(
  diseaseInstanceId: string,
  grantIndex: number,
  buffId: string
): string {
  return `disease-grant:${diseaseInstanceId}:${grantIndex}:${buffId}`;
}

/** Whether a buff HUD row entry should be hidden while a disease is active. */
export function checkingWorldPlazaEntityBuffShouldHideFromHud(
  buffId: string
): boolean {
  if (buffId.startsWith('disease-grant:')) {
    return true;
  }

  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);

  return descriptor?.hideFromHud === true;
}
