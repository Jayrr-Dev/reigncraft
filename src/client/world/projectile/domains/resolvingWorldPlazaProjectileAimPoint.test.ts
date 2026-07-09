import type {
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileMovementConfig,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { resolvingWorldPlazaProjectileAimPoint } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileAimPoint';
import { describe, expect, it } from 'vitest';

const baseInstance: DefiningWorldPlazaProjectileInstance = {
  projectileId: 'p1',
  archetypeId: 'gravity-ball',
  spawnedAtMs: 0,
  seed: 1,
  spawnerUserId: null,
  position: { x: 0, y: 0 },
  origin: { x: 0, y: 0 },
  velocityX: 1,
  velocityY: 0,
  altitudePx: 0,
  altitudeVelocityPxPerSec: 0,
  targetPoint: { x: 10, y: 10 },
  homingLeadErrorRadians: 0,
  lobProgress: 0,
  hasSplit: false,
  hasImpacted: false,
  hitTargetIds: [],
  telegraphStartedAtMs: null,
};

const frozenMovement: DefiningWorldPlazaProjectileMovementConfig = {
  behaviorId: 'gravityPull',
  speedGridPerSec: 5,
};

const trackingMovement: DefiningWorldPlazaProjectileMovementConfig = {
  behaviorId: 'gravityPull',
  speedGridPerSec: 5,
  tracksLiveTarget: true,
};

describe('resolvingWorldPlazaProjectileAimPoint', () => {
  it('returns frozen spawn target when not tracking', () => {
    const aim = resolvingWorldPlazaProjectileAimPoint({
      instance: baseInstance,
      movement: frozenMovement,
      targets: [
        {
          targetId: 'player',
          point: { x: 3, y: 4 },
          collisionRadiusGrid: 0.3,
          jumpArcOffsetPx: 0,
        },
      ],
    });

    expect(aim).toEqual({ x: 10, y: 10 });
  });

  it('returns nearest live target when tracking', () => {
    const targets: readonly DefiningWorldPlazaProjectileTarget[] = [
      {
        targetId: 'far',
        point: { x: 20, y: 0 },
        collisionRadiusGrid: 0.3,
        jumpArcOffsetPx: 0,
      },
      {
        targetId: 'near',
        point: { x: 2, y: 0 },
        collisionRadiusGrid: 0.3,
        jumpArcOffsetPx: 0,
      },
    ];

    const aim = resolvingWorldPlazaProjectileAimPoint({
      instance: baseInstance,
      movement: trackingMovement,
      targets,
    });

    expect(aim).toEqual({ x: 2, y: 0 });
  });

  it('falls back to spawn target when tracking but no targets exist', () => {
    const aim = resolvingWorldPlazaProjectileAimPoint({
      instance: baseInstance,
      movement: trackingMovement,
      targets: [],
    });

    expect(aim).toEqual({ x: 10, y: 10 });
  });
});
