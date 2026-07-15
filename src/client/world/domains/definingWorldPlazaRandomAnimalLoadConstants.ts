/**
 * Declarative copy and pool rules for the Random Animal save-slot load.
 *
 * @module components/world/domains/definingWorldPlazaRandomAnimalLoadConstants
 */

import { PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX } from '../../../shared/plazaGameSession';

/** Save slot index that always boots the Random Animal load profile. */
export const DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_SAVE_SLOT_INDEX =
  PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX;

/** Home-screen title for the Random Animal slot. */
export const LABELING_WORLD_PLAZA_RANDOM_ANIMAL_LOAD_SLOT_TITLE =
  'Random Animal' as const;

/** Home-screen subtitle when the Random Animal slot has no save yet. */
export const LABELING_WORLD_PLAZA_RANDOM_ANIMAL_LOAD_SLOT_SUBTITLE_NEW =
  'Start as a random creature' as const;

/**
 * Playable animal skins excluded from the random pool (fantasy / special forms).
 */
export const DEFINING_WORLD_PLAZA_RANDOM_ANIMAL_EXCLUDED_SKIN_IDS = [
  'fairy',
  'cyroborn',
  'sunhead',
  'elite-wolf',
] as const;
