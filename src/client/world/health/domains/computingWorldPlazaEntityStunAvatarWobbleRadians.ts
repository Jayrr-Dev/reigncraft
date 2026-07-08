import {
  DEFINING_WORLD_PLAZA_STUN_AVATAR_MAX_WOBBLE_RAD,
  DEFINING_WORLD_PLAZA_STUN_AVATAR_WOBBLE_FREQUENCY_RAD_PER_SEC,
} from '@/components/world/health/domains/definingWorldPlazaEntityStunConstants';

/**
 * Computes the avatar body wobble angle while stunned.
 */
export function computingWorldPlazaEntityStunAvatarWobbleRadians(
  nowMs: number,
  phaseSeed: number
): number {
  const phaseRadians =
    nowMs * 0.001 * DEFINING_WORLD_PLAZA_STUN_AVATAR_WOBBLE_FREQUENCY_RAD_PER_SEC +
    phaseSeed;
  const primaryWave = Math.sin(phaseRadians);
  const secondaryWave = Math.sin(phaseRadians * 2.17 + phaseSeed * 0.6);

  return (
    (primaryWave + secondaryWave * 0.35) *
    DEFINING_WORLD_PLAZA_STUN_AVATAR_MAX_WOBBLE_RAD
  );
}
