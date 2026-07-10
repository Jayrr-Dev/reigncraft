/**
 * Applies a held-item frame texture and layout to a Pixi sprite.
 *
 * @module components/world/equipment/domains/applyingWorldPlazaHeldItemPresentationToSprite
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_POSE,
  type DefiningWorldPlazaHeldItemPresentation,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import type { ComputingWorldPlazaHeldItemSwingPose } from '@/components/world/equipment/domains/computingWorldPlazaHeldItemSwingPose';
import type { Sprite, Texture } from 'pixi.js';

export type ApplyingWorldPlazaHeldItemPresentationToSpriteParams = {
  readonly sprite: Sprite;
  readonly texture: Texture;
  readonly presentation: DefiningWorldPlazaHeldItemPresentation;
  readonly facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly effectiveAvatarSpriteScale: number;
  /** Live swing sample; null keeps the static carry pose. */
  readonly swingPose?: ComputingWorldPlazaHeldItemSwingPose | null;
};

/**
 * Positions and scales the held-item overlay relative to the avatar anchor.
 */
export function applyingWorldPlazaHeldItemPresentationToSprite({
  sprite,
  texture,
  presentation,
  facingDirection,
  effectiveAvatarSpriteScale,
  swingPose = null,
}: ApplyingWorldPlazaHeldItemPresentationToSpriteParams): void {
  const { entry } = presentation;
  const directionPose =
    DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_POSE[facingDirection];
  const scale = effectiveAvatarSpriteScale * entry.scaleMultiplier;

  texture.source.scaleMode = 'nearest';
  sprite.texture = texture;
  sprite.anchor.set(entry.anchorX, entry.anchorY);
  sprite.scale.set(scale);
  sprite.position.set(
    (entry.offsetScreenPxX +
      directionPose.offsetAvatarFramePxX +
      (swingPose?.driftAvatarFramePxX ?? 0)) *
      effectiveAvatarSpriteScale,
    (entry.offsetScreenPxY +
      directionPose.offsetAvatarFramePxY +
      (swingPose?.driftAvatarFramePxY ?? 0)) *
      effectiveAvatarSpriteScale
  );
  sprite.visible = true;
  sprite.zIndex = directionPose.behindAvatar
    ? -entry.zIndexOffset
    : entry.zIndexOffset;
  sprite.rotation =
    directionPose.rotationRadians + (swingPose?.rotationOffsetRadians ?? 0);
  sprite.label = `held-item:${presentation.visualId}:${facingDirection}`;
}
