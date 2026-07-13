/**
 * Labels and shell classes for the action-bar day/night clock panel.
 *
 * @module components/world/domains/definingWorldPlazaDayNightPanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Accessible label for the day/night status dropdown. */
export const LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL = 'World clock' as const;

/** Title shown at the top of the day/night panel. */
export const LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE =
  'World clock' as const;

/** Label for the clock time row. */
export const LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME = 'Time' as const;

/** Label for the day index row. */
export const LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_DAY = 'Day' as const;

/** Tip under the clock rows. */
export const LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP =
  'Shared across every player in this world.' as const;

/** Dropdown panel listing time and day below the action bar. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[10rem] max-w-[13rem] -translate-x-1/2 flex-col gap-2.5 p-3 font-body` as const;

/** Title row in the day/night panel. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE_CLASS_NAME =
  'text-sm font-bold tracking-wide text-ink' as const;

/** One clock row (label + value). */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_CLASS_NAME =
  'flex items-baseline justify-between gap-3' as const;

/** Clock row label. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_LABEL_CLASS_NAME =
  'text-[11px] leading-snug text-ink-soft' as const;

/** Clock row value. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_VALUE_CLASS_NAME =
  'text-sm font-bold tabular-nums text-ink' as const;

/** Large time readout. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME_VALUE_CLASS_NAME =
  'text-2xl font-bold tabular-nums leading-none text-ink' as const;

/** Tip footer. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP_CLASS_NAME =
  'border-t border-poster-wood/30 pt-2 text-[10px] italic leading-snug text-ink-soft' as const;
