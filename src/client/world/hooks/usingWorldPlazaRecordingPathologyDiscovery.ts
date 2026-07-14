'use client';

import { initializingWorldPlazaPathologyDiscoveryStore } from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import { useEffect } from 'react';

export type UsingWorldPlazaRecordingPathologyDiscoveryOptions = {
  storageOwnerId: string | null;
};

/**
 * Hydrates the Pathology discovery store for the active session owner.
 */
export function usingWorldPlazaRecordingPathologyDiscovery({
  storageOwnerId,
}: UsingWorldPlazaRecordingPathologyDiscoveryOptions): void {
  useEffect(() => {
    initializingWorldPlazaPathologyDiscoveryStore(storageOwnerId);
  }, [storageOwnerId]);
}
