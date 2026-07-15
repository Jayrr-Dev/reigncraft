import { computingWorldPlazaProjectileScreenRotationRadians } from '@/components/world/projectile/domains/computingWorldPlazaProjectileScreenRotationRadians';
import type { DefiningWorldPlazaProjectileInstance } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { describe, expect, it } from 'vitest';

function buildingProjectile(
  patch: Partial<DefiningWorldPlazaProjectileInstance>
): DefiningWorldPlazaProjectileInstance {
  return {
    projectileId: 'p1',
    archetypeId: 'cyroborn-ice-bolt',
    spawnedAtMs: 0,
    seed: 1,
    spawnerUserId: 'local-player',
    position: { x: 10, y: 10 },
    origin: { x: 10, y: 10 },
    velocityX: 0,
    velocityY: 0,
    altitudePx: 0,
    altitudeVelocityPxPerSec: 0,
    targetPoint: { x: 12, y: 10 },
    homingLeadErrorRadians: 0,
    lobProgress: 0,
    hasSplit: false,
    hasImpacted: false,
    hitTargetIds: [],
    missFeedbackTargetIds: [],
    telegraphStartedAtMs: null,
    ...patch,
  };
}

describe('computingWorldPlazaProjectileScreenRotationRadians', () => {
  it('returns 0 when nearly stationary', () => {
    expect(
      computingWorldPlazaProjectileScreenRotationRadians(
        buildingProjectile({ velocityX: 0, velocityY: 0 })
      )
    ).toBe(0);
  });

  it('returns a finite angle when moving', () => {
    const angle = computingWorldPlazaProjectileScreenRotationRadians(
      buildingProjectile({ velocityX: 1, velocityY: 0 })
    );

    expect(Number.isFinite(angle)).toBe(true);
  });
});
