/**
 * Applies study float + Pet cooldown after a successful living companion pet.
 *
 * @module components/world/wildlife/domains/applyingWildlifeDocilePetComplete
 */

import { rollingWildlifeDocilePetCooldownDurationMs } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { enqueueingWildlifeDocilePetStudyFloatFeedback } from '@/components/world/wildlife/domains/enqueueingWildlifeDocilePetStudyFloatFeedback';

export type ApplyingWildlifeDocilePetCompleteParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly studyPoints: number;
  readonly nowMs: number;
  /** Optional `[0, 1)` roll for deterministic tests. */
  readonly cooldownRollUnit?: number;
};

/**
 * Awards the Pet study float and starts the 8–16 in-game-hour cooldown.
 */
export function applyingWildlifeDocilePetComplete({
  instance,
  studyPoints,
  nowMs,
  cooldownRollUnit,
}: ApplyingWildlifeDocilePetCompleteParams): DefiningWildlifeInstance {
  const withFloat = enqueueingWildlifeDocilePetStudyFloatFeedback({
    instance,
    studyPoints,
    nowMs,
  });
  const cooldownDurationMs =
    cooldownRollUnit === undefined
      ? rollingWildlifeDocilePetCooldownDurationMs()
      : rollingWildlifeDocilePetCooldownDurationMs(cooldownRollUnit);

  return {
    ...withFloat,
    petCooldownUntilMs: nowMs + cooldownDurationMs,
  };
}
