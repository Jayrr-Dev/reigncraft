'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_LAPIDARY_SIGHT_RADIUS_GRID,
} from '@/components/world/domains/definingWorldPlazaLapidaryDiscoveryConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow } from '@/components/world/domains/listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow';
import {
  gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
  initializingWorldPlazaLapidaryDiscoveryStore,
  recordingWorldPlazaLapidaryOreSighted,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { syncingWorldPlazaLapidaryOresFromMines } from '@/components/world/domains/syncingWorldPlazaLapidaryOresFromMines';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import type { RefObject } from 'react';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingLapidarySightingsOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Inventory used to backfill already-held ore species. */
  inventoryState?: DefiningInventoryState | null;
  /** Mined rock tiles used to backfill historical ore mines. */
  minedRockStateByTileKey?: ReadonlyMap<
    string,
    DefiningWorldPlazaMinedRockTileState
  > | null;
  /** Fired when a new ore species is sighted (Anvil recipe unlock, etc.). */
  readonly onOreSpeciesSighted?: () => void;
};

/**
 * Tracks ore vein sightings near the player, and syncs discovery from mines.
 *
 * Ores unlock by proximity sighting; mining or inventory Study awards progress.
 */
export function usingWorldPlazaRecordingLapidarySightings({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
  inventoryState = null,
  minedRockStateByTileKey = null,
  onOreSpeciesSighted,
}: UsingWorldPlazaRecordingLapidarySightingsOptions): void {
  useEffect(() => {
    initializingWorldPlazaLapidaryDiscoveryStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    syncingWorldPlazaLapidaryOresFromMines(
      inventoryState,
      minedRockStateByTileKey
    );
  }, [isEnabled, inventoryState, minedRockStateByTileKey]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const sightRadiusGrid = DEFINING_WORLD_PLAZA_LAPIDARY_SIGHT_RADIUS_GRID;
    const sightRadiusSquared = sightRadiusGrid * sightRadiusGrid;

    const recordingNearbyOreVeinSightings = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const centerTileX = Math.floor(playerPosition.x);
      const centerTileY = Math.floor(playerPosition.y);

      const nearbyRocks = listingWorldPlazaColumnRockMiniMapFootprintsInTileWindow(
        centerTileX,
        centerTileY,
        sightRadiusGrid
      );

      const sightedCountBefore =
        gettingWorldPlazaLapidarySightedOreSpeciesSnapshot().length;

      for (const rock of nearbyRocks) {
        if (!rock.oreSpeciesId) {
          continue;
        }

        const deltaX = rock.anchorTileX - centerTileX;
        const deltaY = rock.anchorTileY - centerTileY;

        if (deltaX * deltaX + deltaY * deltaY > sightRadiusSquared) {
          continue;
        }

        recordingWorldPlazaLapidaryOreSighted(rock.oreSpeciesId);
      }

      if (
        gettingWorldPlazaLapidarySightedOreSpeciesSnapshot().length >
        sightedCountBefore
      ) {
        onOreSpeciesSighted?.();
      }
    };

    recordingNearbyOreVeinSightings();

    const intervalId = window.setInterval(
      recordingNearbyOreVeinSightings,
      DEFINING_WORLD_PLAZA_LAPIDARY_DISCOVERY_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, onOreSpeciesSighted, playerPositionRef]);
}
