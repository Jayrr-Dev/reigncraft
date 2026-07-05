import {
  formattingWorldPlazaAvatarMotionClipId,
  type DefiningWorldPlazaAvatarMotionClipSuffix,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import {
  applyingWorldPlazaDeclarativeAnimationFrameToSprite,
  resolvingWorldPlazaDeclarativeAnimationFrameAtIndex,
} from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { Sprite } from 'pixi.js';

/**
 * Applies one avatar motion frame through the declarative clip registry.
 *
 * @module components/world/animation/domains/applyingWorldPlazaDeclarativeAvatarMotionToSprite
 */

export type ApplyingWorldPlazaDeclarativeAvatarMotionToSpriteParams = {
  readonly sprite: Sprite | null;
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  readonly motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix;
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly frameIndex: number;
};

/**
 * Resolves and applies a directional avatar clip frame to one sprite.
 *
 * @param params - Skin, motion suffix, facing direction, and frame index.
 */
export function applyingWorldPlazaDeclarativeAvatarMotionToSprite(
  params: ApplyingWorldPlazaDeclarativeAvatarMotionToSpriteParams
): void {
  const clipId = formattingWorldPlazaAvatarMotionClipId(
    params.skinId,
    params.motionSuffix
  );
  const clip = resolvingWorldPlazaAnimationClip(clipId);

  if (!clip) {
    return;
  }

  const frame = resolvingWorldPlazaDeclarativeAnimationFrameAtIndex(
    clip,
    params.direction,
    params.frameIndex
  );

  applyingWorldPlazaDeclarativeAnimationFrameToSprite(params.sprite, frame);
}
