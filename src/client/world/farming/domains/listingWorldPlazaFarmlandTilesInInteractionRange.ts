/**
 * Lists nearby farmland actions available to the player.
 *
 * @module components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { advancingWorldPlazaFarmlandGrowthPhases } from '@/components/world/farming/domains/advancingWorldPlazaFarmlandGrowthPhases';
import { checkingWorldPlazaFarmingTillEligibility } from '@/components/world/farming/domains/checkingWorldPlazaFarmingTillEligibility';
import {
  DEFINING_WORLD_PLAZA_FARMING_FEATURE_ENABLED,
  DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES,
} from '@/components/world/farming/domains/definingWorldPlazaFarmingConstants';
import type { DefiningWorldPlazaFarmlandTileState } from '@/components/world/farming/domains/definingWorldPlazaFarmlandTypes';

export type DefiningWorldPlazaFarmlandInteractionKind =
  | 'till'
  | 'plant'
  | 'harvest';

export type ListingWorldPlazaFarmlandTilesInInteractionRangeEntry = {
  readonly tileX: number;
  readonly tileY: number;
  readonly interactionKind: DefiningWorldPlazaFarmlandInteractionKind;
  readonly tileState: DefiningWorldPlazaFarmlandTileState | null;
};

export type ListingWorldPlazaFarmlandTilesInInteractionRangeParams = {
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly farmlandByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaFarmlandTileState
  >;
  readonly hasEquippedHoe: boolean;
  readonly hasEquippedScythe: boolean;
  readonly hasSeedsInInventory: boolean;
  readonly nowMs?: number;
};

function resolvingFarmlandTileStateAt(
  farmlandByTileKey: ReadonlyMap<string, DefiningWorldPlazaFarmlandTileState>,
  tileX: number,
  tileY: number,
  nowMs: number
): DefiningWorldPlazaFarmlandTileState | undefined {
  const tileKey = `${tileX},${tileY}`;
  const existing = farmlandByTileKey.get(tileKey);

  if (!existing) {
    return undefined;
  }

  return advancingWorldPlazaFarmlandGrowthPhases(existing, nowMs);
}

/**
 * Scans tiles around the player for till, plant, or harvest affordances.
 */
export function listingWorldPlazaFarmlandTilesInInteractionRange(
  params: ListingWorldPlazaFarmlandTilesInInteractionRangeParams
): readonly ListingWorldPlazaFarmlandTilesInInteractionRangeEntry[] {
  if (!DEFINING_WORLD_PLAZA_FARMING_FEATURE_ENABLED) {
    return [];
  }

  const entries: ListingWorldPlazaFarmlandTilesInInteractionRangeEntry[] = [];
  const nowMs = params.nowMs ?? performance.now();
  const centerTileX = Math.floor(params.playerPosition.x);
  const centerTileY = Math.floor(params.playerPosition.y);
  const radius = DEFINING_WORLD_PLAZA_FARMING_PLAYER_RANGE_TILES;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const tileX = centerTileX + offsetX;
      const tileY = centerTileY + offsetY;
      const tileState = resolvingFarmlandTileStateAt(
        params.farmlandByTileKey,
        tileX,
        tileY,
        nowMs
      );

      if (!tileState && params.hasEquippedHoe) {
        const tillEligibility = checkingWorldPlazaFarmingTillEligibility(
          params.playerPosition,
          tileX,
          tileY,
          tileState
        );

        if (tillEligibility.isEligible) {
          entries.push({
            tileX,
            tileY,
            interactionKind: 'till',
            tileState: null,
          });
        }

        continue;
      }

      if (tileState?.phase === 'tilled' && params.hasSeedsInInventory) {
        entries.push({
          tileX,
          tileY,
          interactionKind: 'plant',
          tileState,
        });
        continue;
      }

      if (tileState?.phase === 'mature' && params.hasEquippedScythe) {
        entries.push({
          tileX,
          tileY,
          interactionKind: 'harvest',
          tileState,
        });
      }
    }
  }

  return entries;
}
