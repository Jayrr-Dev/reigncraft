'use client';

import {
  peekingWorldPlazaSessionAudioLoadingSnapshot,
  startingWorldPlazaSessionAudioLoading,
  subscribingWorldPlazaSessionAudioLoading,
  type ManagingWorldPlazaSessionAudioLoadingSnapshot,
} from '@/components/world/audio/lifecycle/managingWorldPlazaSessionAudioLoadingStore';
import { useEffect, useSyncExternalStore } from 'react';

/** React binding for session-specific audio readiness. */
export function usingWorldPlazaSessionAudioLoading(): ManagingWorldPlazaSessionAudioLoadingSnapshot {
  const snapshot = useSyncExternalStore(
    subscribingWorldPlazaSessionAudioLoading,
    peekingWorldPlazaSessionAudioLoadingSnapshot,
    peekingWorldPlazaSessionAudioLoadingSnapshot
  );

  useEffect(() => {
    startingWorldPlazaSessionAudioLoading().catch(() => {
      // Error state is exposed through the snapshot.
    });
  }, []);

  return snapshot;
}
