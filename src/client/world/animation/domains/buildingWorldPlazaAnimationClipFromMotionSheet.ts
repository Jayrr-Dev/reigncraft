import type { DefiningWorldPlazaAnimationClipDefinition } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import { resolvingWorldPlazaGirlSampleMotionFrameTexture } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { Texture } from 'pixi.js';

/**
 * Builds directional motion clips for avatar walk/run/jump sheets.
 *
 * @module components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet
 */

export type BuildingWorldPlazaAnimationClipFromMotionSheetParams = {
  readonly clipId: string;
  readonly frameTextures: Map<string, Texture>;
  readonly sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly fps: number;
  readonly playbackMode?: DefiningWorldPlazaAnimationClipDefinition['playbackMode'];
};

function checkingWorldPlazaGirlSampleWalkDirection(
  variantKey: string
): variantKey is DefiningWorldPlazaGirlSampleWalkDirection {
  return (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS as readonly string[]
  ).includes(variantKey);
}

/**
 * Creates a clip whose `variantKey` is the motion direction (e.g. `south`).
 *
 * Frame textures are resolved through the existing GirlSample motion helpers so
 * avatar components can migrate incrementally.
 *
 * @param params - Clip id, texture map, sheet layout, and fps.
 */
export function buildingWorldPlazaAnimationClipFromMotionSheet(
  params: BuildingWorldPlazaAnimationClipFromMotionSheetParams
): DefiningWorldPlazaAnimationClipDefinition {
  return {
    clipId: params.clipId,
    fps: params.fps,
    playbackMode: params.playbackMode ?? 'loop',
    resolveFrames: (variantKey) => {
      if (!checkingWorldPlazaGirlSampleWalkDirection(variantKey)) {
        return null;
      }

      const frames: Texture[] = [];

      for (
        let frameIndex = 0;
        frameIndex < params.sheetLayout.frameCount;
        frameIndex += 1
      ) {
        frames.push(
          resolvingWorldPlazaGirlSampleMotionFrameTexture(
            params.frameTextures,
            variantKey,
            frameIndex,
            params.sheetLayout
          )
        );
      }

      return frames;
    },
  };
}
