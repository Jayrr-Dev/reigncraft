import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import type { DefiningWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';

/**
 * Registers walk, run, jump, idle, and fall motion clips for one avatar skin.
 *
 * Playback requests use `variantKey` = facing direction (e.g. `south`).
 *
 * @module components/world/animation/domains/registeringWorldPlazaAvatarMotionAnimationClips
 */

export type RegisteringWorldPlazaAvatarMotionAnimationClipsParams = {
  readonly characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition;
  readonly textures: DefiningWorldPlazaGirlSampleCharacterTextures;
};

/**
 * Registers directional motion clips for players and NPCs sharing one skin.
 *
 * @param params - Character definition and loaded texture strips.
 */
export function registeringWorldPlazaAvatarMotionAnimationClips(
  params: RegisteringWorldPlazaAvatarMotionAnimationClipsParams
): void {
  const { characterDefinition, textures } = params;
  const walkFrameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    textures.walk,
    characterDefinition.walkSheetLayout
  );
  const runFrameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    textures.run,
    characterDefinition.runSheetLayout
  );
  const jumpFrameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    textures.jump,
    characterDefinition.jumpSheetLayout
  );
  const idleFrameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    textures.idle,
    characterDefinition.idleSheetLayout
  );
  const fallFrameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    textures.jump,
    characterDefinition.fallSheetLayout
  );

  const motionClips = [
    {
      suffix: 'walk',
      frameTextures: walkFrameTextures,
      sheetLayout: characterDefinition.walkSheetLayout,
      fps: characterDefinition.walkAnimationFps,
      playbackMode: 'loop' as const,
    },
    {
      suffix: 'run',
      frameTextures: runFrameTextures,
      sheetLayout: characterDefinition.runSheetLayout,
      fps: characterDefinition.runAnimationFps,
      playbackMode: 'loop' as const,
    },
    {
      suffix: 'jump',
      frameTextures: jumpFrameTextures,
      sheetLayout: characterDefinition.jumpSheetLayout,
      fps: characterDefinition.jumpAnimationFps,
      playbackMode: 'once' as const,
    },
    {
      suffix: 'idle',
      frameTextures: idleFrameTextures,
      sheetLayout: characterDefinition.idleSheetLayout,
      fps: characterDefinition.idleAnimationFps,
      playbackMode: 'loop' as const,
    },
    {
      suffix: 'fall',
      frameTextures: fallFrameTextures,
      sheetLayout: characterDefinition.fallSheetLayout,
      fps: characterDefinition.fallAnimationFps,
      playbackMode: 'once' as const,
    },
  ];

  for (const motionClip of motionClips) {
    registeringWorldPlazaAnimationClip(
      buildingWorldPlazaAnimationClipFromMotionSheet({
        clipId: `${DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX}${characterDefinition.skinId}-${motionClip.suffix}`,
        frameTextures: motionClip.frameTextures,
        sheetLayout: motionClip.sheetLayout,
        fps: motionClip.fps,
        playbackMode: motionClip.playbackMode,
      })
    );
  }
}
