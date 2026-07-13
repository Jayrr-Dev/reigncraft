/**
 * Derives bottom HUD toolbar mode from edit-session flags without stealing Craft
 * while a silent craft-entity placement (or other Craft-pinned) build session runs.
 *
 * @module components/world/domains/resolvingWorldPlazaHudToolbarModeFromEditSession
 */

import type { DefiningWorldPlazaHudToolbarModeId } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';

export type ResolvingWorldPlazaHudToolbarModeFromEditSessionParams = {
  readonly isClaimModeActive: boolean;
  readonly isBlockBuildModeActive: boolean;
  readonly currentMode: DefiningWorldPlazaHudToolbarModeId;
};

/**
 * Claim wins. Build forces Build unless the HUD is already on Craft (craft
 * placeables arm edit under the hood and must keep the Craft strip).
 * When edit is off, Craft sticks; otherwise Items.
 */
export function resolvingWorldPlazaHudToolbarModeFromEditSession({
  isClaimModeActive,
  isBlockBuildModeActive,
  currentMode,
}: ResolvingWorldPlazaHudToolbarModeFromEditSessionParams): DefiningWorldPlazaHudToolbarModeId {
  if (isClaimModeActive) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM;
  }

  if (isBlockBuildModeActive) {
    if (currentMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
      return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT;
    }

    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD;
  }

  if (currentMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT;
  }

  return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS;
}

export type CheckingWorldPlazaHudToolbarModeShouldExitEditSessionParams = {
  readonly mode: DefiningWorldPlazaHudToolbarModeId;
  readonly currentHudToolbarMode: DefiningWorldPlazaHudToolbarModeId;
  readonly isEditSessionActive: boolean;
};

/**
 * Items always leaves edit. Craft only leaves when switching in from Build/Claim
 * (re-clicking Craft during silent craft placement must not dump the session).
 */
export function checkingWorldPlazaHudToolbarModeShouldExitEditSession({
  mode,
  currentHudToolbarMode,
  isEditSessionActive,
}: CheckingWorldPlazaHudToolbarModeShouldExitEditSessionParams): boolean {
  if (!isEditSessionActive) {
    return false;
  }

  if (mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS) {
    return true;
  }

  if (mode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT) {
    return (
      currentHudToolbarMode !== DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT
    );
  }

  return false;
}
