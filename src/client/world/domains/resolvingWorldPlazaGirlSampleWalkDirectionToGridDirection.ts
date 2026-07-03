import {
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaMovementDirection } from "@/components/world/domains/definingWorldPlazaMovementDirection";
import { transformingWorldPlazaScreenDirectionToIsometricGridDirection } from "@/components/world/domains/transformingWorldPlazaScreenDirectionToIsometricGridDirection";

/** Screen-space unit direction for each GirlSample facing strip. */
const RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_SCREEN_UNIT_BY_DIRECTION: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  DefiningWorldPlazaMovementDirection
> = {
  Right: { x: 1, y: 0 },
  DownRight: { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2 },
  Down: { x: 0, y: 1 },
  DownLeft: { x: -1 / Math.SQRT2, y: 1 / Math.SQRT2 },
  Left: { x: -1, y: 0 },
  UpLeft: { x: -1 / Math.SQRT2, y: -1 / Math.SQRT2 },
  Up: { x: 0, y: -1 },
  UpRight: { x: 1 / Math.SQRT2, y: -1 / Math.SQRT2 },
};

/**
 * Maps a GirlSample screen-facing strip to a normalized isometric grid direction.
 *
 * @param direction - Current avatar facing from walk/run/jump strips.
 */
export function resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
): DefiningWorldPlazaMovementDirection {
  return transformingWorldPlazaScreenDirectionToIsometricGridDirection(
    RESOLVING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTION_SCREEN_UNIT_BY_DIRECTION[
      direction
    ],
  );
}
