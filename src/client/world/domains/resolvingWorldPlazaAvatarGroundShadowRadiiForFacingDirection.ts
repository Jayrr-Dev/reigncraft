import {
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_X_PX,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_Y_PX,
} from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/**
 * Resolves isometric ground-shadow ellipse radii from avatar facing.
 *
 * @module components/world/domains/resolvingWorldPlazaAvatarGroundShadowRadiiForFacingDirection
 */

/** Screen-space ellipse half-extents for one facing. */
export interface ResolvingWorldPlazaAvatarGroundShadowRadii {
  /** Horizontal half-radius in pixels. */
  coreRadiusXPx: number;
  /** Vertical half-radius in pixels. */
  coreRadiusYPx: number;
}

/**
 * Per-direction shadow footprint on the 2:1 isometric floor.
 *
 * Facing the camera (Down) reads widest; facing away (Up) is tighter; side
 * views stretch horizontally on screen.
 */
const DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_RADII_BY_FACING: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  ResolvingWorldPlazaAvatarGroundShadowRadii
> = {
  Down: { coreRadiusXPx: 9, coreRadiusYPx: 4.5 },
  DownRight: { coreRadiusXPx: 8.5, coreRadiusYPx: 4 },
  DownLeft: { coreRadiusXPx: 8.5, coreRadiusYPx: 4 },
  Right: { coreRadiusXPx: 10, coreRadiusYPx: 3 },
  Left: { coreRadiusXPx: 10, coreRadiusYPx: 3 },
  Up: { coreRadiusXPx: 6, coreRadiusYPx: 3 },
  UpRight: { coreRadiusXPx: 7, coreRadiusYPx: 3.5 },
  UpLeft: { coreRadiusXPx: 7, coreRadiusYPx: 3.5 },
};

/**
 * Returns shadow ellipse radii tuned for the avatar's current facing strip.
 *
 * @param facingDirection - Active GirlSample walk / run / jump direction.
 */
export function resolvingWorldPlazaAvatarGroundShadowRadiiForFacingDirection(
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection,
): ResolvingWorldPlazaAvatarGroundShadowRadii {
  return (
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_RADII_BY_FACING[facingDirection] ?? {
      coreRadiusXPx: DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_X_PX,
      coreRadiusYPx: DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_CORE_RADIUS_Y_PX,
    }
  );
}
