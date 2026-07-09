/**
 * Master volume storage and mixer labels for plaza audio.
 *
 * @module components/world/domains/definingWorldPlazaMasterVolumeConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** localStorage key for the master volume preference (0–1). */
export const DEFINING_WORLD_PLAZA_MASTER_VOLUME_STORAGE_KEY =
  'world-plaza-master-volume' as const;

/** Default master volume when no saved preference exists. */
export const DEFINING_WORLD_PLAZA_MASTER_VOLUME_DEFAULT = 1 as const;

/** Accessible label for the settings action in the plaza action bar. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_SETTINGS = 'Settings' as const;

/** Accessible label for the settings dropdown (volume + gameplay toggles). */
export const LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER = 'Settings' as const;

/** Label for the master volume slider. */
export const LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER =
  'Master volume' as const;

/** Wrapper anchoring the sound mixer dropdown to its action bar button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_SOUND_MIXER_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel for the master volume mixer below the action bar. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[10rem] max-w-[13rem] -translate-x-1/2 flex-col gap-2 p-3 font-body` as const;

/** Label text above the master volume slider. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME =
  'text-xs font-semibold text-ink' as const;

/** Master volume range input styling. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME =
  'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-poster-teal/20 accent-poster-gold' as const;
