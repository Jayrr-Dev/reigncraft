/**
 * Starts the world boot loading pipeline without subscribing to progress UI.
 *
 * Safe to call from the home screen so asset warm-up overlaps menu time.
 * The store is idempotent against StrictMode and later boot-gate mounts.
 *
 * @module components/world/loading/hooks/usingWorldPlazaWorldLoadingWarmStart
 */

import { startingWorldPlazaWorldLoading } from '@/components/world/loading/domains/managingWorldPlazaWorldLoadingStore';
import { useEffect } from 'react';

/**
 * Kicks off world boot loading once on mount.
 */
export function usingWorldPlazaWorldLoadingWarmStart(): void {
  useEffect(() => {
    startingWorldPlazaWorldLoading().catch(() => {
      // Error state is published through the loading snapshot for the boot gate.
    });
  }, []);
}
