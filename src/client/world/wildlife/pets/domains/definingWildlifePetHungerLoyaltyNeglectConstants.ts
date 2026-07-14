/**
 * Declarative hunger → loyalty decay and neglect-abandon tuning.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants
 */

import type { DefiningWildlifeHungerDriveLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Loyalty lost per in-game hour while the companion stays at each hunger drive.
 * Sated never drains; peckish through starving escalate.
 */
export const DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR: Readonly<
  Record<DefiningWildlifeHungerDriveLevel, number>
> = {
  sated: 0,
  peckish: 4,
  hungry: 10,
  starving: 16,
};

/** Minimum continuous hungry+ stretch before neglect abandon (in-game hours). */
export const DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MIN_IN_GAME_HOURS = 3 as const;

/** Maximum continuous hungry+ stretch before neglect abandon (in-game hours). */
export const DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_MAX_IN_GAME_HOURS = 6 as const;

/**
 * Drive levels that count toward the abandon timer (hungry or worse).
 * Peckish still drains loyalty but does not start the leave clock.
 */
export const DEFINING_WILDLIFE_PET_NEGLECT_ABANDON_DRIVE_LEVELS: readonly DefiningWildlifeHungerDriveLevel[] =
  ['hungry', 'starving'];

/** Neglected badge: loyalty gains are halved. */
export const DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_GAIN_MULTIPLIER = 0.5 as const;

/** Neglected badge: loyalty losses are increased by half. */
export const DEFINING_WILDLIFE_PET_NEGLECTED_LOYALTY_LOSS_MULTIPLIER = 1.5 as const;

/** Roster / modal label for the lasting care stigma after neglect abandon. */
export const LABELING_WILDLIFE_PET_NEGLECTED_BADGE = 'Neglected' as const;

/** Short status when the companion left to forage after prolonged hunger. */
export const LABELING_WILDLIFE_PET_NEGLECT_HUNTING_STATUS =
  'Hunting for food' as const;
