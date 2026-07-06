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
} as const;
