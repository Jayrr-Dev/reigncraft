/**
 * Respawns wildlife at random points once the player leaves the death site.
 *
 * @module components/world/wildlife/domains/advancingWildlifePendingRespawns
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifePendingRespawn } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeRandomRespawnPosition } from '@/components/world/wildlife/domains/resolvingWildlifeRandomRespawnPosition';

export type AdvancingWildlifePendingRespawnsParams = {
  store: ManagingWildlifeInstanceStore;
  playerCenter: DefiningWorldPlazaWorldPoint;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  nowMs: number;
  isDaytime: boolean;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
};

function checkingWildlifePlayerLeftDeathSite(
  playerCenter: DefiningWorldPlazaWorldPoint,
  pendingRespawn: DefiningWildlifePendingRespawn
): boolean {
  const distance = Math.hypot(
    playerCenter.x - pendingRespawn.deathPosition.x,
    playerCenter.y - pendingRespawn.deathPosition.y
  );

  return distance >= DEFINING_WILDLIFE_RESPAWN_MIN_PLAYER_DISTANCE_GRID;
}

/**
 * Materializes pending respawns when the player is far enough from each kill site.
 */
export function advancingWildlifePendingRespawns({
  store,
  playerCenter,
  resolveSpecies,
  nowMs,
  isDaytime,
  placedBlocks = [],
  placedBlocksByTile,
}: AdvancingWildlifePendingRespawnsParams): void {
  for (const [anchorId, pendingRespawn] of store.pendingRespawns) {
    if (store.instances.has(anchorId)) {
      continue;
    }

    if (!checkingWildlifePlayerLeftDeathSite(playerCenter, pendingRespawn)) {
      continue;
    }

    const species = resolveSpecies(pendingRespawn.speciesId);

    if (!species) {
      store.pendingRespawns.delete(anchorId);
      continue;
    }

    const respawnPosition = resolvingWildlifeRandomRespawnPosition({
      playerCenter,
      deathPosition: pendingRespawn.deathPosition,
      species,
      placementSeed: pendingRespawn.placementSeed,
      isDaytime,
      placedBlocks,
      placedBlocksByTile,
    });

    if (!respawnPosition) {
      continue;
    }

    store.instances.set(
      anchorId,
      creatingWildlifeInstanceAtPosition({
        instanceId: anchorId,
        anchorId,
        species,
        position: respawnPosition,
        spawnAnchor: pendingRespawn.spawnAnchor,
        aggressionLevel: pendingRespawn.aggressionLevel,
        sleepScheduleSample: pendingRespawn.sleepScheduleSample,
        sizeScaleSample: pendingRespawn.sizeScaleSample,
        largeSizeFrame: pendingRespawn.largeSizeFrame,
        thinkScheduleAnchor: pendingRespawn.thinkScheduleAnchor,
        nowMs,
      })
    );
    store.knownAnchorIds.add(anchorId);
    store.pendingRespawns.delete(anchorId);
  }
}
