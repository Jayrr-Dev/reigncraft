/**
 * HUD toolbar mode from the equipped Craft / Build / Claim hotbar tools.
 *
 * @module components/world/hooks/usingWorldPlazaHudToolbarMode
 */

import type { DefiningWorldPlazaHudToolbarModeId } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId } from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId';
import { useEffect, useRef, useState } from 'react';

export type UsingWorldPlazaHudToolbarModeParams = {
  /** Item type currently in the reserved fist / weapon / tool slot. */
  readonly equippedItemTypeId: string | null;
  readonly isEditSessionActive: boolean;
  readonly isBuildModeEnabled: boolean;
  readonly togglingEditSession: () => void;
  readonly activatingBuildMode: () => void;
  readonly activatingClaimMode: () => void;
};

export type UsingWorldPlazaHudToolbarModeResult = {
  readonly hudToolbarMode: DefiningWorldPlazaHudToolbarModeId;
};

/**
 * Syncs bottom HUD mode to the equipped Craft / Build / Claim tool.
 * Drag those tools into the fist slot to open the matching panel.
 */
export function usingWorldPlazaHudToolbarMode({
  equippedItemTypeId,
  isEditSessionActive,
  isBuildModeEnabled,
  togglingEditSession,
  activatingBuildMode,
  activatingClaimMode,
}: UsingWorldPlazaHudToolbarModeParams): UsingWorldPlazaHudToolbarModeResult {
  const [hudToolbarMode, setHudToolbarMode] =
    useState<DefiningWorldPlazaHudToolbarModeId>(
      DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
    );

  const isEditSessionActiveRef = useRef(isEditSessionActive);
  const togglingEditSessionRef = useRef(togglingEditSession);
  const activatingBuildModeRef = useRef(activatingBuildMode);
  const activatingClaimModeRef = useRef(activatingClaimMode);

  isEditSessionActiveRef.current = isEditSessionActive;
  togglingEditSessionRef.current = togglingEditSession;
  activatingBuildModeRef.current = activatingBuildMode;
  activatingClaimModeRef.current = activatingClaimMode;

  useEffect(() => {
    const desiredMode =
      resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
        equippedItemTypeId
      );

    const exitingEditSessionIfNeeded = (): void => {
      if (isEditSessionActiveRef.current) {
        togglingEditSessionRef.current();
      }
    };

    if (desiredMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
      exitingEditSessionIfNeeded();
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT);
      return;
    }

    if (desiredMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
      if (!isBuildModeEnabled) {
        exitingEditSessionIfNeeded();
        setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS);
        return;
      }

      activatingBuildModeRef.current();
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
      return;
    }

    if (desiredMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM) {
      if (!isBuildModeEnabled) {
        exitingEditSessionIfNeeded();
        setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS);
        return;
      }

      activatingClaimModeRef.current();
      setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
      return;
    }

    exitingEditSessionIfNeeded();
    setHudToolbarMode(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS);
  }, [equippedItemTypeId, isBuildModeEnabled]);

  return {
    hudToolbarMode,
  };
}
