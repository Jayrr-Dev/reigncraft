/**
 * Rebuilds armor-set combat modifiers from the current loadout.
 *
 * @module components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import { DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import { resolvingWorldPlazaApostleClayArmorSetCombatModifiers } from '@/components/world/equipment/domains/resolvingWorldPlazaApostleClayArmorSetCombatModifiers';
import {
  checkingWorldPlazaBessemerArmorFullSetMarkerIsActive,
  resolvingWorldPlazaBessemerArmorFullSetShieldFloor,
  resolvingWorldPlazaBessemerArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaBessemerArmorSetCombatModifiers';
import { resolvingWorldPlazaChaosArmorSetCombatModifiers } from '@/components/world/equipment/domains/resolvingWorldPlazaChaosArmorSetCombatModifiers';
import { resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers } from '@/components/world/equipment/domains/resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers';
import { resolvingWorldPlazaGlassVeilArmorSetCombatModifiers } from '@/components/world/equipment/domains/resolvingWorldPlazaGlassVeilArmorSetCombatModifiers';
import { resolvingWorldPlazaSiphonArmorSetCombatBundle } from '@/components/world/equipment/domains/resolvingWorldPlazaSiphonArmorSetCombatModifiers';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthDamageRollModifier,
  addingWorldPlazaEntityHealthIncomingDamageHealModifier,
  addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

function clearingWorldPlazaArmorSetCombatModifiers(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    damageRollModifiers: state.damageRollModifiers.filter(
      (modifier) =>
        !modifier.id.startsWith(
          DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX
        )
    ),
    incomingDamageHealModifiers: state.incomingDamageHealModifiers.filter(
      (modifier) =>
        !modifier.id.startsWith(
          DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX
        )
    ),
    physicalDamageLifestealModifiers:
      state.physicalDamageLifestealModifiers.filter(
        (modifier) =>
          !modifier.id.startsWith(
            DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX
          )
      ),
  };
}

/**
 * Clears prior armor-set combat modifiers, then applies Chaos + Bessemer + Glass Veil + craftable plate + Siphon + Apostle Clay.
 */
export function syncingWorldPlazaArmorWornCombatModifiers(
  state: DefiningWorldPlazaEntityHealthState,
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  let nextState = clearingWorldPlazaArmorSetCombatModifiers(state);

  const armorSetModifiers = [
    ...resolvingWorldPlazaChaosArmorSetCombatModifiers(loadout, nowMs),
    ...resolvingWorldPlazaBessemerArmorSetCombatModifiers(loadout, nowMs),
    ...resolvingWorldPlazaGlassVeilArmorSetCombatModifiers(loadout, nowMs),
    ...resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers(loadout, nowMs),
    ...resolvingWorldPlazaApostleClayArmorSetCombatModifiers(loadout, nowMs),
  ];

  for (const modifier of armorSetModifiers) {
    nextState = addingWorldPlazaEntityHealthDamageRollModifier(
      nextState,
      modifier
    );
  }

  const siphonBundle = resolvingWorldPlazaSiphonArmorSetCombatBundle(
    loadout,
    nowMs
  );

  for (const modifier of siphonBundle.damageRollModifiers) {
    nextState = addingWorldPlazaEntityHealthDamageRollModifier(
      nextState,
      modifier
    );
  }

  for (const modifier of siphonBundle.incomingDamageHealModifiers) {
    nextState = addingWorldPlazaEntityHealthIncomingDamageHealModifier(
      nextState,
      modifier
    );
  }

  for (const modifier of siphonBundle.physicalDamageLifestealModifiers) {
    nextState = addingWorldPlazaEntityHealthPhysicalDamageLifestealModifier(
      nextState,
      modifier
    );
  }

  const bessemerShieldFloor =
    resolvingWorldPlazaBessemerArmorFullSetShieldFloor(
      checkingWorldPlazaBessemerArmorFullSetMarkerIsActive(
        nextState.damageRollModifiers
      )
    );

  if (bessemerShieldFloor > 0 && nextState.shieldPoints < bessemerShieldFloor) {
    nextState = {
      ...nextState,
      shieldPoints: bessemerShieldFloor,
    };
  }

  return nextState;
}
