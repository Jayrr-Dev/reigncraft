/**
 * Action-bar temperature orb: thermometer range, gradient palette, and labels.
 *
 * Cold ramp: white → light blue → sky blue. Whole comfort band stays sky blue.
 * Heat ramp past comfort high: peach → red.
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

/** Shared fill for the entire character comfort band. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE = '#87ceeb';

/**
 * Ordered cold→hot orb fill palette (9 stops).
 *
 * Cold (0–2): white → light blue → sky blue.
 * Comfort (3–5): sky blue flat across the band.
 * Hot (6–8): peach → red past comfort high.
 */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS = [
  '#ffffff',
  '#c8e6ff',
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_SKY_BLUE,
  '#ff9e81',
  '#ff6846',
  '#ff0000',
] as const;

/** Coldest stop (indicator min °C): white. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR =
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS[0];

/** Cool comfort edge (character comfort low °C): sky blue. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR =
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS[3];

/** Comfort midpoint: sky blue. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR =
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS[4];

/** Warm comfort edge (character comfort high °C): sky blue. */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR =
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS[5];

/** Hottest stop (indicator max °C). */
export const DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR =
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS[8];

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
