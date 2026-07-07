import { applyingWorldPlazaDeclarativeAvatarMotionToSprite } from '@/components/world/animation/domains/applyingWorldPlazaDeclarativeAvatarMotionToSprite';
import {
  formattingWorldPlazaAvatarMotionClipId,
  type DefiningWorldPlazaAvatarMotionClipSuffix,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_AVATAR_MOTION_FALLBACK_SUFFIXES: readonly DefiningWorldPlazaAvatarMotionClipSuffix[] =
  ['idle', 'walk'];

export type ApplyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallbackParams =
  {
    readonly sprite: Parameters<
      typeof applyingWorldPlazaDeclarativeAvatarMotionToSprite
    >[0]['sprite'];
    readonly skinId: DefiningWorldPlazaAvatarSkinId;
    readonly motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix;
    readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
    readonly frameIndex: number;
  };

/**
 * Applies a motion clip, falling back to idle or walk when the clip is missing.
 *
 * Prevents stale combat textures from sticking when clips fail to register.
 */
export function applyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallback(
  params: ApplyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallbackParams
): void {
  const requestedClipId = formattingWorldPlazaAvatarMotionClipId(
    params.skinId,
    params.motionSuffix
  );

  if (resolvingWorldPlazaAnimationClip(requestedClipId)) {
    applyingWorldPlazaDeclarativeAvatarMotionToSprite(params);
    return;
  }

  for (const fallbackSuffix of DEFINING_WORLD_PLAZA_GIRL_SAMPLE_AVATAR_MOTION_FALLBACK_SUFFIXES) {
    const fallbackClipId = formattingWorldPlazaAvatarMotionClipId(
      params.skinId,
      fallbackSuffix
    );

    if (!resolvingWorldPlazaAnimationClip(fallbackClipId)) {
      continue;
    }

    applyingWorldPlazaDeclarativeAvatarMotionToSprite({
      ...params,
      motionSuffix: fallbackSuffix,
      frameIndex: 0,
    });
    return;
  }
}
