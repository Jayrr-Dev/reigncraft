/**
 * Checks whether the player can cast a fishing line at a water tile.
 *
 * @module components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility
 */

import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

export type CheckingWorldPlazaFishingCastEligibilityResult = {
  readonly isEligible: boolean;
  readonly reason: string | null;
};

/**
 * Returns true when the tile is liquid, unfrozen, and within cast range.
 */
export function checkingWorldPlazaFishingCastEligibility(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): CheckingWorldPlazaFishingCastEligibilityResult {
  const waterKind = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (!waterKind) {
    return { isEligible: false, reason: 'No water here.' };
  }

  if (checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
    return { isEligible: false, reason: 'The water is frozen.' };
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  if (distance > DEFINING_WORLD_PLAZA_FISHING_PLAYER_RANGE_TILES) {
    return { isEligible: false, reason: 'Move closer to the water.' };
  }

  return { isEligible: true, reason: null };
}
