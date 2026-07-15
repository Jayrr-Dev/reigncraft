/**
 * Local HUD toolbar mode state for Items / Craft / Build↔Claim badges.
 *
 * @module components/world/hooks/usingWorldPlazaHudToolbarMode
 */

import type { DefiningWorldPlazaHudToolbarModeId } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import {
  checkingWorldPlazaHudToolbarModeShouldExitEditSession,
  resolvingWorldPlazaHudToolbarModeFromEditSession,
} from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeFromEditSession';
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
    setHudToolbarMode((currentMode) =>
      resolvingWorldPlazaHudToolbarModeFromEditSession({
        isClaimModeActive,
        isBlockBuildModeActive,
        currentMode,
      })
    );
  }, [isBlockBuildModeActive, isClaimModeActive]);

  // Items must never keep claim/build paint live (badge can flip before edit
  // flags settle, or Items can be selected from other HUD paths).
  useEffect(() => {
    if (
      hudToolbarMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS &&
      isEditSessionActive
    ) {
      togglingEditSession();
    }
  }, [hudToolbarMode, isEditSessionActive, togglingEditSession]);

  const selectingHudToolbarMode = useCallback(
    (mode: DefiningWorldPlazaHudToolbarModeId): void => {
      if (
        mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS ||
        mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT
      ) {
        if (
          checkingWorldPlazaHudToolbarModeShouldExitEditSession({
            mode,
            currentHudToolbarMode: hudToolbarMode,
            isEditSessionActive,
          })
        ) {
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
      hudToolbarMode,
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
