'use client';

import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_CHARACTER_SWITCH_EFFECT } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAvatarCharacterSwitchEffectAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAvatarCharacterSwitchEffectAnimationClip';
import { usingWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/hooks/usingWorldPlazaDeclarativeAnimationPlayback';
import {
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_X_NORMALIZED,
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_Y_NORMALIZED,
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_GROUND_NUDGE_Y_PX,
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SPRITE_SCALE,
  DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_Z_INDEX,
} from '@/components/world/domains/definingWorldPlazaAvatarCharacterSwitchEffectConstants';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { loadingWorldPlazaAvatarCharacterSwitchEffectTextures } from '@/components/world/domains/loadingWorldPlazaAvatarCharacterSwitchEffectTextures';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { Texture, type Sprite } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type RenderingWorldPlazaAvatarCharacterSwitchEffectProps = {
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  /** Painted feet below the avatar grid anchor (world-local px, scaled). */
  readonly footOffsetBelowGridAnchorPx: number;
};

/**
 * Plays Buff1 once when the local avatar skin id changes (not on first mount).
 */
export function RenderingWorldPlazaAvatarCharacterSwitchEffect({
  skinId,
  footOffsetBelowGridAnchorPx,
}: RenderingWorldPlazaAvatarCharacterSwitchEffectProps): React.JSX.Element {
  const effectOffsetYPx =
    footOffsetBelowGridAnchorPx +
    DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_GROUND_NUDGE_Y_PX;
  const spriteRef = useRef<Sprite | null>(null);
  const previousSkinIdRef = useRef(skinId);
  const hasMountedSkinRef = useRef(false);
  const isActiveRef = useRef(false);
  const [playToken, setPlayToken] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void loadingWorldPlazaAvatarCharacterSwitchEffectTextures()
      .then(() => {
        if (cancelled) {
          return;
        }

        registeringWorldPlazaAvatarCharacterSwitchEffectAnimationClip();
        setTexturesReady(true);
      })
      .catch(() => {
        // Switch VFX is optional; character swap still works without it.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasMountedSkinRef.current) {
      hasMountedSkinRef.current = true;
      previousSkinIdRef.current = skinId;
      return;
    }

    if (previousSkinIdRef.current === skinId) {
      return;
    }

    previousSkinIdRef.current = skinId;
    isActiveRef.current = true;
    setPlayToken((token) => token + 1);
    setIsActive(true);
  }, [skinId]);

  const playback = useMemo(
    () => ({
      clipId:
        DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_CHARACTER_SWITCH_EFFECT,
      playing: isActive && texturesReady,
      // Forces a fresh once-playback when the same clip replays.
      variantKey: `play-${playToken}`,
    }),
    [isActive, playToken, texturesReady]
  );

  const { playbackStateRef, currentFrameRef } =
    usingWorldPlazaDeclarativeAnimationPlayback(playback, spriteRef);

  useEffect(() => {
    playbackStateRef.current = null;
  }, [playToken, playbackStateRef]);

  const attachingSprite = useCallback(
    (sprite: Sprite | null) => {
      spriteRef.current = sprite;

      if (!sprite) {
        return;
      }

      sprite.eventMode = 'none';
      sprite.anchor.set(
        DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_X_NORMALIZED,
        DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_ANCHOR_Y_NORMALIZED
      );
      sprite.scale.set(
        DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_SPRITE_SCALE
      );
      sprite.position.set(0, effectOffsetYPx);
      sprite.zIndex =
        DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_Z_INDEX;
      sprite.texture = Texture.EMPTY;
      sprite.visible = false;
    },
    [effectOffsetYPx]
  );

  usingWorldPlazaSafeTick(() => {
    const sprite = spriteRef.current;

    if (!sprite) {
      return;
    }

    sprite.position.set(0, effectOffsetYPx);

    if (!isActiveRef.current || !texturesReady) {
      if (sprite.visible) {
        sprite.visible = false;
      }

      if (sprite.texture !== Texture.EMPTY) {
        sprite.texture = Texture.EMPTY;
      }

      return;
    }

    if (currentFrameRef.current.isComplete) {
      isActiveRef.current = false;
      setIsActive(false);
      sprite.visible = false;
      sprite.texture = Texture.EMPTY;
      return;
    }

    if (!sprite.visible) {
      sprite.visible = true;
    }
  }, 'tick:avatar-character-switch-effect');

  return <pixiSprite ref={attachingSprite} />;
}
