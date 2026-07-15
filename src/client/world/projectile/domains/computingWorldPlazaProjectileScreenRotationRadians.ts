/**
 * Screen-space facing angle for velocity-aligned projectile sprites.
 *
 * @module components/world/projectile/domains/computingWorldPlazaProjectileScreenRotationRadians
 */

import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaProjectileInstance } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Returns radians for a sprite authored pointing to the right (+X).
 * Uses isometric screen delta from grid velocity so facing matches on-screen travel.
 */
export function computingWorldPlazaProjectileScreenRotationRadians(
  instance: DefiningWorldPlazaProjectileInstance
): number {
  const speedSquared =
    instance.velocityX * instance.velocityX +
    instance.velocityY * instance.velocityY;

  if (speedSquared < 1e-8) {
    return 0;
  }

  const fromScreen = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const toScreen = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: instance.position.x + instance.velocityX,
    y: instance.position.y + instance.velocityY,
    layer: instance.position.layer,
  });

  return Math.atan2(toScreen.y - fromScreen.y, toScreen.x - fromScreen.x);
}
