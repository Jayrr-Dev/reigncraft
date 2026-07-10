/**
 * Adrenaline Rush: restore stamina when a species first enters flee.
 *
 * @module components/world/wildlife/domains/applyingWildlifeAdrenalineRushOnFleeEntry
 */

import { DEFINING_WILDLIFE_ADRENALINE_RUSH_STAMINA_RESTORE_RATIO } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
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
 * When a species with `adrenalineRush` transitions into flee, restores stamina
 * to the configured fraction of its max bar and clears exhaustion.
 */
export function applyingWildlifeAdrenalineRushOnFleeEntry({
  instance,
  species,
  previousIntentMode,
  nextIntentMode,
}: ApplyingWildlifeAdrenalineRushOnFleeEntryParams): DefiningWildlifeInstance {
  if (!species.adrenalineRush) {
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
    },
  };
}
