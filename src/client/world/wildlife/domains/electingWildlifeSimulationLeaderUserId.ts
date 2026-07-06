/**
 * Elects the wildlife simulation leader from the live room roster.
 *
 * @module components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId
 */

/**
 * Returns the leader user id (lowest lexicographic), or the solo user id.
 */
export function electingWildlifeSimulationLeaderUserId(
  localUserId: string | null,
  remoteUserIds: readonly string[]
): string | null {
  const roster = [...remoteUserIds];

  if (localUserId) {
    roster.push(localUserId);
  }

  if (roster.length === 0) {
    return null;
  }

  roster.sort((left, right) => left.localeCompare(right));

  return roster[0] ?? null;
}
