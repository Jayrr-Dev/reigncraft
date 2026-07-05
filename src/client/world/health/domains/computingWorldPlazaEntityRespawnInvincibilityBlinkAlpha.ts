import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

/**
 * Returns sprite opacity while post-respawn invincibility blink is active.
 *
 * @param postRespawnInvincibilityUntilMs - Timestamp when respawn i-frames end.
 * @param nowMs - Current animation clock.
 */
export function computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(
  postRespawnInvincibilityUntilMs: number,
  nowMs: number
): number {
  if (
    postRespawnInvincibilityUntilMs <= 0 ||
    nowMs >= postRespawnInvincibilityUntilMs
  ) {
    return 1;
  }

  const blinkPhase =
    (nowMs %
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS) /
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS;

  return blinkPhase < 0.5
    ? DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA
    : 1;
}
