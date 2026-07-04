import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_AVATAR_ANIMATION_MS } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';

export type DefiningWorldPlazaEntityDeathAvatarVisualState = {
  /** Normalized animation progress in [0, 1]. */
  progress: number;
  /** Sprite rotation in radians (knockdown). */
  spriteRotationRad: number;
  /** Sprite opacity in [0, 1]. */
  spriteAlpha: number;
  /** Extra downward offset in screen pixels. */
  spriteOffsetYPx: number;
  /** Ground shadow opacity in [0, 1]. */
  shadowAlpha: number;
};

function easingWorldPlazaEntityDeathAnimation(progress: number): number {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return 1 - Math.pow(1 - clampedProgress, 3);
}

/**
 * Computes knockdown sprite transforms for the local avatar death animation.
 *
 * @param deathStartedAtMs - Timestamp when the player entered the dead state.
 * @param nowMs - Current animation clock.
 */
export function computingWorldPlazaEntityDeathAvatarVisualState(
  deathStartedAtMs: number,
  nowMs: number
): DefiningWorldPlazaEntityDeathAvatarVisualState {
  const elapsedMs = Math.max(0, nowMs - deathStartedAtMs);
  const rawProgress =
    elapsedMs / DEFINING_WORLD_PLAZA_ENTITY_DEATH_AVATAR_ANIMATION_MS;
  const progress = easingWorldPlazaEntityDeathAnimation(rawProgress);

  return {
    progress,
    spriteRotationRad: progress * (Math.PI / 2.15),
    spriteAlpha: 1 - progress * 0.35,
    spriteOffsetYPx: progress * 20,
    shadowAlpha: 1 - progress * 0.65,
  };
}
