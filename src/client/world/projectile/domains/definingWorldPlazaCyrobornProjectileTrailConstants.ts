/**
 * Declarative whispy icy trail profiles for Cyroborn projectiles.
 *
 * @module components/world/projectile/domains/definingWorldPlazaCyrobornProjectileTrailConstants
 */

import type { DefiningWorldPlazaProjectileTrailConfig } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

const CYROBORN_ICE_TRAIL_BASE: DefiningWorldPlazaProjectileTrailConfig = {
  tint: 0xb8f0ff,
  spawnIntervalMs: 28,
  lifetimeMs: 320,
  startRadiusPx: 5,
  endRadiusPx: 1.5,
  startAlpha: 0.45,
  endAlpha: 0,
  maxParticles: 48,
  swayPx: 3.5,
};

/** Fast bolt: denser, thinner mist. */
export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_BOLT_TRAIL: DefiningWorldPlazaProjectileTrailConfig =
  {
    ...CYROBORN_ICE_TRAIL_BASE,
    tint: 0xd6f7ff,
    spawnIntervalMs: 22,
    lifetimeMs: 260,
    startRadiusPx: 4,
    endRadiusPx: 1,
    startAlpha: 0.4,
    swayPx: 2.5,
  };

/** Ice sphere: short crystal dust puff. */
export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_SPHERE_TRAIL: DefiningWorldPlazaProjectileTrailConfig =
  {
    ...CYROBORN_ICE_TRAIL_BASE,
    tint: 0x9fe8ff,
    spawnIntervalMs: 30,
    lifetimeMs: 300,
    startRadiusPx: 5.5,
    startAlpha: 0.42,
  };

/** Shatter orb: thicker cold fog. */
export const DEFINING_WORLD_PLAZA_CYROBORN_SHATTER_ORB_TRAIL: DefiningWorldPlazaProjectileTrailConfig =
  {
    ...CYROBORN_ICE_TRAIL_BASE,
    tint: 0x7ec8ff,
    spawnIntervalMs: 26,
    lifetimeMs: 420,
    startRadiusPx: 7,
    endRadiusPx: 2,
    startAlpha: 0.5,
    maxParticles: 64,
    swayPx: 4.5,
  };

/** Shard burst: quick sparkle wisps. */
export const DEFINING_WORLD_PLAZA_CYROBORN_ICE_SHARD_TRAIL: DefiningWorldPlazaProjectileTrailConfig =
  {
    ...CYROBORN_ICE_TRAIL_BASE,
    tint: 0xe8fbff,
    spawnIntervalMs: 24,
    lifetimeMs: 200,
    startRadiusPx: 3,
    endRadiusPx: 0.8,
    startAlpha: 0.55,
    maxParticles: 24,
    swayPx: 2,
  };
