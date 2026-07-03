import { DEFINING_WORLD_PLAZA_ICE_SLIDE_FALLBACK_RUN_FRAME_INDEX } from "@/components/world/domains/definingWorldPlazaIceSlideConstants";

/**
 * Resolves the run strip frame to hold during the post-run ice slide.
 *
 * @module components/world/domains/resolvingWorldPlazaIceSlideFrozenRunFrameIndex
 */

/**
 * Normalizes a run animation time value into a valid strip frame index.
 *
 * @param animationTime - Accumulated run animation time in frames.
 * @param runFrameCount - Total frames in the run strip.
 */
export function resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
  animationTime: number,
  runFrameCount: number,
): number {
  if (runFrameCount <= 0) {
    return DEFINING_WORLD_PLAZA_ICE_SLIDE_FALLBACK_RUN_FRAME_INDEX;
  }

  const capturedRunFrameIndex = Math.floor(animationTime);

  return (
    ((capturedRunFrameIndex % runFrameCount) + runFrameCount) % runFrameCount
  );
}
