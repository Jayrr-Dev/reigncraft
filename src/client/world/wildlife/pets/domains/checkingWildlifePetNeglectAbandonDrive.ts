/**
 * True when hunger drive counts toward the neglect-abandon timer.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetNeglectAbandonDrive
 */

import type { DefiningWildlifeHungerDriveLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_DRIVE_LEVELS } from '@/components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants';

/** Hungry or starving companions accumulate abandon time; peckish does not. */
export function checkingWildlifePetNeglectAbandonDrive(
  driveLevel: DefiningWildlifeHungerDriveLevel
): boolean {
  return DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_DRIVE_LEVELS.includes(
    driveLevel
  );
}
