'use client';

import { RenderingWorldPlazaDeclarativeAnimatedSprite } from '@/components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite';
import type { DefiningWorldPlazaAnimationPlaybackRequest } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';

/**
 * Minimal NPC / prop sprite: clip id, facing variant, and world position.
 *
 * @module components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedNpc
 */

export type RenderingWorldPlazaDeclarativeAnimatedNpcProps = {
  readonly clipId: string;
  readonly variantKey: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly anchor?: { readonly x: number; readonly y: number };
  readonly scale?: number;
  readonly zIndex?: number;
  readonly visible?: boolean;
  readonly playing?: boolean;
};

/**
 * Renders one declarative animated entity (NPC, critter, idle prop).
 *
 * @example
 * ```tsx
 * <RenderingWorldPlazaDeclarativeAnimatedNpc
 *   clipId="avatar-motion-husky-idle"
 *   variantKey="Down"
 *   position={{ x: screenX, y: screenY }}
 *   scale={1.1}
 * />
 * ```
 */
export function RenderingWorldPlazaDeclarativeAnimatedNpc({
  clipId,
  variantKey,
  position,
  anchor,
  scale,
  zIndex,
  visible,
  playing = true,
}: RenderingWorldPlazaDeclarativeAnimatedNpcProps): React.JSX.Element {
  const playback: DefiningWorldPlazaAnimationPlaybackRequest = {
    clipId,
    variantKey,
    playing,
  };

  return (
    <RenderingWorldPlazaDeclarativeAnimatedSprite
      playback={playback}
      position={position}
      anchor={anchor}
      scale={scale}
      zIndex={zIndex}
      visible={visible}
    />
  );
}
