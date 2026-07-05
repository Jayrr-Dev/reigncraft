import type { DefiningWorldPlazaAnimationClipDefinition } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import type { Texture } from 'pixi.js';

/**
 * Builds a clip definition from a horizontal sprite strip or a static frame list.
 *
 * @module components/world/animation/domains/buildingWorldPlazaAnimationClipFromFrameList
 */

export type BuildingWorldPlazaAnimationClipFromFrameListParams = {
  readonly clipId: string;
  readonly resolveFrames: () => readonly Texture[] | null | undefined;
  readonly fps?: number;
  readonly frameDurationMs?: number;
  readonly playbackMode?: DefiningWorldPlazaAnimationClipDefinition['playbackMode'];
  readonly randomizePhase?: boolean;
};

/**
 * Registers a clip backed by a pre-sliced frame list (lava, fire, etc.).
 *
 * @param params - Clip id, frame resolver, and timing.
 */
export function buildingWorldPlazaAnimationClipFromFrameList(
  params: BuildingWorldPlazaAnimationClipFromFrameListParams
): DefiningWorldPlazaAnimationClipDefinition {
  return {
    clipId: params.clipId,
    resolveFrames: () => params.resolveFrames() ?? null,
    fps: params.fps,
    frameDurationMs: params.frameDurationMs,
    playbackMode: params.playbackMode,
    randomizePhase: params.randomizePhase,
  };
}
