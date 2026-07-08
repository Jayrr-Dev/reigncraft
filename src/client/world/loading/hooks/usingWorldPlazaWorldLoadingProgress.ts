/**
 * React binding for the world boot loading store.
 *
 * @module components/world/loading/hooks/usingWorldPlazaWorldLoadingProgress
 */

import {
  peekingWorldPlazaWorldLoadingSnapshot,
  startingWorldPlazaWorldLoading,
  subscribingWorldPlazaWorldLoading,
  type ManagingWorldPlazaWorldLoadingSnapshot,
} from '@/components/world/loading/domains/managingWorldPlazaWorldLoadingStore';
import { useEffect, useSyncExternalStore } from 'react';

/**
 * Starts the world loading pipeline on mount and streams its progress.
 */
export function usingWorldPlazaWorldLoadingProgress(): ManagingWorldPlazaWorldLoadingSnapshot {
  const snapshot = useSyncExternalStore(
    subscribingWorldPlazaWorldLoading,
    peekingWorldPlazaWorldLoadingSnapshot,
    peekingWorldPlazaWorldLoadingSnapshot
  );

  useEffect(() => {
    startingWorldPlazaWorldLoading().catch(() => {
      // Error state is published through the snapshot; nothing else to do.
    });
  }, []);

  return snapshot;
}
