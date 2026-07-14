/**
 * Sim/Pixi entry point that grants the first-follow pet bond after the
 * docile approach-react outcome updates an instance's follow state.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetBondAfterDocileFollow
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { applyingWildlifePetCuriousFollowGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetCuriousFollowGrant';

export type ApplyingWildlifePetBondAfterDocileFollowParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string | null;
  nowMs: number;
};

/**
 * Call once per tick after `applyingWildlifeDocileApproachReactOutcome`
 * (or any code path that can start a follow window) with the local
 * player's userId. No-ops without an owner id or once a bond is Curious+.
 */
export function applyingWildlifePetBondAfterDocileFollow({
  instance,
  ownerUserId,
  nowMs,
}: ApplyingWildlifePetBondAfterDocileFollowParams): DefiningWildlifeInstance {
  if (!ownerUserId) {
    return instance;
  }

  return applyingWildlifePetCuriousFollowGrant({
    instance,
    ownerUserId,
    nowMs,
  });
}
