/**
 * Resolves Build↔Claim toggle badge face and next mode.
 *
 * @module components/world/domains/resolvingWorldPlazaHudToolbarBuildClaimToggle
 */

import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_BUILD_CLAIM_TOGGLE_FACES,
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID,
  type DefiningWorldPlazaHudToolbarBuildClaimToggleFace,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';

/**
 * True when the Build↔Claim toggle badge should read as pressed.
 *
 * @param activeMode - Current HUD toolbar mode
 */
export function checkingWorldPlazaHudToolbarBuildClaimToggleActive(
  activeMode: DefiningWorldPlazaHudToolbarModeId
): boolean {
  return (
    activeMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD ||
    activeMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
  );
}

/**
 * Face shown on the Build↔Claim toggle for the current mode.
 * Defaults to Claim when neither edit mode is active.
 *
 * @param activeMode - Current HUD toolbar mode
 */
export function resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
  activeMode: DefiningWorldPlazaHudToolbarModeId
): DefiningWorldPlazaHudToolbarBuildClaimToggleFace {
  if (activeMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_BUILD_CLAIM_TOGGLE_FACES[
      DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
    ];
  }

  return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_BUILD_CLAIM_TOGGLE_FACES[
    DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
  ];
}

/**
 * Next edit mode when the Build↔Claim toggle is clicked.
 * Claim → Build → Claim. From Items/Craft, enters Claim.
 *
 * @param activeMode - Current HUD toolbar mode
 */
export function resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode(
  activeMode: DefiningWorldPlazaHudToolbarModeId
):
  | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
  | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM {
  if (activeMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD;
  }

  if (activeMode === DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM;
  }

  return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM;
}
