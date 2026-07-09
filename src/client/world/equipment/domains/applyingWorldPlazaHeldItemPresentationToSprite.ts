/**
 * Applies a held-item frame texture and layout to a Pixi sprite.
 *
 * @module components/world/equipment/domains/applyingWorldPlazaHeldItemPresentationToSprite
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaHeldItemPresentation } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
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
  const scale = effectiveAvatarSpriteScale * entry.scaleMultiplier;

  sprite.texture = texture;
  sprite.anchor.set(entry.anchorX, entry.anchorY);
  sprite.scale.set(scale);
  sprite.position.set(
    entry.offsetScreenPxX * effectiveAvatarSpriteScale,
    entry.offsetScreenPxY * effectiveAvatarSpriteScale
  );
  sprite.visible = true;
  sprite.zIndex = entry.zIndexOffset;
  sprite.rotation = 0;
  sprite.label = `held-item:${presentation.visualId}:${facingDirection}`;
}
