/**
 * Debug presets for forcing the plaza day/night cycle phase.
 *
 * @module components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants
 */

/** Supported debug time-of-day presets. */
export type DefiningWorldPlazaDayNightDebugPreset = "live" | "day" | "afternoon" | "night";

/** Cycle phase sampled for each debug preset (0 = midnight, 0.5 = noon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES: Readonly<
  Record<Exclude<DefiningWorldPlazaDayNightDebugPreset, "live">, number>
> = {
  day: 0.5,
  afternoon: 0.625,
  night: 0,
};

/** Button labels for each debug preset. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS: Readonly<
  Record<DefiningWorldPlazaDayNightDebugPreset, string>
> = {
  live: "Live",
  day: "Day",
  afternoon: "Afternoon",
  night: "Night",
};

/** Section heading for the time-of-day debug controls. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_HEADING = "Time of day";

/** Helper text under the time-of-day debug buttons. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION =
  "Override the shared sun cycle for local lighting previews.";
