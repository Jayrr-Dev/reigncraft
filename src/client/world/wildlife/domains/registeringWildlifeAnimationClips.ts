/**
 * Registers declarative animation clips for one wildlife species.
 *
 * @module components/world/wildlife/domains/registeringWildlifeAnimationClips
 */

import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import {
  DEFINING_WILDLIFE_MOTION_FPS,
  definingWildlifeMotionSheetLayout,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';

const DEFINING_WILDLIFE_ANIMATION_CLIP_PREFIX = 'wildlife-' as const;

/** Builds the clip id for one species motion. */
export function formattingWildlifeAnimationClipId(
  speciesId: string,
  motionKind: DefiningWildlifeMotionClipKind
): string {
  return `${DEFINING_WILDLIFE_ANIMATION_CLIP_PREFIX}${speciesId}-${motionKind}`;
}

const DEFINING_WILDLIFE_ONE_SHOT_MOTIONS: ReadonlySet<DefiningWildlifeMotionClipKind> =
  new Set(['attack', 'takeDamage', 'die']);

/**
 * Registers all motion clips for one loaded species texture set.
 */
export function registeringWildlifeAnimationClips(
  species: DefiningWildlifeSpeciesDefinition,
  textures: DefiningWildlifeSpeciesTextures
): void {
  const motionKinds = Object.keys(textures) as DefiningWildlifeMotionClipKind[];

  for (const motionKind of motionKinds) {
    const motionSheet = textures[motionKind];
    const sheetLayout = definingWildlifeMotionSheetLayout(
      motionSheet.frameWidthPx,
      motionSheet.frameHeightPx
    );
    const frameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
      motionSheet.directionTextures,
      sheetLayout
    );

    registeringWorldPlazaAnimationClip(
      buildingWorldPlazaAnimationClipFromMotionSheet({
        clipId: formattingWildlifeAnimationClipId(
          species.speciesId,
          motionKind
        ),
        frameTextures,
        sheetLayout,
        fps: DEFINING_WILDLIFE_MOTION_FPS[motionKind],
        playbackMode: DEFINING_WILDLIFE_ONE_SHOT_MOTIONS.has(motionKind)
          ? 'once'
          : 'loop',
      })
    );
  }
}

/** Tracks which species have registered clips. */
const registeredWildlifeSpeciesIds = new Set<string>();

/**
 * Ensures clips are registered for one species (idempotent).
 */
export async function ensuringWildlifeAnimationClipsRegistered(
  species: DefiningWildlifeSpeciesDefinition,
  loadTextures: (
    species: DefiningWildlifeSpeciesDefinition
  ) => Promise<DefiningWildlifeSpeciesTextures>
): Promise<void> {
  if (registeredWildlifeSpeciesIds.has(species.speciesId)) {
    return;
  }

  const textures = await loadTextures(species);
  registeringWildlifeAnimationClips(species, textures);
  registeredWildlifeSpeciesIds.add(species.speciesId);
}

/** Clears registration tracking (tests only). */
export function clearingWildlifeAnimationClipRegistrationForTests(): void {
  registeredWildlifeSpeciesIds.clear();
}
