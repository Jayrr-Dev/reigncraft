'use client';

/**
 * React subscription to plaza gameplay HUD chrome visibility.
 *
 * @module components/world/hooks/usingWorldPlazaGameplayHudVisibleState
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_DEFAULT_VISIBLE } from '@/components/world/domains/definingWorldPlazaGameplayHudVisibilityConstants';
import {
  checkingWorldPlazaGameplayHudVisible,
  settingWorldPlazaGameplayHudVisible,
  subscribingWorldPlazaGameplayHudVisible,
  togglingWorldPlazaGameplayHudVisible,
} from '@/components/world/domains/managingWorldPlazaGameplayHudVisibilityStore';
import { useCallback, useSyncExternalStore } from 'react';

/** Result from {@link usingWorldPlazaGameplayHudVisibleState}. */
export type UsingWorldPlazaGameplayHudVisibleStateResult = {
  /** True when bars, hotbar, minimap, and related chrome should render. */
  isGameplayHudVisible: boolean;
  /** Sets chrome visibility. */
  settingGameplayHudVisible: (isVisible: boolean) => void;
  /** Flips chrome visibility. */
  togglingGameplayHudVisible: () => void;
};

/**
 * Runtime toggle for plaza gameplay HUD chrome (F1 screenshot mode).
 */
export function usingWorldPlazaGameplayHudVisibleState(): UsingWorldPlazaGameplayHudVisibleStateResult {
  const isGameplayHudVisible = useSyncExternalStore(
    subscribingWorldPlazaGameplayHudVisible,
    checkingWorldPlazaGameplayHudVisible,
    () => DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_DEFAULT_VISIBLE
  );

  const settingGameplayHudVisible = useCallback((isVisible: boolean): void => {
    settingWorldPlazaGameplayHudVisible(isVisible);
  }, []);

  const togglingGameplayHudVisible = useCallback((): void => {
    togglingWorldPlazaGameplayHudVisible();
  }, []);

  return {
    isGameplayHudVisible,
    settingGameplayHudVisible,
    togglingGameplayHudVisible,
  };
}
