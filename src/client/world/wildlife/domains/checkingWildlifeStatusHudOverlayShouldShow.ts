/**
 * Whether status icons should mount above a wildlife instance.
 *
 * Engaged = player damaged it, combat-locked it, or hovered it.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStatusHudOverlayShouldShow
 */

export type CheckingWildlifeStatusHudOverlayShouldShowParams = {
  readonly isDead: boolean;
  readonly iconCount: number;
  readonly lastDamagedAtMs: number | null;
  readonly isCombatLocked: boolean;
  readonly isHovered: boolean;
};

/**
 * Show icons only when the animal has statuses and the local player engaged it.
 */
export function checkingWildlifeStatusHudOverlayShouldShow({
  isDead,
  iconCount,
  lastDamagedAtMs,
  isCombatLocked,
  isHovered,
}: CheckingWildlifeStatusHudOverlayShouldShowParams): boolean {
  if (isDead || iconCount <= 0) {
    return false;
  }

  return lastDamagedAtMs !== null || isCombatLocked || isHovered;
}
