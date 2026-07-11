'use client';

import {
  checkingWorldPlazaTerrainCollisionDebugVisible,
  subscribingWorldPlazaTerrainCollisionDebugVisible,
  togglingWorldPlazaTerrainCollisionDebugVisible,
} from '@/components/world/domains/managingWorldPlazaTerrainCollisionDebugVisibilityStore';
import { useSyncExternalStore } from 'react';

/** Result from {@link usingWorldPlazaTerrainCollisionDebugVisibleState}. */
export interface UsingWorldPlazaTerrainCollisionDebugVisibleStateResult {
  /** True when collision boxes and the player marker are visible. */
  isTerrainCollisionDebugVisible: boolean;
  /** Flips collision debug visibility. */
  togglingTerrainCollisionDebugVisible: () => void;
}

/**
 * Runtime toggle for plaza terrain collision debug overlays.
 */
export function usingWorldPlazaTerrainCollisionDebugVisibleState(): UsingWorldPlazaTerrainCollisionDebugVisibleStateResult {
  const isTerrainCollisionDebugVisible = useSyncExternalStore(
    subscribingWorldPlazaTerrainCollisionDebugVisible,
    checkingWorldPlazaTerrainCollisionDebugVisible,
    () => false
  );

  return {
    isTerrainCollisionDebugVisible,
    togglingTerrainCollisionDebugVisible:
      togglingWorldPlazaTerrainCollisionDebugVisible,
  };
}
