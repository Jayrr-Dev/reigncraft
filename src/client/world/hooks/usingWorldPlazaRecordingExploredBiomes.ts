'use client';

import { DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_POLL_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  initializingWorldPlazaExploredBiomesStore,
  recordingWorldPlazaExploredBiomeKind,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import type { RefObject } from 'react';
import { useEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaRecordingExploredBiomesOptions = {
  isEnabled: boolean;
  storageOwnerId: string | null;
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

/**
 * Tracks biome discovery while the local player moves through the world.
 */
export function usingWorldPlazaRecordingExploredBiomes({
  isEnabled,
  storageOwnerId,
  playerPositionRef,
}: UsingWorldPlazaRecordingExploredBiomesOptions): readonly string[] {
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );

  useEffect(() => {
    initializingWorldPlazaExploredBiomesStore(storageOwnerId);
  }, [storageOwnerId]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const recordingCurrentBiome = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
      recordingWorldPlazaExploredBiomeKind(biome.kind);
    };

    recordingCurrentBiome();

    const intervalId = window.setInterval(
      recordingCurrentBiome,
      DEFINING_WORLD_PLAZA_EXPLORED_BIOMES_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, playerPositionRef]);

  return exploredBiomeKinds;
}
