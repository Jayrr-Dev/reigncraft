import {
  advancingWorldPlazaDeclarativeAnimationPlayback,
  creatingWorldPlazaDeclarativeAnimationPlaybackState,
} from '@/components/world/animation/domains/advancingWorldPlazaDeclarativeAnimationPlayback';
import type {
  AdvancingWorldPlazaDeclarativeAnimationPlaybackState,
  DefiningWorldPlazaAnimationPlaybackRequest,
  ResolvingWorldPlazaDeclarativeAnimationFrame,
} from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import { registeringWorldPlazaDeclarativeAnimationPlaybackEntry } from '@/components/world/animation/domains/managingWorldPlazaDeclarativeAnimationPlaybackRegistry';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import {
  applyingWorldPlazaDeclarativeAnimationFrameToSprite,
  resolvingWorldPlazaDeclarativeAnimationFrame,
} from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import { useTick } from '@pixi/react';
import { Texture, type Sprite } from 'pixi.js';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

/**
 * Imperative hook for declarative animation playback on one Pixi sprite.
 *
 * @module components/world/animation/hooks/usingWorldPlazaDeclarativeAnimationPlayback
 */

export type UsingWorldPlazaDeclarativeAnimationTickMode = 'self' | 'shared';

export type UsingWorldPlazaDeclarativeAnimationPlaybackResult = {
  readonly playbackStateRef: RefObject<AdvancingWorldPlazaDeclarativeAnimationPlaybackState | null>;
  readonly currentFrameRef: RefObject<ResolvingWorldPlazaDeclarativeAnimationFrame>;
  readonly advancePlayback: (deltaMs: number, nowMs?: number) => void;
  readonly applyToSprite: (sprite: Sprite | null) => void;
};

/**
 * Drives one declarative clip on a sprite ref each Pixi tick.
 *
 * @param playback - Declarative clip request (`clipId`, optional `variantKey`).
 * @param spriteRef - Pixi sprite to update (optional when applying manually).
 * @param tickMode - `self` uses a per-sprite `useTick`; `shared` registers with
 *   the shared wildlife animation registry instead.
 */
export function usingWorldPlazaDeclarativeAnimationPlayback(
  playback: DefiningWorldPlazaAnimationPlaybackRequest,
  spriteRef?: RefObject<Sprite | null>,
  tickMode: UsingWorldPlazaDeclarativeAnimationTickMode = 'self'
): UsingWorldPlazaDeclarativeAnimationPlaybackResult {
  const playbackStateRef =
    useRef<AdvancingWorldPlazaDeclarativeAnimationPlaybackState | null>(null);
  const currentFrameRef = useRef<ResolvingWorldPlazaDeclarativeAnimationFrame>({
    texture: null,
    frameIndex: 0,
    frameCount: 0,
    isComplete: false,
  });
  const playbackRef = useRef(playback);
  playbackRef.current = playback;

  const advancePlayback = useCallback(
    (deltaMs: number, nowMs = 0) => {
      const clip = resolvingWorldPlazaAnimationClip(playbackRef.current.clipId);

      if (!clip) {
        if (spriteRef?.current && spriteRef.current.texture !== Texture.EMPTY) {
          spriteRef.current.texture = Texture.EMPTY;
        }

        return;
      }

      const previousState =
        playbackStateRef.current ??
        creatingWorldPlazaDeclarativeAnimationPlaybackState(
          playbackRef.current,
          clip,
          nowMs
        );
      const nextState = advancingWorldPlazaDeclarativeAnimationPlayback({
        state: previousState,
        request: playbackRef.current,
        clip,
        deltaMs,
        nowMs,
      });
      const frame = resolvingWorldPlazaDeclarativeAnimationFrame(
        nextState,
        clip
      );

      playbackStateRef.current = nextState;
      currentFrameRef.current = frame;

      if (spriteRef?.current) {
        applyingWorldPlazaDeclarativeAnimationFrameToSprite(
          spriteRef.current,
          frame
        );
      }
    },
    [spriteRef]
  );

  const applyToSprite = useCallback((sprite: Sprite | null) => {
    applyingWorldPlazaDeclarativeAnimationFrameToSprite(
      sprite,
      currentFrameRef.current
    );
  }, []);

  useEffect(() => {
    if (tickMode !== 'shared') {
      return;
    }

    return registeringWorldPlazaDeclarativeAnimationPlaybackEntry({
      advancePlayback: (deltaMs, nowMs) => {
        advancePlayback(deltaMs, nowMs);
      },
    });
  }, [advancePlayback, tickMode]);

  useTick((ticker) => {
    if (tickMode !== 'self') {
      return;
    }

    advancePlayback(ticker.deltaMS, performance.now());
  });

  return {
    playbackStateRef,
    currentFrameRef,
    advancePlayback,
    applyToSprite,
  };
}
