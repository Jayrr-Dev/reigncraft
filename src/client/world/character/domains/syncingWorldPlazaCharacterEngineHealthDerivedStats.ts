/**
 * Syncs character-engine derived vitals into existing health without a full
 * respawn (keeps death, current HP clamp, buffs).
 *
 * @module components/world/character/domains/syncingWorldPlazaCharacterEngineHealthDerivedStats
 */

import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

/**
 * Updates base max health and regen from Spritcore + character stats.
 * Preserves `isDead` and does not heal above the previous current HP.
 */
export function syncingWorldPlazaCharacterEngineHealthDerivedStats(
  state: DefiningWorldPlazaEntityHealthState,
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  spritcoreBonuses: WorldPlazaSpritcoreUpgradeBonuses
): DefiningWorldPlazaEntityHealthState {
  const derivedStats = computingWorldPlazaCharacterEngineDerivedStats(
    definition,
    spritcoreBonuses
  );

  return {
    ...state,
    baseMaxHealth: derivedStats.effectiveMaxHealth,
    currentHealth: state.isDead
      ? 0
      : Math.min(state.currentHealth, derivedStats.effectiveMaxHealth),
    regen: {
      ...state.regen,
      healthPerSecond: derivedStats.healthRegenPerSecond,
    },
  };
}
