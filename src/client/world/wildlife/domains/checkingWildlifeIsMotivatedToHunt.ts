/**
 * Hunger drive checks for proactive wildlife hunting.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeHungerDriveLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns true when the species should actively seek live prey. */
export function checkingWildlifeIsMotivatedToHunt(
  species: DefiningWildlifeSpeciesDefinition,
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  if (species.diet === 'herbivore') {
    return false;
  }

  if (species.diet === 'carnivore' || species.diet === 'scavenger') {
    return driveLevel !== 'sated';
  }

  return driveLevel === 'hungry' || driveLevel === 'starving';
}

/** Returns true when the species should seek edible food on the ground. */
export function checkingWildlifeIsMotivatedToForageGroundFood(
  species: DefiningWildlifeSpeciesDefinition,
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  if (species.diet === 'herbivore') {
    return false;
  }

  return driveLevel !== 'sated';
}
