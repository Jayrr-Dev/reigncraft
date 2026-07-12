/**
 * World building edit mode union and helpers.
 *
 * Build mode and claim mode are two interaction modes over the same build
 * draft: build mode places and removes blocks on owned plots, claim mode
 * claims and unclaims plots.
 *
 * @module components/world/building/domains/definingWorldBuildingEditMode
 */

/** Active world building edit mode. */
export type DefiningWorldBuildingEditMode = 'off' | 'build' | 'claim';

/** Sticky paint action while the pointer is held in an edit session. */
export type DefiningWorldBuildingEditPaintAction =
  | 'claim'
  | 'unclaim'
  | 'place'
  | 'remove';

/** No active edit session. */
export const DEFINING_WORLD_BUILDING_EDIT_MODE_OFF = 'off' as const;

/** Placing and removing blocks on owned plots. */
export const DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD = 'build' as const;

/** Claiming and unclaiming plots. */
export const DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM = 'claim' as const;

/**
 * Returns whether an edit mode keeps an active editing session open (build or
 * claim), as opposed to being fully off.
 *
 * @param editMode - Current edit mode.
 */
export function checkingWorldBuildingEditModeIsActive(
  editMode: DefiningWorldBuildingEditMode
): boolean {
  return editMode !== DEFINING_WORLD_BUILDING_EDIT_MODE_OFF;
}
