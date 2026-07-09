/**
 * Checks whether a tile can be tilled with a hoe.
 *
 * @module components/world/farming/domains/checkingWorldPlazaFarmingTillEligibility
 */

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES } from '@/components/world/farming/domains/definingWorldPlazaFarmingConstants';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';

export type CheckingWorldPlazaFarmingTillEligibilityResult = {
  readonly isEligible: boolean;
  readonly reason: string | null;
};

export function checkingWorldPlazaFarmingTillEligibility(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  existingTileState: DefiningWorldPlazaFarmlandTileState | undefined
): CheckingWorldPlazaFarmingTillEligibilityResult {
  if (existingTileState) {
    return { isEligible: false, reason: 'This tile is already farmland.' };
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return { isEligible: false, reason: 'Cannot till water.' };
  }

  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  if (distance > DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES) {
    return { isEligible: false, reason: 'Move closer to till soil.' };
  }

  return { isEligible: true, reason: null };
}
