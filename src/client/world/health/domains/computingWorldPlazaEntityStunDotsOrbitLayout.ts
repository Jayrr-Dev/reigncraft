import {
  DEFINING_WORLD_PLAZA_STUN_DOT_COUNT,
  DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_ROTATIONS_PER_SEC,
} from '@/components/world/health/domains/definingWorldPlazaEntityStunConstants';

export type ComputingWorldPlazaEntityStunDotsOrbitLayoutDot = {
  x: number;
  y: number;
};

/**
 * Lays out stun dots on a circle that spins above the avatar head.
 *
 * Offsets are in unscaled overlay pixels; camera zoom is applied by the
 * DOM overlay scale wrapper, not here.
 */
export function computingWorldPlazaEntityStunDotsOrbitLayout({
  nowMs,
  phaseSeed,
}: {
  nowMs: number;
  phaseSeed: number;
}): ComputingWorldPlazaEntityStunDotsOrbitLayoutDot[] {
  const orbitRadiusPx = DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_RADIUS_PX;
  const orbitAngleRadians =
    nowMs *
      0.001 *
      DEFINING_WORLD_PLAZA_STUN_DOT_ORBIT_ROTATIONS_PER_SEC *
      Math.PI *
      2 +
    phaseSeed;

  return Array.from(
    { length: DEFINING_WORLD_PLAZA_STUN_DOT_COUNT },
    (_, index) => {
      const dotAngleRadians =
        orbitAngleRadians +
        (index / DEFINING_WORLD_PLAZA_STUN_DOT_COUNT) * Math.PI * 2;

      return {
        x: Math.cos(dotAngleRadians) * orbitRadiusPx,
        y: Math.sin(dotAngleRadians) * orbitRadiusPx,
      };
    }
  );
}
