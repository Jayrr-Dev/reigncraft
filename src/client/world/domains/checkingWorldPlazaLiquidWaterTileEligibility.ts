/**
 * Shared liquid-water eligibility for Add Water and related vessel fills.
 *
 * @module components/world/domains/checkingWorldPlazaLiquidWaterTileEligibility
 */

import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

export type CheckingWorldPlazaLiquidWaterTileEligibilityResult = {
  readonly isEligible: boolean;
  readonly reason: string | null;
};

/**
 * Returns true when the tile is liquid, unfrozen, and within Chebyshev range.
 */
export function checkingWorldPlazaLiquidWaterTileEligibility(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  rangeTiles: number
): CheckingWorldPlazaLiquidWaterTileEligibilityResult {
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

  if (distance > rangeTiles) {
    return { isEligible: false, reason: 'Move closer to the water.' };
  }

  return { isEligible: true, reason: null };
}
