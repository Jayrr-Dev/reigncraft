/**
 * Stalker temperament tuning: follow distance, pack commit, and aggro timeout.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkConstants
 */

/** Ideal trailing distance while shadowing the player (grid units). */
export const DEFINING_WILDLIFE_STALK_FOLLOW_DISTANCE_GRID = 7.5;

/** Back away when closer than this while stalking. */
export const DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID = 6;

/** Short backward step when the player closes inside the comfort band. */
export const DEFINING_WILDLIFE_STALK_TOO_CLOSE_RETREAT_STEP_GRID = 1.25;

/** Catch up when farther than this while stalking. */
export const DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID = 9.5;

/** Radius around a stalking packmate that pulls same-species animals into the hunt. */
export const DEFINING_WILDLIFE_STALK_PACK_JOIN_RADIUS_GRID = 14;

/** Threat per second while a packmate is already stalking the player. */
export const DEFINING_WILDLIFE_STALK_PACK_JOIN_THREAT_PER_SECOND = 1.1;

/** Minimum hunters required before a pack may use surround formation. */
export const DEFINING_WILDLIFE_STALK_PACK_COMMIT_MIN_COUNT = 3;

/** Reaching this close to an assigned flank point starts the player rush. */
export const DEFINING_WILDLIFE_STALK_SURROUND_SLOT_ARRIVAL_RADIUS_GRID = 1.2;

/** Player/prey health ratio below which stalkers commit to a kill. */
export const DEFINING_WILDLIFE_STALK_PREY_LOW_HEALTH_RATIO = 0.5;

/** Prey stamina ratio treated as fully spent for stalk triggers. */
export const DEFINING_WILDLIFE_STALK_PREY_STAMINA_DEPLETED_RATIO = 0.02;

/** Drop player stalk aggro when no kill trigger fired within this window. */
export const DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS = 120_000;

/** Standing still this long lets stalkers close in for the kill. */
export const DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS = 8_000;

/** Mandatory shadowing phase after aggro before pack size can trigger a rush. */
export const DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS = 15_000;

/** Prey still this long while a stalker is in range triggers innocent idle. */
export const DEFINING_WILDLIFE_STALK_CAUGHT_UP_IDLE_PREY_STILL_MS = 1_200;

/** Walk toward a flank point until within this distance, then run the rest. */
export const DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID = 5.5;

/** Closest flank offset from the player during a pack surround. */
export const DEFINING_WILDLIFE_STALK_SURROUND_RADIUS_MIN_GRID = 2.4;

/** Farthest flank offset from the player during a pack surround. */
export const DEFINING_WILDLIFE_STALK_SURROUND_RADIUS_MAX_GRID = 4.4;

/** Lateral arc spread between packmates (radians per slot from center). */
export const DEFINING_WILDLIFE_STALK_SURROUND_LATERAL_SPREAD_RAD = 0.42;

/** Extra bearing jitter per packmate so flanks do not form a perfect ring. */
export const DEFINING_WILDLIFE_STALK_SURROUND_BEARING_JITTER_RAD = 0.28;

/** Return to shadowing if the player is still alive this long after the first hit. */
export const DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS = 10_000;

/** Chance the pack abandons a shadow hunt after the player wounds a stalker. */
export const DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_CHANCE = 0.65;

/** Flee distance when a stalk pack abandons the hunt. */
export const DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID = 18;

/** Time bucket for alpha prey-pick rolls while no hunt lock is active. */
export const DEFINING_WILDLIFE_STALK_PREY_PICK_BUCKET_MS = 15_000;
