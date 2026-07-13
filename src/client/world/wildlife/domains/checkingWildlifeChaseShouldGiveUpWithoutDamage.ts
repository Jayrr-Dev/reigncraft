/**
 * Whether a pursuit should drop because no melee hit landed recently.
 *
 * @module components/world/wildlife/domains/checkingWildlifeChaseShouldGiveUpWithoutDamage
 */

export type CheckingWildlifeChaseShouldGiveUpWithoutDamageParams = {
  chaseGiveUpWithoutDamageMs: number | undefined;
  activeTargetId: string | null;
  playerUserId: string | null;
  lastDealtDamageAtMs: number | null | undefined;
  chaseEngagedAtMs: number | null | undefined;
  nowMs: number;
};

/**
 * True when the active player chase has gone too long without a landed hit.
 */
export function checkingWildlifeChaseShouldGiveUpWithoutDamage({
  chaseGiveUpWithoutDamageMs,
  activeTargetId,
  playerUserId,
  lastDealtDamageAtMs,
  chaseEngagedAtMs,
  nowMs,
}: CheckingWildlifeChaseShouldGiveUpWithoutDamageParams): boolean {
  if (
    chaseGiveUpWithoutDamageMs === undefined ||
    activeTargetId === null ||
    playerUserId === null ||
    activeTargetId !== playerUserId
  ) {
    return false;
  }

  const referenceMs = lastDealtDamageAtMs ?? chaseEngagedAtMs ?? null;

  if (referenceMs === null) {
    return false;
  }

  return nowMs - referenceMs >= chaseGiveUpWithoutDamageMs;
}
