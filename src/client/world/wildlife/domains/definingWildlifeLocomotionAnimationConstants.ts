/**
 * Declarative tuning so wildlife walk/run feet track body speed.
 *
 * Clip fps assumes a median plaza animal. Slow species (turtle) and Run-sheet
 * walk fallbacks (grey wolf, boar) otherwise moonwalk.
 *
 * @module components/world/wildlife/domains/definingWildlifeLocomotionAnimationConstants
 */

/** Body speed the shared walk clip fps was authored against (grid/s). */
export const DEFINING_WILDLIFE_LOCOMOTION_WALK_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND = 1.5;

/** Body speed the shared run clip fps was authored against (grid/s). */
export const DEFINING_WILDLIFE_LOCOMOTION_RUN_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND = 3.5;

/** Floor so near-stationary animals still show a readable step cycle. */
export const DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MIN = 0.15;

/** Cap so tiny/fast outliers do not blur into a smear. */
export const DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MAX = 1.35;
