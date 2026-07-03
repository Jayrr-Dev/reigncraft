import {
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BASE_ALPHA,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FILL_COLOR,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_ALPHA_REDUCTION,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_SCALE_REDUCTION,
  DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_SOFT_LAYERS,
} from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import { resolvingWorldPlazaAvatarGroundShadowRadiiForFacingDirection } from "@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowRadiiForFacingDirection";
import type { Graphics } from "pixi.js";

/**
 * Normalized jump height (0 on ground, 1 at arc peak) used to shrink the shadow.
 *
 * Jump arc offsets are negative when the sprite lifts off the ground.
 *
 * @param jumpArcOffsetPx - Current vertical screen offset from the jump arc.
 * @param jumpArcPeakScreenPx - Peak vertical screen offset for the active jump.
 */
export function computingWorldPlazaAvatarGroundShadowJumpHeightRatio(
  jumpArcOffsetPx: number,
  jumpArcPeakScreenPx: number,
): number {
  if (jumpArcPeakScreenPx <= 0) {
    return 0;
  }

  const upwardLiftPx = Math.max(0, -jumpArcOffsetPx);

  return Math.min(1, upwardLiftPx / jumpArcPeakScreenPx);
}

/**
 * Eases jump height so the shadow shrinks quickly at takeoff and lingers lightly at the peak.
 *
 * @param jumpHeightRatio - Linear normalized jump height.
 */
function easingWorldPlazaAvatarGroundShadowJumpHeightRatio(
  jumpHeightRatio: number,
): number {
  const clampedJumpHeightRatio = Math.min(1, Math.max(0, jumpHeightRatio));

  return clampedJumpHeightRatio * clampedJumpHeightRatio;
}

/**
 * Draws a soft layered ground shadow under the avatar feet.
 *
 * @param graphics - Pixi graphics instance to draw into.
 * @param jumpHeightRatio - Normalized jump height used to shrink and fade the shadow.
 * @param facingDirection - Avatar facing strip used to shape the ellipse.
 * @param footOffsetBelowGridAnchorPx - Distance from grid anchor to painted feet.
 */
export function drawingWorldPlazaAvatarGroundShadowOnGraphics(
  graphics: Graphics,
  jumpHeightRatio = 0,
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection = DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  footOffsetBelowGridAnchorPx = computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx(),
): void {
  const easedJumpHeightRatio = easingWorldPlazaAvatarGroundShadowJumpHeightRatio(
    jumpHeightRatio,
  );
  const shadowScale =
    1 -
    easedJumpHeightRatio *
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_SCALE_REDUCTION;
  const shadowAlpha =
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BASE_ALPHA -
    easedJumpHeightRatio *
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_JUMP_ALPHA_REDUCTION;
  const { coreRadiusXPx, coreRadiusYPx } =
    resolvingWorldPlazaAvatarGroundShadowRadiiForFacingDirection(facingDirection);

  const shadowFootOffsetBelowGridAnchorPx =
    footOffsetBelowGridAnchorPx +
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOT_NUDGE_Y_PX;

  graphics.clear();

  for (const softLayer of DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_SOFT_LAYERS) {
    graphics.ellipse(
      0,
      shadowFootOffsetBelowGridAnchorPx,
      coreRadiusXPx * softLayer.radiusScale * shadowScale,
      coreRadiusYPx * softLayer.radiusScale * shadowScale,
    );
    graphics.fill({
      color: DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FILL_COLOR,
      alpha: shadowAlpha * softLayer.alphaScale,
    });
  }
}

/**
 * Redraws the avatar ground shadow for the current jump arc and facing.
 *
 * @param graphics - Pixi graphics instance, if mounted.
 * @param jumpArcOffsetPx - Current vertical screen offset from the jump arc.
 * @param jumpArcPeakScreenPx - Peak vertical screen offset for the active jump.
 * @param facingDirection - Avatar facing strip used to shape the ellipse.
 * @param footOffsetBelowGridAnchorPx - Distance from grid anchor to painted feet.
 */
export function updatingWorldPlazaAvatarGroundShadowGraphics(
  graphics: Graphics | null,
  jumpArcOffsetPx: number,
  jumpArcPeakScreenPx: number,
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection,
  footOffsetBelowGridAnchorPx = computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx(),
): void {
  if (!graphics) {
    return;
  }

  drawingWorldPlazaAvatarGroundShadowOnGraphics(
    graphics,
    computingWorldPlazaAvatarGroundShadowJumpHeightRatio(
      jumpArcOffsetPx,
      jumpArcPeakScreenPx,
    ),
    facingDirection,
    footOffsetBelowGridAnchorPx,
  );
}
