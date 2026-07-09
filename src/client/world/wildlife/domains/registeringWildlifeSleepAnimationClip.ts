/**
 * Registers a static sleep clip sampled from each species die sheet.
 *
 * @module components/world/wildlife/domains/registeringWildlifeSleepAnimationClip
 */

import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import {
  creatingWorldPlazaGirlSampleMotionFrameTextures,
  resolvingWorldPlazaGirlSampleMotionFrameTexture,
} from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { resolvingWildlifeSleepDieFrameIndex } from '@/components/world/wildlife/domains/definingWildlifeSleepPresentationConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_MOTION_FPS,
  definingWildlifeMotionSheetLayout,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeMotionSheet } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { formattingWildlifeAnimationClipId } from '@/components/world/wildlife/domains/registeringWildlifeAnimationClips';

function checkingWorldPlazaGirlSampleWalkDirection(
  variantKey: string
): variantKey is DefiningWorldPlazaGirlSampleWalkDirection {
  return (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DIRECTIONS as readonly string[]
  ).includes(variantKey);
}

/**
 * Builds a one-frame loop clip from the prone pose at the end of the die sheet.
 */
export function registeringWildlifeSleepAnimationClip(
  species: DefiningWildlifeSpeciesDefinition,
  dieSheet: DefiningWildlifeMotionSheet
): void {
  const sheetLayout = definingWildlifeMotionSheetLayout(
    dieSheet.frameWidthPx,
    dieSheet.frameHeightPx
  );
  const frameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
    dieSheet.directionTextures,
    sheetLayout
  );

  registeringWorldPlazaAnimationClip({
    clipId: formattingWildlifeAnimationClipId(species.speciesId, 'sleep'),
    fps: DEFINING_WILDLIFE_MOTION_FPS.sleep,
    playbackMode: 'loop',
    resolveFrames: (variantKey) => {
      if (!checkingWorldPlazaGirlSampleWalkDirection(variantKey)) {
        return null;
      }

      return [
        resolvingWorldPlazaGirlSampleMotionFrameTexture(
          frameTextures,
          variantKey,
          resolvingWildlifeSleepDieFrameIndex(species.speciesId),
          sheetLayout
        ),
      ];
    },
  });
}
