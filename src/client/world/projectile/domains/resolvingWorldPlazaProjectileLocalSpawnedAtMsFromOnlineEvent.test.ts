import { describe, expect, it } from 'vitest';
import { resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent';

describe('resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent', () => {
  it('preserves projectile age when remapping wall clock onto performance.now', () => {
    const wallNowMs = 1_700_000_000_500;
    const onlineSpawnedAtMs = 1_700_000_000_000;
    const simulationNowMs = 12_345;

    expect(
      resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent(
        onlineSpawnedAtMs,
        simulationNowMs,
        wallNowMs
      )
    ).toBe(12_345 - 500);
  });

  it('clamps negative age when online stamp is ahead of local wall clock', () => {
    expect(
      resolvingWorldPlazaProjectileLocalSpawnedAtMsFromOnlineEvent(
        1_700_000_001_000,
        8_000,
        1_700_000_000_000
      )
    ).toBe(8_000);
  });
});
