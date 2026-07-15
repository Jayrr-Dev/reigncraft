/**
 * Draws soft whispy trail particles onto a Pixi Graphics layer.
 *
 * @module components/world/projectile/domains/drawingWorldPlazaProjectileTrailParticlesOnGraphics
 */

import {
  resolvingWorldPlazaProjectileTrailParticleProgress,
  type ManagingWorldPlazaProjectileTrailParticle,
} from '@/components/world/projectile/domains/managingWorldPlazaProjectileTrailParticles';
import type { Graphics } from 'pixi.js';

/**
 * Clears and redraws all live trail particles.
 */
export function drawingWorldPlazaProjectileTrailParticlesOnGraphics(
  graphics: Graphics,
  particles: readonly ManagingWorldPlazaProjectileTrailParticle[],
  nowMs: number
): boolean {
  graphics.clear();

  if (particles.length === 0) {
    graphics.visible = false;
    return false;
  }

  let drewAny = false;
  let maxZIndex = Number.NEGATIVE_INFINITY;

  for (const particle of particles) {
    const progress = resolvingWorldPlazaProjectileTrailParticleProgress(
      particle,
      nowMs
    );
    const alpha =
      particle.startAlpha +
      (particle.endAlpha - particle.startAlpha) * progress;
    const radiusPx =
      particle.startRadiusPx +
      (particle.endRadiusPx - particle.startRadiusPx) * progress;

    if (alpha <= 0.01 || radiusPx <= 0.25) {
      continue;
    }

    graphics.circle(particle.screenX, particle.screenY, radiusPx);
    graphics.fill({
      color: particle.tint,
      alpha,
    });
    // Soft outer wisp ring.
    graphics.circle(particle.screenX, particle.screenY, radiusPx * 1.65);
    graphics.fill({
      color: particle.tint,
      alpha: alpha * 0.35,
    });
    maxZIndex = Math.max(maxZIndex, particle.zIndex);
    drewAny = true;
  }

  if (drewAny && Number.isFinite(maxZIndex)) {
    graphics.zIndex = maxZIndex;
  }

  graphics.visible = drewAny;
  return drewAny;
}
