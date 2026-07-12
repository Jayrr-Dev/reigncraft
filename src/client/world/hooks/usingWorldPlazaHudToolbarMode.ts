/**
 * Local HUD toolbar mode state for Items / Craft / Build↔Claim badges.
 *
 * @module components/world/hooks/usingWorldPlazaHudToolbarMode
 */

import type { DefiningWorldPlazaHudToolbarModeId } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { useCallback, useEffect, useState } from 'react';

export type UsingWorldPlazaHudToolbarModeParams = {
  readonly isEditSessionActive: boolean;
  readonly isBlockBuildModeActive: boolean;
  readonly isClaimModeActive: boolean;
  readonly isBuildModeEnabled: boolean;
  readonly togglingEditSession: () => void;
  readonly activatingBuildMode: () => void;
  readonly activatingClaimMode: () => void;
};

export type UsingWorldPlazaHudToolbarModeResult = {
  readonly hudToolbarMode: DefiningWorldPlazaHudToolbarModeId;
  readonly selectingHudToolbarMode: (
    mode: DefiningWorldPlazaHudToolbarModeId
  ) => void;
};

/**
 * Tracks and switches bottom HUD toolbar modes.
 */
export function usingWorldPlazaHudToolbarMode({
  isEditSessionActive,
  isBlockBuildModeActive,
  isClaimModeActive,
  isBuildModeEnabled,
  togglingEditSession,
  activatingBuildMode,
  activatingClaimMode,
}: UsingWorldPlazaHudToolbarModeParams): UsingWorldPlazaHudToolbarModeResult {
  const [hudToolbarMode, setHudToolbarMode] =
    useState<DefiningWorldPlazaHudToolbarModeId>(
      DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
    );

  useEffect(() => {
    if (isClaimModeActive) {
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
      return;
    }

    if (isBlockBuildModeActive) {
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
      return;
    }

    setHudToolbarMode((currentMode) => {
      if (currentMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
        return currentMode;
      }

      return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS;
    });
  }, [isBlockBuildModeActive, isClaimModeActive]);

  const selectingHudToolbarMode = useCallback(
    (mode: DefiningWorldPlazaHudToolbarModeId): void => {
      if (
        mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS ||
        mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT
      ) {
        if (isEditSessionActive) {
          togglingEditSession();
        }

        setHudToolbarMode(mode);
        return;
      }

      if (!isBuildModeEnabled) {
        return;
      }

      if (mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
        activatingBuildMode();
        setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
        return;
      }

      activatingClaimMode();
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
    },
    [
      activatingBuildMode,
      activatingClaimMode,
      isBuildModeEnabled,
      isEditSessionActive,
      togglingEditSession,
    ]
  );

  return {
    hudToolbarMode,
    selectingHudToolbarMode,
  };
}
