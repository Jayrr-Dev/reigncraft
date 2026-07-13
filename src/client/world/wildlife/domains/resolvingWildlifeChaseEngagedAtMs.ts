/**
 * Tracks when the current wildlife pursuit target was first acquired.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeChaseEngagedAtMs
 */

export type ResolvingWildlifeChaseEngagedAtMsParams = {
  previousChaseEngagedAtMs: number | null | undefined;
  previousActiveTargetId: string | null;
  activeTargetId: string | null;
  nowMs: number;
};

/** Starts a new engage clock on target acquire; clears when combat ends. */
export function resolvingWildlifeChaseEngagedAtMs({
  previousChaseEngagedAtMs,
  previousActiveTargetId,
  activeTargetId,
  nowMs,
}: ResolvingWildlifeChaseEngagedAtMsParams): number | null {
  if (activeTargetId === null) {
    return null;
  }

  if (
    previousChaseEngagedAtMs === null ||
    previousChaseEngagedAtMs === undefined ||
    previousActiveTargetId !== activeTargetId
  ) {
    return nowMs;
  }

  return previousChaseEngagedAtMs;
}
