'use client';

import type { DefiningWorldPlazaAnimationPlaybackRequest } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import { usingWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/hooks/usingWorldPlazaDeclarativeAnimationPlayback';
import type { Sprite } from 'pixi.js';
import { Texture } from 'pixi.js';
import { useCallback, useLayoutEffect, useRef } from 'react';

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
  /** Pixi multiply tint (`0xffffff` = none). */
  readonly tint?: number;
  /**
   * `shared` opts into the wildlife shared animation registry so one parent
   * tick advances many sprites. Default `self` keeps a per-sprite `useTick`.
   */
  readonly tickMode?: 'self' | 'shared';
  readonly externalSpriteRef?: React.MutableRefObject<Sprite | null>;
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
  tint = 0xffffff,
  tickMode = 'self',
  externalSpriteRef,
}: RenderingWorldPlazaDeclarativeAnimatedSpriteProps): React.JSX.Element {
  const spriteRef = useRef<Sprite | null>(null);

  const { applyToSprite } = usingWorldPlazaDeclarativeAnimationPlayback(
    playback,
    spriteRef,
    tickMode
  );
  const positionX = position?.x;
  const positionY = position?.y;

  const attachingSprite = useCallback(
    (sprite: Sprite | null) => {
      spriteRef.current = sprite;

      if (externalSpriteRef) {
        externalSpriteRef.current = sprite;
      }

      if (!sprite) {
        if (externalSpriteRef) {
          externalSpriteRef.current = null;
        }
        return;
      }

      sprite.eventMode = 'none';
      sprite.texture = Texture.EMPTY;
      applyToSprite(sprite);
    },
    [applyToSprite, externalSpriteRef]
  );

  useLayoutEffect(() => {
    const sprite = spriteRef.current;

    if (!sprite) {
      return;
    }

    sprite.anchor.set(anchor.x, anchor.y);

    if (positionX !== undefined && positionY !== undefined) {
      sprite.position.set(positionX, positionY);
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
    sprite.tint = tint;
  }, [
    alpha,
    anchor.x,
    anchor.y,
    height,
    positionX,
    positionY,
    scale,
    tint,
    visible,
    width,
    zIndex,
  ]);

  return <pixiSprite ref={attachingSprite} />;
}
