/**
 * Seeds entity health state from a declarative character definition.
 *
 * @module components/world/character/domains/creatingWorldPlazaCharacterEngineInitialHealthState
 */

import { applyingWorldPlazaCharacterEngineImmunities } from '@/components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities';
import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { applyingWorldPlazaDevQaPlayerHealthOverride } from '@/components/world/domains/applyingWorldPlazaDevQaPlayerHealthOverride';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

/**
 * Re-applies character immunities and starting status effects after a
 * death revive wiped transient buffs/debuffs.
 */
export function reseedingWorldPlazaCharacterEngineHealthBaseline(
  state: DefiningWorldPlazaEntityHealthState,
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  nowMs = 0
): DefiningWorldPlazaEntityHealthState {
  let nextState = applyingWorldPlazaCharacterEngineImmunities(
    state,
    definition
  );

  for (const buffId of definition.startingStatusEffectIds) {
    nextState = applyingWorldPlazaEntityBuff(nextState, buffId, nowMs);
  }

  return nextState;
}

/**
 * Creates health state tuned to one character definition.
 */
export function creatingWorldPlazaCharacterEngineInitialHealthState(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  nowMs = 0
): DefiningWorldPlazaEntityHealthState {
  const derivedStats =
    computingWorldPlazaCharacterEngineDerivedStats(definition);

  const state: DefiningWorldPlazaEntityHealthState = {
    ...creatingWorldPlazaEntityHealthInitialState(),
    baseMaxHealth: derivedStats.effectiveMaxHealth,
    currentHealth: derivedStats.effectiveMaxHealth,
    regen: {
      ...creatingWorldPlazaEntityHealthInitialState().regen,
      healthPerSecond: derivedStats.healthRegenPerSecond,
    },
    damageKindImmunities: [],
  };

  return applyingWorldPlazaDevQaPlayerHealthOverride(
    reseedingWorldPlazaCharacterEngineHealthBaseline(
      state,
      definition,
      nowMs
    )
  );
}
