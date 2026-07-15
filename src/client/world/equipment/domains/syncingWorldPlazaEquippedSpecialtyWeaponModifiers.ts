/**
 * Syncs specialty-weapon attack speed and lifesteal onto player health.
 *
 * @module components/world/equipment/domains/syncingWorldPlazaEquippedSpecialtyWeaponModifiers
 */

import {
  DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_ID_PREFIX,
  formattingWorldPlazaSpecialtyWeaponModifierId,
  resolvingWorldPlazaSpecialtyWeaponDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry';
import {
  addingWorldPlazaEntityHealthMovementModifier,
  addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

function clearingWorldPlazaSpecialtyWeaponEquippedModifiers(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    movementModifiers: state.movementModifiers.filter(
      (modifier) =>
        !modifier.id.startsWith(
          DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_ID_PREFIX
        )
    ),
    physicalDamageLifestealModifiers:
      state.physicalDamageLifestealModifiers.filter(
        (modifier) =>
          !modifier.id.startsWith(
            DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_ID_PREFIX
          )
      ),
  };
}

/**
 * Clears prior specialty-weapon AS%/lifesteal, then applies the equipped row.
 */
export function syncingWorldPlazaEquippedSpecialtyWeaponModifiers(
  state: DefiningWorldPlazaEntityHealthState,
  equippedItemTypeId: string | null,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  let nextState = clearingWorldPlazaSpecialtyWeaponEquippedModifiers(state);
  const weapon = equippedItemTypeId
    ? resolvingWorldPlazaSpecialtyWeaponDefinition(equippedItemTypeId)
    : null;

  if (!weapon) {
    return nextState;
  }

  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_DURATION_MS;

  if (
    weapon.attackSpeedMultiplier !== undefined &&
    weapon.attackSpeedMultiplier !== 1
  ) {
    nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
      id: formattingWorldPlazaSpecialtyWeaponModifierId(
        weapon.weaponId,
        'attack-speed'
      ),
      kind: 'attack_speed',
      multiplier: weapon.attackSpeedMultiplier,
      expiresAtMs,
    });
  }

  if (
    weapon.physicalDamageLifestealRatio !== undefined &&
    weapon.physicalDamageLifestealRatio > 0
  ) {
    nextState = addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
      nextState,
      {
        id: formattingWorldPlazaSpecialtyWeaponModifierId(
          weapon.weaponId,
          'lifesteal'
        ),
        ratio: weapon.physicalDamageLifestealRatio,
        expiresAtMs,
      }
    );
  }

  return nextState;
}
