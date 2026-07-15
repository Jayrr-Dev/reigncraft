import {
  DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_TRAIL,
  DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_TRAIL,
  DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_TRAIL,
  DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_TRAIL,
} from '@/components/world/projectile/domains/definingWorldPlazaCyrobornProjectileTrailConstants';
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
    statusEffects: [
      { kind: 'buff', buffId: 'heat-ward' },
      { kind: 'temperature', deltaCelsius: 28 },
    ],
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

/** Example gravity-well bolt: coasts with launch velocity, then curves into a frozen aim point. */
const GRAVITY_WELL_BOLT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'gravity-well-bolt',
  movement: {
    behaviorId: 'gravityPull',
    speedGridPerSec: 5,
    gravityAccelerationGridPerSec2: 4,
    gravityRadiusGrid: 10,
    gravityFalloff: 'linear',
    gravityMaxSpeedGridPerSec: 11,
  },
  hitbox: { radiusGrid: 0.16 },
  altitude: { mode: 'flying', flyingAltitudePx: 22 },
  dodge: { jumpDodgeable: true },
  payload: {
    damageAmount: 16,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 5_000,
  visual: {
    clipId: 'projectile-magic-orb',
    scale: 1,
    tint: 0x5ad1ff,
    renderPlane: 'effects',
    spriteRadiusPx: 10,
  },
};

/**
 * Dev gravity ball: same gravityPull physics, but re-aims at the nearest live
 * target each tick so you can run and watch it curve after you.
 */
const GRAVITY_BALL: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'gravity-ball',
  movement: {
    behaviorId: 'gravityPull',
    speedGridPerSec: 3.5,
    gravityAccelerationGridPerSec2: 5.5,
    gravityRadiusGrid: 14,
    gravityFalloff: 'linear',
    gravitySettleRadiusGrid: 0.15,
    gravityMaxSpeedGridPerSec: 9,
    tracksLiveTarget: true,
  },
  hitbox: { radiusGrid: 0.28 },
  altitude: { mode: 'flying', flyingAltitudePx: 26 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 20,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 8_000,
  visual: {
    clipId: 'projectile-gravity-ball',
    scale: 1.35,
    tint: 0x3d8bff,
    renderPlane: 'effects',
    spriteRadiusPx: 16,
  },
};

/**
 * Cyroborn type 1: long-range fast homing ice bolt.
 * Roots the target on hit (immobilize).
 */
const CYROBORN_ICE_BOLT: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'cyroborn-ice-bolt',
  movement: {
    behaviorId: 'homingDirect',
    speedGridPerSec: 14,
    tracksLiveTarget: true,
  },
  hitbox: { radiusGrid: 0.14 },
  altitude: { mode: 'flying', flyingAltitudePx: 30 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 16,
    damageKind: 'physical',
    statusEffects: [{ kind: 'buff', buffId: 'immobilized-debuff' }],
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 7_000,
  visual: {
    clipId: 'cyroborn-ice-bolt',
    scale: 1,
    tint: 0xffffff,
    renderPlane: 'effects',
    spriteRadiusPx: 14,
    alignRotationToVelocity: true,
    trail: DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_TRAIL,
  },
};

/**
 * Cyroborn type 2: sharp straight ice spheres (physical).
 * Bursts ice shards on hit or terrain impact.
 */
const CYROBORN_ICE_SPHERE: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'cyroborn-ice-sphere',
  movement: {
    behaviorId: 'linear',
    speedGridPerSec: 11,
  },
  hitbox: { radiusGrid: 0.16 },
  altitude: { mode: 'flying', flyingAltitudePx: 22 },
  dodge: { jumpDodgeable: true },
  payload: {
    damageAmount: 24,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  split: {
    splitOnImpact: true,
    count: 4,
    childArchetypeId: 'cyroborn-ice-shard-burst',
    spreadPattern: 'radial',
    spreadRadians: Math.PI * 2,
  },
  lifetimeMs: 4_000,
  visual: {
    clipId: 'cyroborn-ice-sphere',
    scale: 1,
    tint: 0xffffff,
    renderPlane: 'effects',
    spriteRadiusPx: 16,
    trail: DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_TRAIL,
  },
  blocksOnTerrain: true,
};

/** Tiny shards spawned when a shatter orb / ice sphere bursts. */
const CYROBORN_ICE_SHARD_BURST: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'cyroborn-ice-shard-burst',
  movement: {
    behaviorId: 'linear',
    speedGridPerSec: 6.5,
  },
  hitbox: { radiusGrid: 0.1 },
  altitude: { mode: 'flying', flyingAltitudePx: 18 },
  dodge: { jumpDodgeable: true },
  payload: {
    damageAmount: 7,
    damageKind: 'physical',
  },
  impact: { behaviorId: 'singleTarget' },
  lifetimeMs: 900,
  visual: {
    clipId: 'cyroborn-ice-shard',
    scale: 0.85,
    tint: 0xffffff,
    renderPlane: 'effects',
    spriteRadiusPx: 10,
    alignRotationToVelocity: true,
    trail: DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_TRAIL,
  },
};

/**
 * Cyroborn type 3: slow homing orb that shatters after 5s or on hit.
 * On hit: −200°C ice temp impulse + fated (potential) damage + shard burst.
 */
const CYROBORN_SHATTER_ORB: DefiningWorldPlazaProjectileArchetype = {
  archetypeId: 'cyroborn-shatter-orb',
  movement: {
    behaviorId: 'homingSoft',
    speedGridPerSec: 4.2,
    maxTurnRateRadiansPerSec: Math.PI * 0.85,
    homingLeadErrorRadians: 0.35,
    tracksLiveTarget: true,
  },
  hitbox: { radiusGrid: 0.22 },
  altitude: { mode: 'flying', flyingAltitudePx: 28 },
  dodge: { jumpDodgeable: false },
  payload: {
    damageAmount: 14,
    damageKind: 'physical',
    statusEffects: [
      { kind: 'temperature', deltaCelsius: -200 },
      {
        kind: 'potentialDamage',
        expectedDamage: 36,
        resolveDelayMs: 2_000,
      },
    ],
  },
  impact: { behaviorId: 'singleTarget' },
  split: {
    afterMs: 5_000,
    splitOnImpact: true,
    count: 5,
    childArchetypeId: 'cyroborn-ice-shard-burst',
    spreadPattern: 'radial',
    spreadRadians: Math.PI * 2,
  },
  lifetimeMs: 5_200,
  visual: {
    clipId: 'cyroborn-shatter-orb',
    scale: 1.1,
    tint: 0xffffff,
    renderPlane: 'effects',
    spriteRadiusPx: 20,
    trail: DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_TRAIL,
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
  [GRAVITY_WELL_BOLT.archetypeId]: GRAVITY_WELL_BOLT,
  [GRAVITY_BALL.archetypeId]: GRAVITY_BALL,
  [CYROBORN_ICE_BOLT.archetypeId]: CYROBORN_ICE_BOLT,
  [CYROBORN_ICE_SPHERE.archetypeId]: CYROBORN_ICE_SPHERE,
  [CYROBORN_ICE_SHARD_BURST.archetypeId]: CYROBORN_ICE_SHARD_BURST,
  [CYROBORN_SHATTER_ORB.archetypeId]: CYROBORN_SHATTER_ORB,
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
