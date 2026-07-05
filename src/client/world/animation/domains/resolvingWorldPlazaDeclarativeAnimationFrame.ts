import {
  advancingWorldPlazaDeclarativeAnimationPlayback,
  creatingWorldPlazaDeclarativeAnimationPlaybackState,
} from '@/components/world/animation/domains/advancingWorldPlazaDeclarativeAnimationPlayback';
import type {
  AdvancingWorldPlazaDeclarativeAnimationPlaybackState,
  DefiningWorldPlazaAnimationClipDefinition,
  DefiningWorldPlazaAnimationPlaybackRequest,
  ResolvingWorldPlazaDeclarativeAnimationFrame,
} from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import type { Sprite } from 'pixi.js';

/**
 * Resolves the active frame texture for the current playback state.
 *
 * @module components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame
 */

/**
 * Returns the texture that should be visible for the current playback state.
 *
 * @param state - Advanced playback state.
 * @param clip - Registered clip definition.
 */
export function resolvingWorldPlazaDeclarativeAnimationFrame(
  state: AdvancingWorldPlazaDeclarativeAnimationPlaybackState,
  clip: DefiningWorldPlazaAnimationClipDefinition
): ResolvingWorldPlazaDeclarativeAnimationFrame {
  return resolvingWorldPlazaDeclarativeAnimationFrameAtIndex(
    clip,
    state.variantKey,
    state.frameIndex
  );
}

/**
 * Resolves one frame directly from clip, variant, and index (avatar jumps, etc.).
 *
 * @param clip - Registered clip definition.
 * @param variantKey - Direction or tier key.
 * @param frameIndex - Zero-based frame index inside the variant strip.
 */
export function resolvingWorldPlazaDeclarativeAnimationFrameAtIndex(
  clip: DefiningWorldPlazaAnimationClipDefinition,
  variantKey: string,
  frameIndex: number
): ResolvingWorldPlazaDeclarativeAnimationFrame {
  const frames = clip.resolveFrames(variantKey) ?? [];
  const frameCount = frames.length;

  if (frameCount === 0) {
    return {
      texture: null,
      frameIndex: 0,
      frameCount: 0,
      isComplete: false,
    };
  }

  const clampedIndex = ((frameIndex % frameCount) + frameCount) % frameCount;
  const texture = frames[clampedIndex] ?? null;

  return {
    texture,
    frameIndex: clampedIndex,
    frameCount,
    isComplete: false,
  };
}

/**
 * Applies the resolved frame texture to one Pixi sprite.
 *
 * @param sprite - Target sprite (no-op when null).
 * @param frame - Resolved animation frame.
 */
export function applyingWorldPlazaDeclarativeAnimationFrameToSprite(
  sprite: Sprite | null,
  frame: ResolvingWorldPlazaDeclarativeAnimationFrame
): void {
  if (!sprite || !frame.texture) {
    return;
  }

  if (sprite.texture !== frame.texture) {
    sprite.texture = frame.texture;
  }
}

/**
 * Applies the same frame texture to many sprites (tiled lava, etc.).
 *
 * @param sprites - Sprites sharing one synchronized clip.
 * @param frame - Resolved animation frame.
 */
export function applyingWorldPlazaDeclarativeAnimationFrameToSprites(
  sprites: readonly Sprite[],
  frame: ResolvingWorldPlazaDeclarativeAnimationFrame
): void {
  if (!frame.texture) {
    return;
  }

  for (const sprite of sprites) {
    if (sprite.texture !== frame.texture) {
      sprite.texture = frame.texture;
    }
  }
}

export type AdvancingWorldPlazaDeclarativeAnimationPlaybackForSpritesInput = {
  readonly state: AdvancingWorldPlazaDeclarativeAnimationPlaybackState;
  readonly request: DefiningWorldPlazaAnimationPlaybackRequest;
  readonly clip: DefiningWorldPlazaAnimationClipDefinition;
  readonly sprites: readonly Sprite[];
  readonly deltaMs: number;
  readonly nowMs?: number;
};

/**
 * Advances playback and writes the new frame to every sprite in one call.
 *
 * @param input - Playback state, request, clip, sprites, and timing.
 */
export function advancingWorldPlazaDeclarativeAnimationPlaybackForSprites(
  input: AdvancingWorldPlazaDeclarativeAnimationPlaybackForSpritesInput
): AdvancingWorldPlazaDeclarativeAnimationPlaybackState {
  const nextState = advancingWorldPlazaDeclarativeAnimationPlayback({
    state: input.state,
    request: input.request,
    clip: input.clip,
    deltaMs: input.deltaMs,
    nowMs: input.nowMs,
  });
  const frame = resolvingWorldPlazaDeclarativeAnimationFrame(
    nextState,
    input.clip
  );

  applyingWorldPlazaDeclarativeAnimationFrameToSprites(input.sprites, frame);

  return nextState;
}

/**
 * Creates playback state and applies the first frame immediately.
 *
 * @param request - Declarative playback request.
 * @param clip - Registered clip definition.
 * @param sprites - Sprites to initialize.
 * @param nowMs - Monotonic clock for phase randomization.
 */
export function initializingWorldPlazaDeclarativeAnimationPlaybackForSprites(
  request: DefiningWorldPlazaAnimationPlaybackRequest,
  clip: DefiningWorldPlazaAnimationClipDefinition,
  sprites: readonly Sprite[],
  nowMs = 0
): AdvancingWorldPlazaDeclarativeAnimationPlaybackState {
  const initialState = creatingWorldPlazaDeclarativeAnimationPlaybackState(
    request,
    clip,
    nowMs
  );
  const frame = resolvingWorldPlazaDeclarativeAnimationFrame(
    initialState,
    clip
  );

  applyingWorldPlazaDeclarativeAnimationFrameToSprites(sprites, frame);

  return initialState;
}

/**
 * Resolves one frame texture directly from a request without mutable state.
 *
 * Useful for global clocks (lava overlay previously keyed off `performance.now()`).
 *
 * @param request - Declarative playback request.
 * @param clip - Registered clip definition.
 * @param animationTimeMs - Monotonic animation clock in milliseconds.
 */
export function resolvingWorldPlazaDeclarativeAnimationFrameAtTime(
  request: DefiningWorldPlazaAnimationPlaybackRequest,
  clip: DefiningWorldPlazaAnimationClipDefinition,
  animationTimeMs: number
): ResolvingWorldPlazaDeclarativeAnimationFrame {
  const frames = clip.resolveFrames(request.variantKey ?? '') ?? [];
  const frameCount = frames.length;

  if (frameCount === 0) {
    return {
      texture: null,
      frameIndex: 0,
      frameCount: 0,
      isComplete: false,
    };
  }

  const frameDurationMs =
    clip.frameDurationMs && clip.frameDurationMs > 0
      ? clip.frameDurationMs
      : clip.fps && clip.fps > 0
        ? 1000 / clip.fps
        : 1000 / 8;
  const playbackMode = clip.playbackMode ?? 'loop';
  let frameIndex = 0;

  if (playbackMode === 'loop' || playbackMode === 'ping-pong') {
    const cycleIndex = Math.floor(animationTimeMs / frameDurationMs);

    if (playbackMode === 'ping-pong') {
      const pingPongLength = Math.max(1, frameCount * 2 - 2);
      const pingPongIndex = cycleIndex % pingPongLength;

      if (pingPongIndex < frameCount) {
        frameIndex = pingPongIndex;
      } else {
        frameIndex = pingPongLength - pingPongIndex;
      }
    } else {
      frameIndex = cycleIndex % frameCount;
    }
  } else {
    frameIndex = Math.min(
      frameCount - 1,
      Math.floor(animationTimeMs / frameDurationMs)
    );
  }

  const texture = frames[frameIndex] ?? null;

  return {
    texture,
    frameIndex,
    frameCount,
    isComplete: playbackMode === 'once' && frameIndex >= frameCount - 1,
  };
}

/**
 * Applies a time-based frame to many sprites.
 */
export function applyingWorldPlazaDeclarativeAnimationFrameAtTimeToSprites(
  request: DefiningWorldPlazaAnimationPlaybackRequest,
  clip: DefiningWorldPlazaAnimationClipDefinition,
  sprites: readonly Sprite[],
  animationTimeMs: number
): ResolvingWorldPlazaDeclarativeAnimationFrame {
  const frame = resolvingWorldPlazaDeclarativeAnimationFrameAtTime(
    request,
    clip,
    animationTimeMs
  );

  applyingWorldPlazaDeclarativeAnimationFrameToSprites(sprites, frame);

  return frame;
}
