/**
 * Marks an Unnoticed attacker as temporarily huntable after hitting wildlife.
 *
 * @module components/world/wildlife/domains/applyingWildlifeUnnoticedProvokeOnWildlifeHit
 */

import { checkingWildlifeSpeciesNeverTriggersWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesNeverTriggersWildlifeAggro';
import { DEFINING_WILDLIFE_UNNOTICED_PROVOKE_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Extends the Unnoticed provoke window when this species lands a wildlife hit.
 * No-op for species without the trait.
 */
export function applyingWildlifeUnnoticedProvokeOnWildlifeHit(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifeSpeciesNeverTriggersWildlifeAggro(attackerSpecies)) {
    return attacker;
  }

  return {
    ...attacker,
    aggroState: {
      ...attacker.aggroState,
      provokedWildlifeAggroUntilMs:
        nowMs + DEFINING_WILDLIFE_UNNOTICED_PROVOKE_DURATION_MS,
    },
  };
}
