/**
 * Seeds entity health state from a declarative character definition.
 *
 * @module components/world/character/domains/creatingWorldPlazaCharacterEngineInitialHealthState
 */

import { applyingWorldPlazaCharacterEngineImmunities } from '@/components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities';
import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

/**
 * Creates health state tuned to one character definition.
 */
export function creatingWorldPlazaCharacterEngineInitialHealthState(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  nowMs = 0
): DefiningWorldPlazaEntityHealthState {
  const derivedStats =
    computingWorldPlazaCharacterEngineDerivedStats(definition);

  let state: DefiningWorldPlazaEntityHealthState = {
    ...creatingWorldPlazaEntityHealthInitialState(),
    baseMaxHealth: derivedStats.effectiveMaxHealth,
    currentHealth: derivedStats.effectiveMaxHealth,
    regen: {
      ...creatingWorldPlazaEntityHealthInitialState().regen,
      healthPerSecond: derivedStats.healthRegenPerSecond,
    },
    damageKindImmunities: [],
  };

  state = applyingWorldPlazaCharacterEngineImmunities(state, definition);

  for (const buffId of definition.startingStatusEffectIds) {
    state = applyingWorldPlazaEntityBuff(state, buffId, nowMs);
  }

  return state;
}
