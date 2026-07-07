import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout } from '@/components/world/domains/computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEFAULT_COMBAT_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_SPRITE_PRESENTATION_LAYOUT,
  type DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatSpritePresentationConstants';

export type ResolvingWorldPlazaGirlSampleCombatSpritePresentationParams = {
  readonly motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix;
  readonly frameIndex?: number;
};

/**
 * Resolves anchor and Y offset for one GirlSample combat/locomotion frame.
 */
export function resolvingWorldPlazaGirlSampleCombatSpritePresentation({
  motionSuffix,
  frameIndex = 0,
}: ResolvingWorldPlazaGirlSampleCombatSpritePresentationParams): DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout {
  if (motionSuffix === 'roll') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_SPRITE_PRESENTATION_LAYOUT;
  }

  if (motionSuffix === 'damaged') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_SPRITE_PRESENTATION_LAYOUT;
  }

  if (motionSuffix === 'death') {
    return computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(
      frameIndex
    );
  }

  if (motionSuffix === 'push') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_SPRITE_PRESENTATION_LAYOUT;
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEFAULT_COMBAT_SPRITE_PRESENTATION_LAYOUT;
}
