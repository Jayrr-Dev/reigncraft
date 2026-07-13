/**
 * Solo stalker temperament tuning.
 *
 * Follow band and opening shadow length reuse pack stalk constants
 * (`DEFINING_WILDLIFE_STALK_FOLLOW_*`, `DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS`).
 * After the opening shadow, solo stalkers rush on prey weakness OR when hungry /
 * starving / aggressive (see `checkingWildlifeSoloStalkerKillConditions`).
 *
 * @module components/world/wildlife/domains/definingWildlifeSoloStalkerConstants
 */

/** Marker that solo stalkers share the pack opening-shadow duration. */
export const DEFINING_WILDLIFE_SOLO_STALKER_USES_SHARED_INITIAL_PHASE = true;
