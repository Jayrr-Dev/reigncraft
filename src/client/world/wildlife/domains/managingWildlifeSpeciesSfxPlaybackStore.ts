/**
 * Tracks last-play timestamps so long clips do not stack on one instance.
 *
 * @module components/world/wildlife/domains/managingWildlifeSpeciesSfxPlaybackStore
 */

const managingWildlifeSpeciesSfxLastPlayedAtMsByKey = new Map<string, number>();

function resolvingWildlifeSpeciesSfxPlaybackKey(
  instanceId: string,
  poolId: string
): string {
  return `${instanceId}:${poolId}`;
}

/** Returns the last play timestamp for one instance pool, if any. */
export function gettingWildlifeSpeciesSfxLastPlayedAtMs(
  instanceId: string,
  poolId: string
): number | null {
  return (
    managingWildlifeSpeciesSfxLastPlayedAtMsByKey.get(
      resolvingWildlifeSpeciesSfxPlaybackKey(instanceId, poolId)
    ) ?? null
  );
}

/** Stamps the last play time for one instance pool. */
export function stampingWildlifeSpeciesSfxLastPlayedAtMs(
  instanceId: string,
  poolId: string,
  playedAtMs: number
): void {
  managingWildlifeSpeciesSfxLastPlayedAtMsByKey.set(
    resolvingWildlifeSpeciesSfxPlaybackKey(instanceId, poolId),
    playedAtMs
  );
}

/** Clears playback timestamps (used on hook teardown). */
export function resettingWildlifeSpeciesSfxPlaybackTimestamps(): void {
  managingWildlifeSpeciesSfxLastPlayedAtMsByKey.clear();
}
