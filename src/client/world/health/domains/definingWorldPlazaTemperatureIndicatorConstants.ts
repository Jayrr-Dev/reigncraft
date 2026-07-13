/**
 * Action-bar temperature orb: thermometer range, colors, and labels.
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/** Accessible name for the temperature orb. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE =
  'Temperature' as const;

/**
 * Fill ratio 0 maps to this ambient floor (°C).
 * Matches climate noise cold extreme.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS =
  DEFINING_WORLD_PLAZA_TEMPERATURE_CLIMATE_MIN_CELSIUS;

/**
 * Fill ratio 1 maps to this heat ceiling (°C).
 * Campfire max; lava and hotter clamp to full.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS =
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS;

/**
 * Celsius where bluish tones begin (at and below).
 * Above this, the orb stays white-toned until the warm stop.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS = 15;

/**
 * Celsius where red tones begin (at and above).
 * Below this (down to the cool stop), the orb stays white-toned.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS = 25;

/** Hot stop for the solid temp-driven fill color (at indicator max). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR =
  '#e03328' as const;

/** Soft red at the warm comfort edge (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR =
  '#d45a4a' as const;

/** White mid stop across the comfortable band. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR =
  '#f3efe8' as const;

/** Cool-white edge where bluish tones begin (°C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR =
  '#e8eef5' as const;

/** Cold stop for the solid temp-driven fill color (at indicator min). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR =
  '#3b7fd4' as const;

/** Wrapper anchoring the temperature orb in the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** CSS class for the temperature orb shell (bronze ring). */
export const STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_ORB_CLASS_NAME =
  'plaza-temperature-orb relative flex shrink-0 items-center justify-center rounded-full' as const;

/** CSS class for the clipped fill disc inside the temperature orb. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_FILL_DISC_CLASS_NAME =
  'absolute inset-[3px] overflow-hidden rounded-full transition-[background-color] duration-200 ease-out' as const;

/** CSS class for the centered temperature readout. */
export const STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_VALUE_CLASS_NAME =
  'relative z-10 shrink-0 px-0.5 text-center font-bold leading-none tabular-nums tracking-tight text-white' as const;
