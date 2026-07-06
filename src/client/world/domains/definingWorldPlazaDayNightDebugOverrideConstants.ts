/**
 * Debug presets for forcing the plaza day/night cycle phase.
 *
 * @module components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants
 */

/** Supported debug time-of-day presets. */
export type DefiningWorldPlazaDayNightDebugPreset =
  | 'live'
  | 'custom'
  | 'day'
  | 'afternoon'
  | 'night';

/** Cycle phase sampled for each debug preset (0 = midnight, 0.5 = noon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES: Readonly<
  Record<
    Exclude<DefiningWorldPlazaDayNightDebugPreset, 'live' | 'custom'>,
    number
  >
> = {
  day: 0.5,
  afternoon: 0.625,
  night: 0,
};

/** Button labels for each debug preset. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS: Readonly<
  Record<DefiningWorldPlazaDayNightDebugPreset, string>
> = {
  live: 'Live',
  custom: 'Custom',
  day: 'Day',
  afternoon: 'Afternoon',
  night: 'Night',
};

/** Quick presets shown beside the custom clock picker. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_QUICK_PRESETS: ReadonlyArray<
  Exclude<DefiningWorldPlazaDayNightDebugPreset, 'live' | 'custom'>
> = ['night', 'day', 'afternoon'];

/** Section heading for the time-of-day debug controls. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_HEADING =
  'Time of day';

/** Helper text under the time-of-day debug controls. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION =
  'Override the shared sun cycle for local lighting previews.';

/** Label for the custom clock picker. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_LABEL =
  'Clock time';

/** Dev panel time input styling. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_CLASS_NAME =
  'w-full rounded border border-white/20 bg-black/50 px-2 py-1 text-[11px] font-medium text-white/90 [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

/** Dev panel preset button styling. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_BASE_CLASS_NAME =
  'rounded border px-2 py-1 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

export const STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_ACTIVE_CLASS_NAME =
  'border-violet-300/70 bg-violet-500/25 text-violet-100' as const;

export const STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_INACTIVE_CLASS_NAME =
  'border-white/20 bg-black/50 text-white/90 hover:bg-white/10' as const;
