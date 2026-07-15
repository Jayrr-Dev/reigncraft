/**
 * Declarative copy and rules for the Perma Death save-slot load.
 *
 * @module components/world/domains/definingWorldPlazaPermaDeathLoadConstants
 */

import { PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX } from '../../../shared/plazaGameSession';

/** Save slot index that always boots the Perma Death load profile. */
export const DEFINING_WORLD_PLAZA_PERMA_DEATH_SAVE_SLOT_INDEX =
  PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX;

/** Home-screen title for the Perma Death slot. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_LOAD_SLOT_TITLE =
  'Perma Death' as const;

/** Home-screen subtitle when the Perma Death slot has no save yet. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_LOAD_SLOT_SUBTITLE_NEW =
  'One life. Pick your form.' as const;

/** Iconify id for the Perma Death save-slot action pill. */
export const DEFINING_WORLD_PLAZA_PERMA_DEATH_LOAD_SLOT_ACTION_ICON =
  'game-icons:death-skull' as const;

/** Death overlay flavor when the run ends in Perma Death. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_DEATH_SCREEN_FLAVOR_TEXT =
  'Your run is over. Manus keeps your soul, but this journey ends here.' as const;

/** Death overlay action that returns to the home screen. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_DEATH_SCREEN_RETURN_HOME_LABEL =
  'Return Home' as const;

/** Character picker panel title on the home screen. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_TITLE =
  'Choose Your Form' as const;

/** Character picker panel subtitle on the home screen. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_SUBTITLE =
  'Five forms for this run. Death wipes this slot.' as const;

/** How many playable forms the Perma Death picker offers each new run. */
export const DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT = 5;

/** Primary action when a character is selected. */
export const LABELING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_LABEL =
  'Begin Run' as const;

/** Scrollable list region in the Perma Death character picker. */
export const STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_LIST_CLASS_NAME =
  'flex max-h-56 flex-col gap-1 overflow-y-auto rounded-md border border-ink/15 bg-parchment/60 p-1 sm:max-h-64' as const;

/** Base classes for one character option row. */
export const STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_BASE_CLASS_NAME =
  'flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-semibold transition' as const;

/** Selected character option row. */
export const STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_SELECTED_CLASS_NAME =
  'border-poster-orange/70 bg-[linear-gradient(180deg,#e8a05c_0%,#c47a3a_100%)] text-parchment shadow-[0_2px_0_0_rgba(80,32,12,0.5)]' as const;

/** Unselected character option row. */
export const STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_IDLE_CLASS_NAME =
  'border-ink/10 bg-parchment text-ink hover:border-poster-teal/40 hover:bg-parchment/90' as const;

/** Disabled start button when no character is selected. */
export const STYLING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_START_DISABLED_CLASS_NAME =
  'cursor-not-allowed opacity-50' as const;
