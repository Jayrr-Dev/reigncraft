import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Returns true when a live wildlife instance should emit locomotion footsteps.
 */
export function checkingWildlifeInstancePlaysFootsteps(
  instance: DefiningWildlifeInstance
): boolean {
  if (instance.isDead) {
    return false;
  }

  if (instance.aiState.isSleeping || instance.aiState.jumpState) {
    return false;
  }

  if (!instance.aiState.isMoving) {
    return false;
  }

  const motionClip = instance.aiState.motionClip;

  return motionClip === 'walk' || motionClip === 'run';
}
