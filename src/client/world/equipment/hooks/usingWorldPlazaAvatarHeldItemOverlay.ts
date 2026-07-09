/**
 * Applies held-item overlay updates on the local / remote avatar tick.
 *
 * @module components/world/equipment/hooks/usingWorldPlazaAvatarHeldItemOverlay
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { applyingWorldPlazaHeldItemPresentationToSprite } from '@/components/world/equipment/domains/applyingWorldPlazaHeldItemPresentationToSprite';
import type { DefiningWorldPlazaHeldItemPresentation } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import {
  preloadingWorldPlazaHeldItemSheetTextures,
  resolvingWorldPlazaHeldItemFrameTexture,
} from '@/components/world/equipment/domains/loadingWorldPlazaHeldItemTextures';
import type { Sprite } from 'pixi.js';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

export type UsingWorldPlazaAvatarHeldItemOverlayParams = {
  readonly heldItemSpriteRef: RefObject<Sprite | null>;
  readonly effectiveAvatarSpriteScale: number;
};

export type UsingWorldPlazaAvatarHeldItemOverlayResult = {
  readonly updatingHeldItemOverlay: (
    presentation: DefiningWorldPlazaHeldItemPresentation | null,
    facingDirection: DefiningWorldPlazaGirlSampleWalkDirection
  ) => void;
};

/**
 * Loads framed textures on demand and positions the held-item sprite each frame.
 */
export function usingWorldPlazaAvatarHeldItemOverlay({
  heldItemSpriteRef,
  effectiveAvatarSpriteScale,
}: UsingWorldPlazaAvatarHeldItemOverlayParams): UsingWorldPlazaAvatarHeldItemOverlayResult {
  const loadedFrameKeyRef = useRef<string | null>(null);
  const loadGenerationRef = useRef(0);

  useEffect(() => {
    void preloadingWorldPlazaHeldItemSheetTextures();
  }, []);

  const updatingHeldItemOverlay = useCallback(
    (
      presentation: DefiningWorldPlazaHeldItemPresentation | null,
      facingDirection: DefiningWorldPlazaGirlSampleWalkDirection
    ): void => {
      const sprite = heldItemSpriteRef.current;

      if (!sprite) {
        return;
      }

      if (!presentation) {
        sprite.visible = false;
        loadedFrameKeyRef.current = null;
        return;
      }

      const frameKey = `${presentation.visualId}:${presentation.tier}:${facingDirection}`;

      if (loadedFrameKeyRef.current === frameKey && sprite.visible) {
        applyingWorldPlazaHeldItemPresentationToSprite({
          sprite,
          texture: sprite.texture,
          presentation,
          facingDirection,
          effectiveAvatarSpriteScale,
        });
        return;
      }

      loadedFrameKeyRef.current = frameKey;
      const generation = loadGenerationRef.current + 1;
      loadGenerationRef.current = generation;

      void resolvingWorldPlazaHeldItemFrameTexture(
        presentation,
        facingDirection
      ).then((texture) => {
        if (loadGenerationRef.current !== generation) {
          return;
        }

        const currentSprite = heldItemSpriteRef.current;

        if (!currentSprite) {
          return;
        }

        applyingWorldPlazaHeldItemPresentationToSprite({
          sprite: currentSprite,
          texture,
          presentation,
          facingDirection,
          effectiveAvatarSpriteScale,
        });
      });
    },
    [effectiveAvatarSpriteScale, heldItemSpriteRef]
  );

  return { updatingHeldItemOverlay };
}
