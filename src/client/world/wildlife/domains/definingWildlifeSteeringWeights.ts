/**
 * Steering weight constants for wildlife context steering.
 *
 * @module components/world/wildlife/domains/definingWildlifeSteeringWeights
 */

export const DEFINING_WILDLIFE_STEERING_WEIGHTS = {
  desireAlignment: 2,
  hazardBlockedPenalty: -50,
  hazardLethalPenalty: Number.NEGATIVE_INFINITY,
  separationRadiusGrid: 1.2,
  separationPenalty: -3,
  lookaheadSteps: 3,
  lookaheadStepDistanceGrid: 0.6,
  candidateDirectionCount: 16,
  /**
   * Max heading change while moving (rad/s). Caps discrete candidate snaps so
   * flee/chase paths curve instead of flipping left/right each re-score.
   */
  maxTurnRadiansPerSecond: 2.8,
  /**
   * Extra score for candidates aligned with the current heading so near-ties
   * keep the smooth arc instead of oscillating between neighbor octants.
   */
  headingContinuityBonus: 0.45,
} as const;
