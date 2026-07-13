/**
 * Food chain derivation from trophic tier and mass.
 *
 * @module components/world/wildlife/domains/definingWildlifeFoodChain
 */

import { checkingWildlifeSpeciesNeverTriggersWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesNeverTriggersWildlifeAggro';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';

/** Default max prey mass as a fraction of predator mass. */
export const DEFINING_WILDLIFE_DEFAULT_MAX_PREY_MASS_RATIO = 1.1;

/** Scavengers may target corpses / weaker prey with a higher mass ratio. */
export const DEFINING_WILDLIFE_SCAVENGER_MAX_PREY_MASS_RATIO = 1.4;

/**
 * Returns true when predator may hunt prey based on trophic tier and mass.
 *
 * Unnoticed prey are skipped for opportunistic hunting unless they recently
 * attacked wildlife (`preyHasProvokedWildlifeAggro`). Damage-based threat on
 * the victim still applies regardless of this check.
 */
export function checkingWildlifePredatorMayHuntPrey(
  predator: DefiningWildlifeSpeciesDefinition,
  prey: DefiningWildlifeSpeciesDefinition,
  hungerDriveLevel: 'hungry' | 'starving' = 'hungry',
  options?: {
    preyHasProvokedWildlifeAggro?: boolean;
  }
): boolean {
  if (
    checkingWildlifeSpeciesNeverTriggersWildlifeAggro(prey) &&
    !options?.preyHasProvokedWildlifeAggro
  ) {
    return false;
  }

  if (predator.preyDenySpeciesIds?.includes(prey.speciesId)) {
    return false;
  }

  if (predator.preyAllowSpeciesIds?.includes(prey.speciesId)) {
    return true;
  }

  if (predator.diet === 'herbivore') {
    return false;
  }

  if (prey.trophicTier < predator.trophicTier) {
    return true;
  }

  if (
    prey.trophicTier >= predator.trophicTier &&
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

  return prey.massKg <= predator.massKg * effectiveRatio;
}

/**
 * Returns true when a predator may attack the player at the given hunger drive.
 */
export function checkingWildlifePredatorMayAttackPlayer(
  predator: DefiningWildlifeSpeciesDefinition,
  hungerDriveLevel: 'sated' | 'peckish' | 'hungry' | 'starving',
  isAggroed: boolean,
  aggressionLevel: DefiningWildlifeAggressionLevel = 'normal'
): boolean {
  if (isAggroed) {
    return true;
  }

  const aggressionProfile =
    resolvingWildlifeAggressionLevelProfile(aggressionLevel);

  if (aggressionProfile.aggressionLevel === 'tame') {
    return false;
  }

  if (predator.diet === 'herbivore') {
    return false;
  }

  if (predator.temperamentId === 'retaliator') {
    return isAggroed;
  }

  if (
    predator.temperamentId === 'pack_hunter' ||
    predator.temperamentId === 'stalker'
  ) {
    return isAggroed;
  }

  if (
    predator.temperamentId === 'skittish' ||
    predator.temperamentId === 'passive'
  ) {
    return false;
  }

  if (aggressionProfile.mayAttackPlayerOnSight) {
    return true;
  }

  return hungerDriveLevel === 'starving' || hungerDriveLevel === 'hungry';
}

/** Player is treated as trophic tier 2 with reference mass for food chain checks. */
export const DEFINING_WILDLIFE_PLAYER_REFERENCE_MASS_KG = 70;

/** Synthetic prey id used in food chain checks for the player. */
export const DEFINING_WILDLIFE_PLAYER_PREY_SPECIES_ID =
  'player' as DefiningWildlifeSpeciesId;
