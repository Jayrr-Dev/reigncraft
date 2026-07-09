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
import type { Sprite, Texture } from 'pixi.js';

export type ApplyingWorldPlazaHeldItemPresentationToSpriteParams = {
  readonly sprite: Sprite;
  readonly texture: Texture;
  readonly presentation: DefiningWorldPlazaHeldItemPresentation;
  readonly facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly effectiveAvatarSpriteScale: number;
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
    (entry.offsetScreenPxX + directionPose.offsetAvatarFramePxX) *
      effectiveAvatarSpriteScale,
    (entry.offsetScreenPxY + directionPose.offsetAvatarFramePxY) *
      effectiveAvatarSpriteScale
  );
  sprite.visible = true;
  sprite.zIndex = directionPose.behindAvatar
    ? -entry.zIndexOffset
    : entry.zIndexOffset;
  sprite.rotation = directionPose.rotationRadians;
  sprite.label = `held-item:${presentation.visualId}:${facingDirection}`;
}
