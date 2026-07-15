import {
  DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS,
  checkingWorldPlazaEntityDamageKindImmunityGroupIsActive,
  togglingWorldPlazaEntityDamageKindImmunityGroup,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Turns fated immunity on (never off) and clears pending fated marks.
 * Safe for consumables that must not toggle immunity away.
 */
export function enablingWorldPlazaEntityFatedImmunity(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  const alreadyActive = checkingWorldPlazaEntityDamageKindImmunityGroupIsActive(
    state.damageKindImmunities,
    DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS
  );

  if (alreadyActive) {
    return {
      ...state,
      potentialDamageEffects: [],
    };
  }

  return {
    ...state,
    damageKindImmunities: togglingWorldPlazaEntityDamageKindImmunityGroup(
      state.damageKindImmunities,
      DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS
    ),
    potentialDamageEffects: [],
  };
}
