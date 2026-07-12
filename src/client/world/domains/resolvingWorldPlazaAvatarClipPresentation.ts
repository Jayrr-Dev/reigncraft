import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { resolvingWorldPlazaAvatarMotionSheetLayoutForClipSuffix } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { resolvingWorldPlazaAnimalAvatarCombatDefinition } from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import type { DefiningWorldPlazaGirlSampleMotionSheetLayout } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

export type ResolvingWorldPlazaAvatarCombatClipPresentation = {
  readonly sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly animationFps: number;
};

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_CLIP_PRESENTATION_BY_SUFFIX: Record<
  Extract<
    DefiningWorldPlazaAvatarMotionClipSuffix,
    'roll' | 'melee' | 'damaged' | 'death' | 'push' | 'boost' | 'block'
  >,
  ResolvingWorldPlazaAvatarCombatClipPresentation
> = {
  roll: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS,
  },
  melee: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS,
  },
  damaged: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS,
  },
  death: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_ANIMATION_FPS,
  },
  push: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS,
  },
  boost: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_ANIMATION_FPS,
  },
  block: {
    sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_MOTION_SHEET_LAYOUT,
    animationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_ANIMATION_FPS,
  },
};

/**
 * Resolves sheet layout and fps for locomotion or combat clips.
 */
export function resolvingWorldPlazaAvatarClipPresentation(
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition,
  clipSuffix: DefiningWorldPlazaAvatarMotionClipSuffix
): ResolvingWorldPlazaAvatarCombatClipPresentation {
  const animalCombatDefinition = resolvingWorldPlazaAnimalAvatarCombatDefinition(
    characterDefinition.skinId
  );

  if (animalCombatDefinition && (clipSuffix === 'roll' || clipSuffix === 'melee')) {
    return {
      sheetLayout: animalCombatDefinition.sheetLayout,
      animationFps:
        clipSuffix === 'roll'
          ? animalCombatDefinition.roll.animationFps
          : animalCombatDefinition.melee.animationFps,
    };
  }

  const combatPresentation =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_CLIP_PRESENTATION_BY_SUFFIX[
      clipSuffix as keyof typeof DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_CLIP_PRESENTATION_BY_SUFFIX
    ];

  if (combatPresentation) {
    return combatPresentation;
  }

  const locomotionSheetLayout =
    resolvingWorldPlazaAvatarMotionSheetLayoutForClipSuffix(
      characterDefinition,
      clipSuffix as 'walk' | 'run' | 'jump' | 'idle' | 'fall'
    );

  const locomotionFpsBySuffix = {
    walk: characterDefinition.walkAnimationFps,
    run: characterDefinition.runAnimationFps,
    jump: characterDefinition.jumpAnimationFps,
    idle: characterDefinition.idleAnimationFps,
    fall: characterDefinition.fallAnimationFps,
  } as const;

  return {
    sheetLayout: locomotionSheetLayout,
    animationFps:
      locomotionFpsBySuffix[clipSuffix as keyof typeof locomotionFpsBySuffix] ??
      characterDefinition.idleAnimationFps,
  };
}
