'use client';

/**
 * React hook for pet loyalty overhead debug visibility.
 *
 * @module components/world/wildlife/pets/hooks/usingWildlifePetLoyaltyDebugVisibleState
 */

import {
  checkingWildlifePetLoyaltyDebugVisible,
  subscribingWildlifePetLoyaltyDebugVisible,
  togglingWildlifePetLoyaltyDebugVisible,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetLoyaltyDebugVisibilityStore';
import { useSyncExternalStore } from 'react';

export type UsingWildlifePetLoyaltyDebugVisibleStateResult = {
  isLoyaltyDebugVisible: boolean;
  togglingLoyaltyDebugVisible: () => void;
};

/**
 * Runtime toggle for pet loyalty overhead labels on wildlife.
 */
export function usingWildlifePetLoyaltyDebugVisibleState(): UsingWildlifePetLoyaltyDebugVisibleStateResult {
  const isLoyaltyDebugVisible = useSyncExternalStore(
    subscribingWildlifePetLoyaltyDebugVisible,
    checkingWildlifePetLoyaltyDebugVisible,
    () => false
  );

  return {
    isLoyaltyDebugVisible,
    togglingLoyaltyDebugVisible: togglingWildlifePetLoyaltyDebugVisible,
  };
}
