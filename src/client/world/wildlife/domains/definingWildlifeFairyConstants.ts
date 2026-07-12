/**
 * Declarative tuning for the procedural fairy companion species.
 *
 * Fairies render as a hard gold pixel circle with a soft aura and publish a
 * night light. They trail the local player at night, then wander away at dawn.
 *
 * @module components/world/wildlife/domains/definingWildlifeFairyConstants
 */

/** Species id registered in the wildlife catalog. */
export const DEFINING_WILDLIFE_FAIRY_SPECIES_ID = 'fairy' as const;

/** Hard core body radius in screen pixels (reads as a single gold pixel blob). */
export const DEFINING_WILDLIFE_FAIRY_BODY_RADIUS_PX = 1.5;

/** Outer soft aura radius in screen pixels. */
export const DEFINING_WILDLIFE_FAIRY_AURA_RADIUS_PX = 5;

/** Mid aura ring between core and outer glow. */
export const DEFINING_WILDLIFE_FAIRY_AURA_MID_RADIUS_PX = 3;

/** Bright gold core fill. */
export const DEFINING_WILDLIFE_FAIRY_BODY_COLOR = 0xfff1a8;

/** Dead corpse core (no aura). */
export const DEFINING_WILDLIFE_FAIRY_DEAD_BODY_COLOR = 0x8a8a8a;

/** Deeper gold used for the glowing aura rings. */
export const DEFINING_WILDLIFE_FAIRY_AURA_COLOR = 0xffd24a;

/** Core fill alpha. */
export const DEFINING_WILDLIFE_FAIRY_BODY_ALPHA = 1;

/** Mid aura ring alpha at rest. */
export const DEFINING_WILDLIFE_FAIRY_AURA_MID_ALPHA = 0.45;

/** Outer aura ring alpha at rest. */
export const DEFINING_WILDLIFE_FAIRY_AURA_OUTER_ALPHA = 0.22;

/** Pulse amplitude added to aura alphas (0..1). */
export const DEFINING_WILDLIFE_FAIRY_AURA_PULSE_AMPLITUDE = 0.12;

/** Aura pulse period in milliseconds. */
export const DEFINING_WILDLIFE_FAIRY_AURA_PULSE_PERIOD_MS = 1_600;

/** Night light footprint relative to the baked torch texture (1 = torch size). */
export const DEFINING_WILDLIFE_FAIRY_LIGHT_RADIUS_SCALE = 1.15;

/** Night light strength 0..1 (multiplied by the day/night darkness curve). */
export const DEFINING_WILDLIFE_FAIRY_LIGHT_BRIGHTNESS = 1;

/** Warm gold tint for the night light hole and ground glow. */
export const DEFINING_WILDLIFE_FAIRY_LIGHT_TINT = 0xffe08a;

/** Light-store owner namespace for all fairy instances. */
export const DEFINING_WILDLIFE_FAIRY_LIGHT_OWNER_KEY = 'wildlife-fairy';

/** Base hover height above the grid anchor (screen px). Fairies float. */
export const DEFINING_WILDLIFE_FAIRY_HOVER_LIFT_PX = 14;

/** Vertical bob amplitude around the hover height (screen px). */
export const DEFINING_WILDLIFE_FAIRY_HOVER_BOB_AMPLITUDE_PX = 4;

/** Vertical bob period (ms); slow so the float reads as graceful. */
export const DEFINING_WILDLIFE_FAIRY_HOVER_BOB_PERIOD_MS = 2_800;

/** Horizontal sway amplitude (screen px). */
export const DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_AMPLITUDE_PX = 3;

/** Horizontal sway period (ms); offset from the bob so the path traces a lazy figure. */
export const DEFINING_WILDLIFE_FAIRY_HOVER_SWAY_PERIOD_MS = 4_400;

/**
 * Exponential smoothing time constant (ms) for the orb's screen position.
 * The drawn orb eases toward the sim position, so starts and stops glide
 * instead of snapping. Higher = floatier / laggier trail.
 */
export const DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_TAU_MS = 260;

/**
 * Soft trail cap (grid units): if easing falls further behind the sim point
 * than this, the orb is pulled along at the cap so fast runs stretch the
 * glide without hard-teleporting.
 */
export const DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_TRAIL_DISTANCE_GRID = 1.6;

/**
 * Max milliseconds fed into one ease step. Caps catch-up after frame hitches
 * so a long stall glides back instead of visually snapping.
 */
export const DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_STEP_MS = 64;

/**
 * Virtual frame height used for name-tag / speech lift math on the procedural
 * orb. Sized so tags clear the hover lift + bob + aura instead of overlapping
 * the glowing body (tag lift ends up ~34px above the grid anchor).
 */
export const DEFINING_WILDLIFE_FAIRY_PRESENTATION_FRAME_HEIGHT_PX = 96;

/**
 * Stop chasing the player beyond this grid distance. Inside the radius the
 * fairy follows again; outside it wanders in place until the player returns.
 */
export const DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID = 24;

/**
 * After sunrise, fairies flee for this long before soft-despawning.
 * Betrayed fairies use the same timer.
 */
export const DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS = 12_000;

/**
 * Soft-despawn as soon as a departing fairy is this far from the player
 * (grid), even if the departure timer has not finished.
 */
export const DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DESPAWN_DISTANCE_GRID = 22;
