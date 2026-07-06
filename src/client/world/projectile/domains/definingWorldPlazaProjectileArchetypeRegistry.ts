import type { DefiningWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Declarative projectile archetype registry.
 *
 * @module components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry
 */

const ARROW_STRAIGHT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'arrow-straight',
  movement: {
    behaviorId: 'linear',
    speedGridPerSec: 9,
  },
  hitbox: { radiusGrid: 0.12 },
  altitude: { mode: 'groundHugging' },
  dodge: { jumpDodgeable: true },
  payload: {
    damageAmount: 12,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 4_000,
  visual: {
    clipId: 'projectile-arrow',
    scale: 1,
    tint: 0xc8b496,
    renderPlane: 'ground-sorted',
    spriteRadiusPx: 6,
  },
  blocksOnTerrain: true,
};

const MAGIC_HOMING_SOFT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'magic-homing-soft',
  movement: {
    behaviorId: 'homingSoft',
    speedGridPerSec: 5.5,
    maxTurnRateRadiansPerSec: Math.PI * 1.1,
    homingLeadErrorRadians: 0.4,
  },
  hitbox: { radiusGrid: 0.18 },
  altitude: { mode: 'flying', flyingAltitudePx: 28 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 18,
    damageKind: 'physical',
    statusEffects: [
      { kind: 'potentialDamage', expectedDamage: 6, resolveDelayMs: 1_500 },
    ],
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 6_000,
  visual: {
    clipId: 'projectile-magic-orb',
    scale: 1,
    tint: 0x9b6bff,
    renderPlane: 'effects',
    spriteRadiusPx: 10,
  },
};

const MAGIC_HOMING_DIRECT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'magic-homing-direct',
  movement: {
    behaviorId: 'homingDirect',
    speedGridPerSec: 7.5,
  },
  hitbox: { radiusGrid: 0.2 },
  altitude: { mode: 'flying', flyingAltitudePx: 24 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 22,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 5_000,
  visual: {
    clipId: 'projectile-magic-orb',
    scale: 1.1,
    tint: 0xff5a8a,
    renderPlane: 'effects',
    spriteRadiusPx: 11,
  },
};

const FIREBALL_AOE: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'fireball-aoe',
  movement: {
    behaviorId: 'lobbedArc',
    speedGridPerSec: 0,
    lobFlightDurationMs: 1_200,
  },
  hitbox: { radiusGrid: 0.22 },
  altitude: { mode: 'flying', flyingAltitudePx: 0 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 28,
    damageKind: 'environmental_heat',
    statusEffects: [{ kind: 'buff', buffId: 'heat-ward' }],
  },
  impact: {
    behaviorId: 'aoeExplosion',
    aoeRadiusGrid: 1.6,
    telegraph: {
      radiusGrid: 1.6,
      durationMs: 900,
      leadTimeMs: 600,
    },
  },
  lifetimeMs: 3_000,
  visual: {
    clipId: 'projectile-fireball',
    scale: 1.2,
    tint: 0xff7a2f,
    renderPlane: 'effects',
    spriteRadiusPx: 14,
  },
};

const METEOR_SKY_DROP: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'meteor-sky-drop',
  movement: {
    behaviorId: 'skyDrop',
    speedGridPerSec: 0,
    skyDropStartAltitudePx: 160,
    skyDropFallSpeedPxPerSec: 220,
  },
  hitbox: { radiusGrid: 0.35 },
  altitude: { mode: 'skyDrop' },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 35,
    damageKind: 'environmental_heat',
    statusEffects: [{ kind: 'bleed', severity: 'bleeding', totalDamage: 20 }],
  },
  impact: {
    behaviorId: 'aoeExplosion',
    aoeRadiusGrid: 1.2,
    telegraph: {
      radiusGrid: 1.2,
      durationMs: 1_400,
      leadTimeMs: 1_000,
    },
  },
  lifetimeMs: 4_000,
  visual: {
    clipId: 'projectile-meteor',
    scale: 1.4,
    tint: 0xff4d00,
    renderPlane: 'effects',
    spriteRadiusPx: 16,
  },
};

const CLUSTER_SPLIT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'cluster-split',
  movement: {
    behaviorId: 'linear',
    speedGridPerSec: 4,
  },
  hitbox: { radiusGrid: 0.2 },
  altitude: { mode: 'flying', flyingAltitudePx: 32 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 8,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'passThrough' },
  split: {
    afterMs: 800,
    count: 6,
    childArchetypeId: 'magic-homing-soft',
    spreadPattern: 'radial',
    spreadRadians: Math.PI * 2,
  },
  lifetimeMs: 2_500,
  visual: {
    clipId: 'projectile-cluster',
    scale: 1,
    tint: 0x66e0ff,
    renderPlane: 'effects',
    spriteRadiusPx: 12,
  },
};

export const DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY: Record<
  string,
  DefiningWorldPlazaProjectileArchetype
> = {
  [ARROW_STRAIGHT.archetypeId]: ARROW_STRAIGHT,
  [MAGIC_HOMING_SOFT.archetypeId]: MAGIC_HOMING_SOFT,
  [MAGIC_HOMING_DIRECT.archetypeId]: MAGIC_HOMING_DIRECT,
  [FIREBALL_AOE.archetypeId]: FIREBALL_AOE,
  [METEOR_SKY_DROP.archetypeId]: METEOR_SKY_DROP,
  [CLUSTER_SPLIT.archetypeId]: CLUSTER_SPLIT,
};

export const DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_IDS = Object.keys(
  DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY
) as (keyof typeof DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY)[];

/**
 * Resolves a projectile archetype by id.
 */
export function resolvingWorldPlazaProjectileArchetype(
  archetypeId: string
): DefiningWorldPlazaProjectileArchetype | null {
  return (
    DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY[archetypeId] ?? null
  );
}

/**
 * Lists all registered projectile archetype ids.
 */
export function listingWorldPlazaProjectileArchetypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_IDS;
}
