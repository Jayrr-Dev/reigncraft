'use client';

import type { DefiningWorldPlazaAnimationPlaybackRequest } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import { usingWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/hooks/usingWorldPlazaDeclarativeAnimationPlayback';
import type { Sprite } from 'pixi.js';
import { Texture } from 'pixi.js';
import { useCallback, useRef } from 'react';

/**
 * Declarative Pixi sprite bound to one registered animation clip.
 *
 * Describe playback with `clipId` (and optional `variantKey`); the engine
 * resolves frames and advances timing each tick.
 *
 * @example
 * ```tsx
 * <RenderingWorldPlazaDeclarativeAnimatedSprite
 *   playback={{ clipId: 'lava-tile' }}
 *   anchor={{ x: 0.5, y: 0.5 }}
 *   position={{ x: centerX, y: centerY }}
 *   width={64}
 *   height={32}
 * />
 * ```
 *
 * @module components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite
 */

export type RenderingWorldPlazaDeclarativeAnimatedSpriteProps = {
  readonly playback: DefiningWorldPlazaAnimationPlaybackRequest;
  readonly position?: { readonly x: number; readonly y: number };
  readonly anchor?: { readonly x: number; readonly y: number };
  readonly scale?: number;
  readonly width?: number;
  readonly height?: number;
  readonly zIndex?: number;
  readonly visible?: boolean;
  readonly alpha?: number;
};

export function RenderingWorldPlazaDeclarativeAnimatedSprite({
  playback,
  position,
  anchor = { x: 0.5, y: 1 },
  scale,
  width,
  height,
  zIndex,
  visible = true,
  alpha = 1,
}: RenderingWorldPlazaDeclarativeAnimatedSpriteProps): React.JSX.Element {
  const spriteRef = useRef<Sprite | null>(null);

  usingWorldPlazaDeclarativeAnimationPlayback(playback, spriteRef);

  const attachingSprite = useCallback(
    (sprite: Sprite | null) => {
      spriteRef.current = sprite;

      if (!sprite) {
        return;
      }

      sprite.eventMode = 'none';
      sprite.anchor.set(anchor.x, anchor.y);
      sprite.texture = Texture.EMPTY;

      if (position) {
        sprite.position.set(position.x, position.y);
      }

      if (scale !== undefined) {
        sprite.scale.set(scale);
      }

      if (width !== undefined) {
        sprite.width = width;
      }

      if (height !== undefined) {
        sprite.height = height;
      }

      if (zIndex !== undefined) {
        sprite.zIndex = zIndex;
      }

      sprite.visible = visible;
      sprite.alpha = alpha;
    },
    [alpha, anchor.x, anchor.y, height, position, scale, visible, width, zIndex]
  );

  return <pixiSprite ref={attachingSprite} />;
}
