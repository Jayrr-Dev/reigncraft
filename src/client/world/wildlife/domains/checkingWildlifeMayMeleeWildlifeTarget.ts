/**
 * Whether one wildlife instance may land melee on another.
 *
 * Hunt food-chain rules gate opportunistic prey swings. Active threat targets
 * always may be hit so retaliators can fight back against higher-tier attackers.
 *
 * @module components/world/wildlife/domains/checkingWildlifeMayMeleeWildlifeTarget
 */

import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type CheckingWildlifeMayMeleeWildlifeTargetParams = {
  attackerSpecies: DefiningWildlifeSpeciesDefinition;
  targetSpecies: DefiningWildlifeSpeciesDefinition;
  targetInstanceId: string;
  activeTargetId: string | null;
  hungerDriveLevel?: 'hungry' | 'starving';
};

/**
 * Returns true when the attacker may swing at this wildlife target.
 */
export function checkingWildlifeMayMeleeWildlifeTarget({
  attackerSpecies,
  targetSpecies,
  targetInstanceId,
  activeTargetId,
  hungerDriveLevel = 'hungry',
}: CheckingWildlifeMayMeleeWildlifeTargetParams): boolean {
  if (activeTargetId === targetInstanceId) {
    return true;
  }

  return checkingWildlifePredatorMayHuntPrey(
    attackerSpecies,
    targetSpecies,
    hungerDriveLevel
  );
}
