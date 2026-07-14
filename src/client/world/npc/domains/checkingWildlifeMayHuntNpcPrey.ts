/**
 * Food-chain gate for wildlife hunting NPC prey (player-like mass/tier).
 *
 * @module components/world/npc/domains/checkingWildlifeMayHuntNpcPrey
 */

import {
  DEFINING_WILDLIFE_DEFAULT_MAX_PREY_MASS_RATIO,
  DEFINING_WILDLIFE_SCAVENGER_MAX_PREY_MASS_RATIO,
} from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningNpcPreyTarget } from '@/components/world/npc/domains/definingNpcTypes';

/**
 * Returns true when a predator may opportunistically hunt this NPC.
 * NPCs use human-like mass/tier (no never-triggers trait).
 */
export function checkingWildlifeMayHuntNpcPrey(
  predator: DefiningWildlifeSpeciesDefinition,
  npcPrey: DefiningNpcPreyTarget,
  hungerDriveLevel: 'hungry' | 'starving' = 'hungry'
): boolean {
  if (predator.diet === 'herbivore') {
    return false;
  }

  if (npcPrey.trophicTier < predator.trophicTier) {
    return true;
  }

  if (
    npcPrey.trophicTier >= predator.trophicTier &&
    hungerDriveLevel !== 'starving'
  ) {
    return false;
  }

  const maxPreyMassRatio =
    predator.diet === 'scavenger'
      ? DEFINING_WILDLIFE_SCAVENGER_MAX_PREY_MASS_RATIO
      : DEFINING_WILDLIFE_DEFAULT_MAX_PREY_MASS_RATIO;
  const effectiveRatio =
    hungerDriveLevel === 'starving'
      ? maxPreyMassRatio * 1.35
      : maxPreyMassRatio;

  return npcPrey.massKg <= predator.massKg * effectiveRatio;
}
