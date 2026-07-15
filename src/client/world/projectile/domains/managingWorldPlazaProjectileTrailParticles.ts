/**
 * Soft icy trail particles for projectile visuals (emit + prune).
 *
 * @module components/world/projectile/domains/managingWorldPlazaProjectileTrailParticles
 */

import type { DefiningWorldPlazaProjectileTrailConfig } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

export type ManagingWorldPlazaProjectileTrailParticle = {
  readonly screenX: number;
  readonly screenY: number;
  readonly zIndex: number;
  readonly bornAtMs: number;
  readonly tint: number;
  readonly startRadiusPx: number;
  readonly endRadiusPx: number;
  readonly startAlpha: number;
  readonly endAlpha: number;
  readonly lifetimeMs: number;
};

export type ManagingWorldPlazaProjectileTrailState = {
  particles: ManagingWorldPlazaProjectileTrailParticle[];
  lastEmitAtMsByProjectileId: Map<string, number>;
};

/**
 * Creates an empty trail particle store for one visual layer.
 */
export function creatingWorldPlazaProjectileTrailState(): ManagingWorldPlazaProjectileTrailState {
  return {
    particles: [],
    lastEmitAtMsByProjectileId: new Map(),
  };
}

/**
 * Emits one trail particle when the spawn interval has elapsed.
 */
export function emittingWorldPlazaProjectileTrailParticle(params: {
  readonly state: ManagingWorldPlazaProjectileTrailState;
  readonly projectileId: string;
  readonly nowMs: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly zIndex: number;
  readonly trail: DefiningWorldPlazaProjectileTrailConfig;
  readonly unitSample: number;
}): void {
  const {
    state,
    projectileId,
    nowMs,
    screenX,
    screenY,
    zIndex,
    trail,
    unitSample,
  } = params;
  const lastEmitAtMs = state.lastEmitAtMsByProjectileId.get(projectileId) ?? 0;

  if (nowMs - lastEmitAtMs < trail.spawnIntervalMs) {
    return;
  }

  state.lastEmitAtMsByProjectileId.set(projectileId, nowMs);

  const sway = (unitSample * 2 - 1) * trail.swayPx;
  const perpendicularSample = (unitSample * 7.13) % 1;
  const swayY = (perpendicularSample * 2 - 1) * trail.swayPx * 0.65;

  state.particles.push({
    screenX: screenX + sway,
    screenY: screenY + swayY,
    zIndex: zIndex - 1,
    bornAtMs: nowMs,
    tint: trail.tint,
    startRadiusPx: trail.startRadiusPx,
    endRadiusPx: trail.endRadiusPx,
    startAlpha: trail.startAlpha,
    endAlpha: trail.endAlpha,
    lifetimeMs: trail.lifetimeMs,
  });

  if (state.particles.length > trail.maxParticles) {
    state.particles.splice(0, state.particles.length - trail.maxParticles);
  }
}

/**
 * Drops expired trail particles and stale emit timers.
 */
export function pruningWorldPlazaProjectileTrailParticles(params: {
  readonly state: ManagingWorldPlazaProjectileTrailState;
  readonly nowMs: number;
  readonly liveProjectileIds: ReadonlySet<string>;
}): void {
  const { state, nowMs, liveProjectileIds } = params;

  state.particles = state.particles.filter(
    (particle) => nowMs - particle.bornAtMs < particle.lifetimeMs
  );

  for (const projectileId of state.lastEmitAtMsByProjectileId.keys()) {
    if (!liveProjectileIds.has(projectileId)) {
      state.lastEmitAtMsByProjectileId.delete(projectileId);
    }
  }
}

/**
 * Resolves fade progress for one trail particle (0 at birth, 1 at death).
 */
export function resolvingWorldPlazaProjectileTrailParticleProgress(
  particle: ManagingWorldPlazaProjectileTrailParticle,
  nowMs: number
): number {
  return Math.min(
    1,
    Math.max(0, (nowMs - particle.bornAtMs) / particle.lifetimeMs)
  );
}
