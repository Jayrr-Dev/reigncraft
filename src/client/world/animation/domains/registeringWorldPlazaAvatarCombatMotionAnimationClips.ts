import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
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
import type { DefiningWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';

export type RegisteringWorldPlazaAvatarCombatMotionAnimationClipsParams = {
  readonly characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition;
  readonly textures: DefiningWorldPlazaGirlSampleCharacterTextures;
};

/**
 * Registers GirlSample combat presentation clips (roll, melee, death, ...).
 */
export function registeringWorldPlazaAvatarCombatMotionAnimationClips(
  params: RegisteringWorldPlazaAvatarCombatMotionAnimationClipsParams
): void {
  const { characterDefinition, textures } = params;

  if (
    characterDefinition.skinId !== DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
  ) {
    return;
  }

  const combatClips = [
    {
      suffix: 'roll' as const,
      textures: textures.roll,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'melee' as const,
      textures: textures.melee,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MELEE_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'damaged' as const,
      textures: textures.damaged,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'death' as const,
      textures: textures.death,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'push' as const,
      textures: textures.push,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'boost' as const,
      textures: textures.boost,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BOOST_ANIMATION_FPS,
      playbackMode: 'loop' as const,
    },
    {
      suffix: 'block' as const,
      textures: textures.block,
      sheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_MOTION_SHEET_LAYOUT,
      fps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_ANIMATION_FPS,
      playbackMode: 'once' as const,
    },
  ] as const;

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
