/**
 * Advances farmland growth phases based on crop registry timings.
 *
 * @module components/world/farming/domains/advancingWorldPlazaFarmlandGrowthPhases
 */

import { DEFINING_WORLD_PLAZA_CROP_REGISTRY } from '@/components/world/farming/domains/definingWorldPlazaCropRegistry';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';

/**
 * Returns the tile state after applying elapsed growth, or the input unchanged.
 */
export function advancingWorldPlazaFarmlandGrowthPhases(
  tileState: DefiningWorldPlazaFarmlandTileState,
  nowMs: number
): DefiningWorldPlazaFarmlandTileState {
  const crop = DEFINING_WORLD_PLAZA_CROP_REGISTRY[tileState.cropId];

  if (!crop) {
    return tileState;
  }

  if (tileState.phase === 'planted') {
    if (nowMs - tileState.phaseStartedAtMs >= crop.sproutDurationMs) {
      return {
        cropId: tileState.cropId,
        phase: 'growing',
        phaseStartedAtMs: nowMs,
      };
    }

    return tileState;
  }

  if (tileState.phase === 'growing') {
    if (nowMs - tileState.phaseStartedAtMs >= crop.growDurationMs) {
      return {
        cropId: tileState.cropId,
        phase: 'mature',
        phaseStartedAtMs: nowMs,
      };
    }
  }

  return tileState;
}
