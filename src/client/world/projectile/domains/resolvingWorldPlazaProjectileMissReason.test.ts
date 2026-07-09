import { DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import type { DefiningWorldPlazaProjectileInstance } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { resolvingWorldPlazaProjectileMissReason } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileMissReason';
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
    missFeedbackTargetIds: [],
    telegraphStartedAtMs: null,
    ...patch,
  };
}

describe('resolvingWorldPlazaProjectileMissReason', () => {
  const arrowArchetype =
    DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY['arrow-straight'];
  const homingArchetype =
    DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY['magic-homing-direct'];

  it('returns none for a grounded low-arrow hit', () => {
    expect(
      resolvingWorldPlazaProjectileMissReason({
        instance: creatingTestProjectileInstance(),
        archetype: arrowArchetype,
        target: {
          targetId: 'player',
          point: { x: 0.1, y: 0, layer: 1 },
          collisionRadiusGrid: 0.25,
          jumpArcOffsetPx: 0,
        },
      })
    ).toBe('none');
  });

  it('returns jump_dodge when a jump-dodgeable arrow passes under an airborne player', () => {
    expect(
      resolvingWorldPlazaProjectileMissReason({
        instance: creatingTestProjectileInstance(),
        archetype: arrowArchetype,
        target: {
          targetId: 'player',
          point: { x: 0.1, y: 0, layer: 1 },
          collisionRadiusGrid: 0.25,
          jumpArcOffsetPx: -40,
        },
      })
    ).toBe('jump_dodge');
  });

  it('does not classify jump dodge for non-jump-dodgeable projectiles', () => {
    expect(
      resolvingWorldPlazaProjectileMissReason({
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
      })
    ).toBe('none');
  });
});
