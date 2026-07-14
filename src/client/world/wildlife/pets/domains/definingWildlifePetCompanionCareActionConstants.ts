/**
 * Care / command overhead actions for named Familiar+ companions.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants
 */

import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';

/**
 * Below this hunger ratio, a bonded pet seeks the owner (follow) and Feed is
 * available. Matches the player well-fed cutoff (75%).
 */
export const DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD = 0.75 as const;

/** Hover / near dwell before Pet, Feed, and commands appear under the name. */
export const DEFINING_WILDLIFE_PET_COMPANION_CARE_ACTIONS_REVEAL_MS =
  5_000 as const;

/** Overhead Pet action label. */
export const LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_PET = 'Pet' as const;

/** Overhead Feed action label. */
export const LABELING_WILDLIFE_PET_COMPANION_CARE_ACTION_FEED = 'Feed' as const;

/** Vertical stack under the companion name (campfire-style). */
export const STYLING_WILDLIFE_PET_COMPANION_CARE_ACTION_STACK_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_STACK_CLASS_NAME;

/** World-overlay command text (yellow outlined). */
export const STYLING_WILDLIFE_PET_COMPANION_COMMAND_LABEL_BUTTON_CLASS_NAME =
  'world-plaza-companion-command-interaction-label-button pointer-events-auto m-0 cursor-pointer select-none border-0 bg-transparent p-0 text-center text-[10px] font-bold leading-none whitespace-nowrap' as const;
