/**
 * React binding for the spawn-viewport terrain ready store.
 *
 * @module components/world/loading/hooks/usingWorldPlazaSpawnTerrainReady
 */

import {
  peekingWorldPlazaSpawnTerrainReady,
  subscribingWorldPlazaSpawnTerrainReady,
} from '@/components/world/loading/domains/managingWorldPlazaSpawnTerrainReadyStore';
import { useSyncExternalStore } from 'react';

/**
 * Streams whether the first spawn-viewport heavy terrain sync has finished.
 */
export function usingWorldPlazaSpawnTerrainReady(): boolean {
  return useSyncExternalStore(
    subscribingWorldPlazaSpawnTerrainReady,
    peekingWorldPlazaSpawnTerrainReady,
    peekingWorldPlazaSpawnTerrainReady
  );
}
