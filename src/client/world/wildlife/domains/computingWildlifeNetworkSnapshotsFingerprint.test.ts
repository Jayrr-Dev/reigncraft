import { describe, expect, it } from 'vitest';

import { computingWildlifeNetworkSnapshotsFingerprint } from '@/components/world/wildlife/domains/computingWildlifeNetworkSnapshotsFingerprint';
import type { PlazaDevvitOnlineWildlifeSnapshot } from '../../../../shared/plazaDevvitOnline';

function buildingSnapshot(
  overrides: Partial<PlazaDevvitOnlineWildlifeSnapshot> = {}
): PlazaDevvitOnlineWildlifeSnapshot {
  return {
    instanceId: 'deer-1',
    speciesId: 'deer',
    x: 10.12,
    y: 20.34,
    facingDirection: 'Down',
    motionClip: 'walk',
    healthCurrent: 40,
    ...overrides,
  };
}

describe('computingWildlifeNetworkSnapshotsFingerprint', () => {
  it('returns empty string for no snapshots', () => {
    expect(computingWildlifeNetworkSnapshotsFingerprint([])).toBe('');
  });

  it('matches when only float noise differs within one decimal', () => {
    const left = computingWildlifeNetworkSnapshotsFingerprint([
      buildingSnapshot({ x: 10.12, y: 20.34 }),
    ]);
    const right = computingWildlifeNetworkSnapshotsFingerprint([
      buildingSnapshot({ x: 10.14, y: 20.31 }),
    ]);

    expect(left).toBe(right);
  });

  it('changes when motion or quantized position changes', () => {
    const idle = computingWildlifeNetworkSnapshotsFingerprint([
      buildingSnapshot({ motionClip: 'idle', x: 10 }),
    ]);
    const walk = computingWildlifeNetworkSnapshotsFingerprint([
      buildingSnapshot({ motionClip: 'walk', x: 10 }),
    ]);
    const moved = computingWildlifeNetworkSnapshotsFingerprint([
      buildingSnapshot({ motionClip: 'idle', x: 11 }),
    ]);

    expect(idle).not.toBe(walk);
    expect(idle).not.toBe(moved);
  });
});
