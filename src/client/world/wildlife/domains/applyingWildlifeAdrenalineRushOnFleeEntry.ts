/**
 * Adrenaline Rush: restore stamina when a species first enters flee.
 *
 * @module components/world/wildlife/domains/applyingWildlifeAdrenalineRushOnFleeEntry
 */

import { checkingWildlifeSpeciesHasPassiveTrait } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait';
import { DEFINING_WILDLIFE_ADRENALINE_RUSH_STAMINA_RESTORE_RATIO } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import { DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER } from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceMaxStaminaRatio } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type ApplyingWildlifeAdrenalineRushOnFleeEntryParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  previousIntentMode: DefiningWildlifeBehaviorIntent['mode'];
  nextIntentMode: DefiningWildlifeBehaviorIntent['mode'];
};

/**
 * When a species with the `adrenaline-rush` passive transitions into flee,
 * restores stamina to the configured fraction of its max bar and clears exhaustion.
 */
export function applyingWildlifeAdrenalineRushOnFleeEntry({
  instance,
  species,
  previousIntentMode,
  nextIntentMode,
}: ApplyingWildlifeAdrenalineRushOnFleeEntryParams): DefiningWildlifeInstance {
  if (!checkingWildlifeSpeciesHasPassiveTrait(species, 'adrenaline-rush')) {
    return instance;
  }

  if (nextIntentMode !== 'flee' || previousIntentMode === 'flee') {
    return instance;
  }

  const maxStaminaRatio = resolvingWildlifeInstanceMaxStaminaRatio(
    instance,
    species
  );
  const restoredRatio = Math.min(
    maxStaminaRatio,
    maxStaminaRatio * DEFINING_WILDLIFE_ADRENALINE_RUSH_STAMINA_RESTORE_RATIO
  );

  if (
    instance.staminaState.staminaRatio >= restoredRatio &&
    !instance.staminaState.isExhausted
  ) {
    return instance;
  }

  return {
    ...instance,
    staminaState: {
      ...instance.staminaState,
      staminaRatio: restoredRatio,
      isExhausted: false,
      fatigueTier:
        restoredRatio >= maxStaminaRatio
          ? DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER
          : (instance.staminaState.fatigueTier ??
            DEFINING_WILDLIFE_STAMINA_FATIGUE_INITIAL_TIER),
    },
  };
}
