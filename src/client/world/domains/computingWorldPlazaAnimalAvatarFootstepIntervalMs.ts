/**
 * Footstep cadence for playable animal skins (walk/run sheet FPS).
 *
 * @module components/world/domains/computingWorldPlazaAnimalAvatarFootstepIntervalMs
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_WALK_ANIMATION_FPS,
} from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import { DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE } from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  type DefiningWorldPlazaAvatarMotionKind,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { checkingWorldPlazaAvatarMotionKindPlaysFootsteps } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepPlayback';
import { DEFINING_WILDLIFE_SHEET_COLUMN_COUNT } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

/**
 * Interval between animal-avatar footstep one-shots for the current motion.
 */
export function computingWorldPlazaAnimalAvatarFootstepIntervalMs(
  motionKind: DefiningWorldPlazaAvatarMotionKind
): number | null {
  if (!checkingWorldPlazaAvatarMotionKindPlaysFootsteps(motionKind)) {
    return null;
  }

  const animationFps =
    motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
      ? DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_RUN_ANIMATION_FPS
      : DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_WALK_ANIMATION_FPS;

  const cycleDurationMs =
    (DEFINING_WILDLIFE_SHEET_COLUMN_COUNT / animationFps) * 1000;

  return (
    cycleDurationMs /
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_STRIDES_PER_ANIMATION_CYCLE
  );
}
