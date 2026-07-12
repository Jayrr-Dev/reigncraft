/**
 * Resolves ground-shadow size scale from avatar visual footprint.
 *
 * Shadow ellipse radii are tuned for GirlSample at sizeScale 1. Animal skins
 * multiply a larger presentation spriteScale on top of engine sizeScale, so the
 * shadow must track on-screen height or it stays tiny under big bodies.
 *
 * @module components/world/domains/computingWorldPlazaAvatarGroundShadowSizeScale
 */

import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** On-screen height that matches the default sizeScale=1 shadow radii. */
const COMPUTING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_REFERENCE_VISUAL_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX *
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE;

/**
 * Shadow size scale for one avatar presentation + engine size scale.
 */
export function computingWorldPlazaAvatarGroundShadowSizeScale(
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition,
  sizeScale: number
): number {
  const visualHeightPx =
    characterDefinition.walkSheetLayout.frameHeightPx *
    characterDefinition.spriteScale *
    Math.max(0.1, sizeScale);

  return Math.max(
    0.25,
    visualHeightPx /
      COMPUTING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_REFERENCE_VISUAL_HEIGHT_PX
  );
}
