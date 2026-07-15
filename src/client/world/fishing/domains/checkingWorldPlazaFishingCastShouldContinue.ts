/**
 * Whether an active fishing cast should keep channeling.
 *
 * @module components/world/fishing/domains/checkingWorldPlazaFishingCastShouldContinue
 */

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import {
  checkingWorldPlazaMovementDirectionIsActive,
  type DefiningWorldPlazaMovementDirection,
} from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

export type CheckingWorldPlazaFishingCastShouldContinueParams = {
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly targetKey: string;
  readonly selectedInteractableBlockKeys: ReadonlySet<string>;
  readonly keyboardDirection: DefiningWorldPlazaMovementDirection | null;
  readonly walkTarget: DefiningWorldPlazaWorldPoint | null;
  readonly jumpRequested: boolean;
  readonly rollRequested: boolean;
};

/**
 * Cast continues while in range, still selected, and without new move intent.
 */
export function checkingWorldPlazaFishingCastShouldContinue({
  playerPosition,
  tileX,
  tileY,
  targetKey,
  selectedInteractableBlockKeys,
  keyboardDirection,
  walkTarget,
  jumpRequested,
  rollRequested,
}: CheckingWorldPlazaFishingCastShouldContinueParams): boolean {
  if (!playerPosition) {
    return false;
  }

  if (
    keyboardDirection !== null &&
    checkingWorldPlazaMovementDirectionIsActive(keyboardDirection)
  ) {
    return false;
  }

  if (walkTarget !== null) {
    return false;
  }

  if (jumpRequested || rollRequested) {
    return false;
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  if (distance > DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES) {
    return false;
  }

  return selectedInteractableBlockKeys.has(targetKey);
}
