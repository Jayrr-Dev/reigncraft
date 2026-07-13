/**
 * Labels and shell classes for the action-bar temperature tolerance panel.
 *
 * @module components/world/health/domains/definingWorldPlazaTemperaturePanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Accessible label for the temperature status dropdown. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_PANEL =
  'Temperature tolerance' as const;

/** Title shown at the top of the temperature panel. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE =
  'Tolerance' as const;

/** Label for the cold comfort edge. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_COLD =
  'Cold threshold' as const;

/** Label for the heat comfort edge. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_HEAT =
  'Heat threshold' as const;

/** Tip under the tolerance rows. */
export const LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP =
  'Below cold or above heat starts damage. Buffs can widen this range.' as const;

/** Dropdown panel listing temperature tolerance below the action bar. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[11rem] max-w-[14rem] -translate-x-1/2 flex-col gap-2.5 p-3 font-body` as const;

/** Title row in the temperature panel. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE_CLASS_NAME =
  'text-sm font-bold tracking-wide text-ink' as const;

/** One tolerance row (label + value). */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_CLASS_NAME =
  'flex items-baseline justify-between gap-3' as const;

/** Tolerance row label. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_LABEL_CLASS_NAME =
  'text-[11px] leading-snug text-ink-soft' as const;

/** Tolerance row value. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_VALUE_CLASS_NAME =
  'text-sm font-bold tabular-nums text-ink' as const;

/** Tip footer. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP_CLASS_NAME =
  'border-t border-poster-wood/30 pt-2 text-[10px] italic leading-snug text-ink-soft' as const;
