import { buildingWorldPlazaAnimationClipFromFrameList } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromFrameList';
import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { peekingWorldPlazaLavaTileFrameTextures } from '@/components/world/domains/loadingWorldPlazaLavaTileTextures';
import { SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FRAME_DURATION_MS } from '@/components/world/domains/syncingWorldPlazaVisibleLavaOverlayLayer';

/**
 * Registers built-in world animation clips (lava tiles, etc.).
 *
 * Call once during world boot after assets begin preloading.
 *
 * @module components/world/animation/domains/initializingWorldPlazaBuiltinAnimationClips
 */

let didInitializeBuiltinAnimationClips = false;

/**
 * Idempotently registers clips used by terrain overlays and effects.
 */
export function initializingWorldPlazaBuiltinAnimationClips(): void {
  if (didInitializeBuiltinAnimationClips) {
    return;
  }

  didInitializeBuiltinAnimationClips = true;

  registeringWorldPlazaAnimationClip(
    buildingWorldPlazaAnimationClipFromFrameList({
      clipId: DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE,
      resolveFrames: peekingWorldPlazaLavaTileFrameTextures,
      frameDurationMs: SYNCING_WORLD_PLAZA_LAVA_OVERLAY_FRAME_DURATION_MS,
      playbackMode: 'loop',
    })
  );
}

/**
 * Resets built-in clip registration (tests only).
 */
export function resettingWorldPlazaBuiltinAnimationClipsForTests(): void {
  didInitializeBuiltinAnimationClips = false;
}
