import { DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import { resolvingWorldPlazaProjectileSplitSpawnRequests } from '@/components/world/projectile/domains/definingWorldPlazaProjectileImpactBehaviorRegistry';
import type { DefiningWorldPlazaProjectileInstance } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  checkingWorldPlazaProjectileAlreadyHitTarget,
  resolvingWorldPlazaProjectileHit,
} from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileHit';
import { describe, expect, it } from 'vitest';

function creatingTestProjectileInstance(
  patch: Partial<DefiningWorldPlazaProjectileInstance> = {}
): DefiningWorldPlazaProjectileInstance {
  return {
    projectileId: 'test-projectile',
    archetypeId: 'arrow-straight',
    spawnedAtMs: 0,
    seed: 42,
    spawnerUserId: null,
    origin: { x: 0, y: 0, layer: 1 },
    position: { x: 0, y: 0, layer: 1 },
    velocityX: 1,
    velocityY: 0,
    altitudePx: 0,
    altitudeVelocityPxPerSec: 0,
    targetPoint: null,
    homingLeadErrorRadians: 0,
    lobProgress: 0,
    hasSplit: false,
    hasImpacted: false,
    hitTargetIds: [],
    telegraphStartedAtMs: null,
    ...patch,
  };
}

describe('resolvingWorldPlazaProjectileHit', () => {
  const arrowArchetype =
    DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY['arrow-straight'];
  const homingArchetype =
    DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY['magic-homing-direct'];

  it('hits a grounded player with a low arrow', () => {
    const didHit = resolvingWorldPlazaProjectileHit({
      instance: creatingTestProjectileInstance(),
      archetype: arrowArchetype,
      target: {
        targetId: 'player',
        point: { x: 0.1, y: 0, layer: 1 },
        collisionRadiusGrid: 0.25,
        jumpArcOffsetPx: 0,
      },
    });

    expect(didHit).toBe(true);
  });

  it('allows jump dodge for low arrows when the player is airborne', () => {
    const didHit = resolvingWorldPlazaProjectileHit({
      instance: creatingTestProjectileInstance(),
      archetype: arrowArchetype,
      target: {
        targetId: 'player',
        point: { x: 0.1, y: 0, layer: 1 },
        collisionRadiusGrid: 0.25,
        jumpArcOffsetPx: -40,
      },
    });

    expect(didHit).toBe(false);
  });

  it('does not allow jump dodge for homing direct projectiles', () => {
    const didHit = resolvingWorldPlazaProjectileHit({
      instance: creatingTestProjectileInstance({
        archetypeId: 'magic-homing-direct',
        altitudePx: 24,
      }),
      archetype: homingArchetype,
      target: {
        targetId: 'player',
        point: { x: 0.1, y: 0, layer: 1 },
        collisionRadiusGrid: 0.25,
        jumpArcOffsetPx: -40,
      },
    });

    expect(didHit).toBe(true);
  });
});

describe('checkingWorldPlazaProjectileAlreadyHitTarget', () => {
  it('tracks prior hits on an instance', () => {
    const instance = creatingTestProjectileInstance({
      hitTargetIds: ['player'],
    });

    expect(
      checkingWorldPlazaProjectileAlreadyHitTarget(instance, 'player')
    ).toBe(true);
    expect(
      checkingWorldPlazaProjectileAlreadyHitTarget(instance, 'mob-1')
    ).toBe(false);
  });
});

describe('resolvingWorldPlazaProjectileSplitSpawnRequests', () => {
  it('creates radial child spawn requests', () => {
    const requests = resolvingWorldPlazaProjectileSplitSpawnRequests({
      instance: creatingTestProjectileInstance({
        archetypeId: 'cluster-split',
      }),
      split: {
        afterMs: 800,
        count: 3,
        childArchetypeId: 'magic-homing-soft',
        spreadPattern: 'radial',
      },
      nowMs: 900,
    });

    expect(requests).toHaveLength(3);
    expect(
      requests.every((request) => request.archetypeId === 'magic-homing-soft')
    ).toBe(true);
    expect(new Set(requests.map((request) => request.projectileId)).size).toBe(
      3
    );
  });
});
