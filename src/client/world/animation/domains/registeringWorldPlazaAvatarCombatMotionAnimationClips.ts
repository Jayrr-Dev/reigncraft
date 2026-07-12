import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { resolvingWorldPlazaAnimalAvatarCombatDefinition } from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
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
import type { DefiningWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';

export type RegisteringWorldPlazaAvatarCombatMotionAnimationClipsParams = {
  readonly characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition;
  readonly textures: DefiningWorldPlazaGirlSampleCharacterTextures;
};

type DefiningWorldPlazaAvatarCombatClipRegistration = {
  readonly suffix:
    | 'roll'
    | 'melee'
    | 'damaged'
    | 'death'
    | 'push'
    | 'boost'
    | 'block';
  readonly textures:
    | DefiningWorldPlazaGirlSampleCharacterTextures['roll']
    | undefined;
  readonly sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly fps: number;
  readonly playbackMode: 'once' | 'loop';
};

/**
 * Builds the combat clip list for the active skin from loaded textures.
 */
function resolvingWorldPlazaAvatarCombatClipRegistrations(
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition,
  textures: DefiningWorldPlazaGirlSampleCharacterTextures
): readonly DefiningWorldPlazaAvatarCombatClipRegistration[] {
  const animalCombatDefinition = resolvingWorldPlazaAnimalAvatarCombatDefinition(
    characterDefinition.skinId
  );

  if (animalCombatDefinition) {
    return [
      {
        suffix: 'roll',
        textures: textures.roll,
        sheetLayout: animalCombatDefinition.sheetLayout,
        fps: animalCombatDefinition.roll.animationFps,
        playbackMode: 'once',
      },
      {
        suffix: 'melee',
        textures: textures.melee,
        sheetLayout: animalCombatDefinition.sheetLayout,
        fps: animalCombatDefinition.melee.animationFps,
        playbackMode: 'once',
      },
    ];
  }

  if (
    characterDefinition.skinId !== DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
  ) {
    return [];
  }

  return [
    {
      suffix: 'roll',
      textures: textures.roll,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS,
      playbackMode: 'once',
    },
    {
      suffix: 'melee',
      textures: textures.melee,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS,
      playbackMode: 'once',
    },
    {
      suffix: 'damaged',
      textures: textures.damaged,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS,
      playbackMode: 'once',
    },
    {
      suffix: 'death',
      textures: textures.death,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_ANIMATION_FPS,
      playbackMode: 'once',
    },
    {
      suffix: 'push',
      textures: textures.push,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS,
      playbackMode: 'once',
    },
    {
      suffix: 'boost',
      textures: textures.boost,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_ANIMATION_FPS,
      playbackMode: 'loop',
    },
    {
      suffix: 'block',
      textures: textures.block,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_ANIMATION_FPS,
      playbackMode: 'once',
    },
  ];
}

/**
 * Registers combat presentation clips (roll, melee, death, ...) for skins that
 * ship combat strips.
 */
export function registeringWorldPlazaAvatarCombatMotionAnimationClips(
  params: RegisteringWorldPlazaAvatarCombatMotionAnimationClipsParams
): void {
  const { characterDefinition, textures } = params;
  const combatClips = resolvingWorldPlazaAvatarCombatClipRegistrations(
    characterDefinition,
    textures
  );

  for (const combatClip of combatClips) {
    if (!combatClip.textures) {
      continue;
    }
    const frameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
      combatClip.textures,
      combatClip.sheetLayout
    );

    registeringWorldPlazaAnimationClip(
      buildingWorldPlazaAnimationClipFromMotionSheet({
        clipId: `${DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX}${characterDefinition.skinId}-${combatClip.suffix}`,
        frameTextures,
        sheetLayout: combatClip.sheetLayout,
        fps: combatClip.fps,
        playbackMode: combatClip.playbackMode,
      })
    );
  }
}
