/**
 * Master volume storage and mixer labels for plaza audio.
 *
 * @module components/world/domains/definingWorldPlazaMasterVolumeConstants
 */

import { STYLING_WORLD_PLAZA_ACTION_BAR_DROPDOWN_LEFT_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
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

/** Label for the music volume slider. */
export const LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER =
  'Music volume' as const;

/** Wrapper anchoring the sound mixer dropdown to its action bar button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_SOUND_MIXER_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel for the master volume mixer below the action bar. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} ${STYLING_WORLD_PLAZA_ACTION_BAR_DROPDOWN_LEFT_ANCHOR_CLASS_NAME} flex w-max min-w-[10rem] max-w-[13rem] flex-col gap-2 p-3 font-body max-md:w-[min(16.5rem,calc(100vw-0.75rem))] max-md:max-w-[calc(100vw-0.75rem)] max-md:gap-2.5 max-md:p-3.5` as const;

/** Label text above the master volume slider. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME =
  'text-xs font-semibold text-ink max-md:text-sm' as const;

/** Master volume range input styling. */
export const STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME =
  'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-poster-teal/20 accent-poster-gold max-md:h-3' as const;

/** Settings row label for return-to-home. */
export const LABELING_WORLD_PLAZA_SETTINGS_EXIT_HOME = 'Home' as const;

/** Settings mixer top row: simple full-width exit-to-home control. */
export const STYLING_WORLD_PLAZA_SETTINGS_EXIT_HOME_BUTTON_CLASS_NAME =
  'mb-1 w-full rounded border border-ink/25 bg-parchment px-2 py-2 text-center text-sm font-bold text-ink max-md:min-h-11 max-md:py-2.5 max-md:text-base' as const;

/** Guide sections opened from Settings (not the Guide book menu). */
export type WorldPlazaSettingsGuideOption = {
  id: Extract<WorldPlazaCodexSectionId, 'controls' | 'mechanics' | 'lore'>;
  label: string;
  icon: string;
};

/** Ordered Controls / Mechanics / Lore links in the settings mixer. */
export const DEFINING_WORLD_PLAZA_SETTINGS_GUIDE_OPTIONS: readonly WorldPlazaSettingsGuideOption[] =
  [
    {
      id: 'controls',
      label: 'Controls',
      icon: 'solar:gamepad-bold',
    },
    {
      id: 'mechanics',
      label: 'Mechanics',
      icon: 'mdi:hammer',
    },
    {
      id: 'lore',
      label: 'Lore',
      icon: 'mdi:book-open-page-variant',
    },
  ] as const;

/** Full-width settings row that opens a guide overlay. */
export const STYLING_WORLD_PLAZA_SETTINGS_GUIDE_BUTTON_CLASS_NAME =
  'flex w-full items-center justify-center gap-2 rounded border border-ink/25 bg-parchment px-2 py-2 text-center text-sm font-bold text-ink max-md:min-h-11 max-md:py-2.5 max-md:text-base' as const;

/** Stack wrapping the settings guide openers under Home. */
export const STYLING_WORLD_PLAZA_SETTINGS_GUIDE_STACK_CLASS_NAME =
  'mb-1 flex w-full flex-col gap-1' as const;
