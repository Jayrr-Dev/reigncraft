/**
 * Applies study float + Pet cooldown after a successful living companion pet.
 *
 * @module components/world/wildlife/domains/applyingWildlifeDocilePetComplete
 */

import { rollingWildlifeDocilePetCooldownDurationMs } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { enqueueingWildlifeDocilePetStudyFloatFeedback } from '@/components/world/wildlife/domains/enqueueingWildlifeDocilePetStudyFloatFeedback';
import { applyingWildlifePetPettingLoyalty } from '@/components/world/wildlife/pets/domains/applyingWildlifePetPettingLoyalty';

export type ApplyingWildlifeDocilePetCompleteParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly studyPoints: number;
  readonly nowMs: number;
  /** Optional `[0, 1)` roll for deterministic tests. */
  readonly cooldownRollUnit?: number;
  /** When set, also grants pet bond loyalty for this completed pet. */
  readonly ownerUserId?: string | null;
};

export type ApplyingWildlifeDocilePetCompleteResult = {
  readonly instance: DefiningWildlifeInstance;
  /** True the tick this pet's bond just crossed into the Familiar+ tier. */
  readonly becamePersistent: boolean;
};

/**
 * Awards the Pet study float, starts the 1–3 in-game-hour cooldown, and
 * (when an owner is known) grants bonded-companion petting loyalty.
 */
export function applyingWildlifeDocilePetComplete({
  instance,
  studyPoints,
  nowMs,
  cooldownRollUnit,
  ownerUserId = null,
}: ApplyingWildlifeDocilePetCompleteParams): ApplyingWildlifeDocilePetCompleteResult {
  const withFloat = enqueueingWildlifeDocilePetStudyFloatFeedback({
    instance,
    studyPoints,
    nowMs,
  });
  const cooldownDurationMs =
    cooldownRollUnit === undefined
      ? rollingWildlifeDocilePetCooldownDurationMs()
      : rollingWildlifeDocilePetCooldownDurationMs(cooldownRollUnit);

  const withCooldown: DefiningWildlifeInstance = {
    ...withFloat,
    petCooldownUntilMs: nowMs + cooldownDurationMs,
  };

  if (!ownerUserId) {
    return { instance: withCooldown, becamePersistent: false };
  }

  const pettingResult = applyingWildlifePetPettingLoyalty({
    instance: withCooldown,
    ownerUserId,
    nowMs,
  });

  return {
    instance: pettingResult.instance,
    becamePersistent: pettingResult.becamePersistent,
  };
}
