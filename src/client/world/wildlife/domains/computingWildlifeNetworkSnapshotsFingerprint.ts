/**
 * Builds a compact fingerprint for wildlife network snapshots so sync can
 * skip unchanged payloads.
 *
 * @module components/world/wildlife/domains/computingWildlifeNetworkSnapshotsFingerprint
 */

import type { PlazaDevvitOnlineWildlifeSnapshot } from '../../../../shared/plazaDevvitOnline';

/**
 * Stable string fingerprint for one wildlife snapshot array.
 * Quantizes positions so float noise does not force a re-send every tick.
 */
export function computingWildlifeNetworkSnapshotsFingerprint(
  snapshots: readonly PlazaDevvitOnlineWildlifeSnapshot[]
): string {
  if (snapshots.length === 0) {
    return '';
  }

  const parts: string[] = [];

  for (const snapshot of snapshots) {
    parts.push(
      [
        snapshot.instanceId,
        snapshot.speciesId,
        Math.round(snapshot.x * 10),
        Math.round(snapshot.y * 10),
        snapshot.facingDirection,
        snapshot.motionClip,
        Math.round(snapshot.healthCurrent),
      ].join(':')
    );
  }

  return parts.join('|');
}
