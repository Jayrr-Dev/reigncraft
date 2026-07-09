/**
 * Scales wildlife walk/run clip playback to match resolved body speed.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeLocomotionAnimationSpeedScale
 */

import { checkingWildlifeWalkMotionUsesRunSheet } from '@/components/world/wildlife/domains/checkingWildlifeWalkMotionUsesRunSheet';
import {
  DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MAX,
  DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MIN,
  DEFINING_WILDLIFE_LOCOMOTION_RUN_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND,
  DEFINING_WILDLIFE_LOCOMOTION_WALK_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeLocomotionAnimationConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

function clampingWildlifeLocomotionAnimationSpeedScale(scale: number): number {
  return Math.min(
    DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MAX,
    Math.max(DEFINING_WILDLIFE_LOCOMOTION_ANIMATION_SPEED_SCALE_MIN, scale)
  );
}

/**
 * Returns playback `speedScale` for one instance motion clip.
 * Non-locomotion clips stay at `1`.
 */
export function resolvingWildlifeLocomotionAnimationSpeedScale(
  species: DefiningWildlifeSpeciesDefinition,
  instance: DefiningWildlifeInstance,
  motionClip: DefiningWildlifeMotionClipKind
): number {
  if (motionClip !== 'walk' && motionClip !== 'run') {
    return 1;
  }

  const actualSpeedGridPerSecond =
    motionClip === 'run'
      ? resolvingWildlifeInstanceRunSpeedGridPerSecond(species, instance)
      : resolvingWildlifeInstanceWalkSpeedGridPerSecond(species, instance);

  const usesRunSheetAsWalk =
    motionClip === 'walk' &&
    checkingWildlifeWalkMotionUsesRunSheet(species.speciesId);

  const referenceSpeedGridPerSecond =
    motionClip === 'run' || usesRunSheetAsWalk
      ? DEFINING_WILDLIFE_LOCOMOTION_RUN_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND
      : DEFINING_WILDLIFE_LOCOMOTION_WALK_ANIMATION_REFERENCE_SPEED_GRID_PER_SECOND;

  if (referenceSpeedGridPerSecond <= 0) {
    return 1;
  }

  return clampingWildlifeLocomotionAnimationSpeedScale(
    actualSpeedGridPerSecond / referenceSpeedGridPerSecond
  );
}
