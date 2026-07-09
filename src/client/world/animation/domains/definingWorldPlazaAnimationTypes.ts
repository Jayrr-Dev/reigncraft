import type { Texture } from 'pixi.js';

/**
 * Declarative animation clip and playback types for plaza sprites.
 *
 * Describe *what* should play (clip id, variant, loop mode); the engine handles
 * frame timing and texture resolution each tick.
 *
 * @module components/world/animation/domains/definingWorldPlazaAnimationTypes
 */

/** How a clip behaves when it reaches its last frame. */
export type DefiningWorldPlazaAnimationPlaybackMode =
  | 'loop'
  | 'once'
  | 'hold-last'
  | 'ping-pong';

/**
 * Declarative playback request — the public input to the animation engine.
 *
 * Change `clipId` or `variantKey` to switch clips; set `playing: false` to
 * freeze on the current frame.
 */
export type DefiningWorldPlazaAnimationPlaybackRequest = {
  readonly clipId: string;
  readonly variantKey?: string;
  readonly playing?: boolean;
  /**
   * Multiplier on playback cadence. `1` keeps the clip fps; `0.5` plays at half
   * speed. Used so locomotion feet track body speed.
   */
  readonly speedScale?: number;
};

/** Registered clip definition resolved at runtime. */
export type DefiningWorldPlazaAnimationClipDefinition = {
  readonly clipId: string;
  readonly resolveFrames: (
    variantKey: string
  ) => readonly Texture[] | null | undefined;
  readonly fps?: number;
  readonly frameDurationMs?: number;
  readonly playbackMode?: DefiningWorldPlazaAnimationPlaybackMode;
  /**
   * When true, new playbacks start at a random phase so tiled effects (lava,
   * water) do not pulse in perfect sync.
   */
  readonly randomizePhase?: boolean;
};

/** Mutable playback state advanced each frame. */
export type AdvancingWorldPlazaDeclarativeAnimationPlaybackState = {
  clipId: string;
  variantKey: string;
  frameIndex: number;
  elapsedMs: number;
  pingPongDirection: 1 | -1;
  isComplete: boolean;
  phaseOffsetMs: number;
};

/** Snapshot returned to callers after each tick. */
export type ResolvingWorldPlazaDeclarativeAnimationFrame = {
  readonly texture: Texture | null;
  readonly frameIndex: number;
  readonly frameCount: number;
  readonly isComplete: boolean;
};
