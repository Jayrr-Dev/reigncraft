/** Valid confusion intensity range (1 = minimal, 100 = maximum). */
export const DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MIN = 1;

/** Valid confusion intensity range (1 = minimal, 100 = maximum). */
export const DEFINING_WORLD_PLAZA_CONFUSION_INTENSITY_MAX = 100;

/** Default intensity on the confusion-debuff registry entry. */
export const DEFINING_WORLD_PLAZA_CONFUSION_DEFAULT_INTENSITY = 50;

/** Intensity at which the wobble is barely perceptible. */
export const DEFINING_WORLD_PLAZA_CONFUSION_BARELY_PERCEPTIBLE_INTENSITY = 10;

/** Time to ramp from zero to full confusion after apply (ms). */
export const DEFINING_WORLD_PLAZA_CONFUSION_RAMP_IN_MS = 2000;

/** Time to fade confusion out before expiry (ms). */
export const DEFINING_WORLD_PLAZA_CONFUSION_FADE_OUT_MS = 1500;

/** Max heading deviation in radians at intensity 100. */
export const DEFINING_WORLD_PLAZA_CONFUSION_MAX_DIRECTION_WOBBLE_RAD = 0.85;

/** Min heading deviation in radians at intensity 10. */
export const DEFINING_WORLD_PLAZA_CONFUSION_MIN_DIRECTION_WOBBLE_RAD = 0.04;

/** Base wave frequency in radians per second at full intensity. */
export const DEFINING_WORLD_PLAZA_CONFUSION_BASE_WAVE_FREQUENCY_RAD_PER_SEC = 5.5;

/** Secondary harmonic frequency multiplier for erratic curves. */
export const DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_FREQUENCY_MULTIPLIER = 2.3;

/** Weight of the secondary harmonic relative to the primary sine. */
export const DEFINING_WORLD_PLAZA_CONFUSION_SECONDARY_WAVE_WEIGHT = 0.35;

/** Grid delta magnitude below which confusion deflection is skipped. */
export const DEFINING_WORLD_PLAZA_CONFUSION_MIN_GRID_DELTA_MAGNITUDE = 0.000_001;
