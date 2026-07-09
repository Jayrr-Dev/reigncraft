/**
 * Wildlife sleep schedule tuning and wake-startle behavior.
 *
 * @module components/world/wildlife/domains/definingWildlifeSleepConstants
 */

/** How long a startled wake reaction lasts before normal AI resumes (ms). */
export const DEFINING_WILDLIFE_SLEEP_WAKE_STARTLE_DURATION_MS = 3500;

/** How long after combat ends before schedule sleep may resume (ms). */
export const DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS = 45_000;

/** How long one sleep speech bubble stays visible before refresh (ms). */
export const DEFINING_WILDLIFE_SLEEP_SPEECH_BUBBLE_DURATION_MS = 3200;

/** Cycle-phase half-width around sunrise and sunset for crepuscular activity. */
export const DEFINING_WILDLIFE_CREPUSCULAR_TWILIGHT_PHASE_HALF_WIDTH = 0.06;

/**
 * Cathemeral animals alternate sleep and wake in fixed phase buckets across
 * the full day/night cycle.
 */
export const DEFINING_WILDLIFE_CATHEMERAL_PHASE_BUCKET_COUNT = 12;

/** Salt for seeding cathemeral sleep bucket rolls per instance. */
export const DEFINING_WILDLIFE_CATHEMERAL_SLEEP_ROLL_SALT = 7811;

/**
 * Forced EV outcome tier on the first hit against a sleeping animal.
 * Uses the combat bell-curve lethal band (≥ 2σ), not a guaranteed kill.
 */
export const DEFINING_WILDLIFE_SLEEP_AMBUSH_DAMAGE_OUTCOME_TIER =
  'lethal' as const;

/** Grid radius around a struck sleeper to roll nearby same-species wake chances. */
export const DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_RADIUS_GRID = 10;

/**
 * Per-neighbor chance (0..1) that another sleeping animal of the same species
 * startles awake when a nearby packmate is attacked.
 */
export const DEFINING_WILDLIFE_SLEEP_NEARBY_WAKE_CHANCE = 0.4;

/**
 * Chance (0..1) that bumping a sleeping animal wakes it for this contact.
 * Rolled once when the player first overlaps the sleeper; stays locked until
 * contact ends so continuous overlap does not re-roll every frame.
 */
export const DEFINING_WILDLIFE_SLEEP_BUMP_WAKE_CHANCE = 0.33;
