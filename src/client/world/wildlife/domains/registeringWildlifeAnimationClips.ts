/**
 * Registers declarative animation clips for one wildlife species.
 *
 * @module components/world/wildlife/domains/registeringWildlifeAnimationClips
 */

import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningWildlifeExtendedMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeLoadedMotionClipKind,
  DefiningWildlifeMotionClipKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import {
  DEFINING_WILDLIFE_MOTION_FPS,
  definingWildlifeMotionSheetLayout,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { registeringWildlifeSleepAnimationClip } from '@/components/world/wildlife/domains/registeringWildlifeSleepAnimationClip';

const DEFINING_WILDLIFE_ANIMATION_CLIP_PREFIX = 'wildlife-' as const;

/** Builds the clip id for one species motion. */
export function formattingWildlifeAnimationClipId(
  speciesId: string,
  motionKind: DefiningWildlifeMotionClipKind
): string {
  return `${DEFINING_WILDLIFE_ANIMATION_CLIP_PREFIX}${speciesId}-${motionKind}`;
}

const DEFINING_WILDLIFE_ONE_SHOT_MOTIONS: ReadonlySet<DefiningWildlifeMotionClipKind> =
  new Set(['attack', 'attack2', 'attack3', 'howl', 'taunt', 'takeDamage', 'die']);

const DEFINING_WILDLIFE_EXTENDED_MOTION_CLIP_KINDS: readonly DefiningWildlifeExtendedMotionClipKind[] =
  ['howl', 'taunt', 'runBackwards', 'attack2', 'attack3'];

/**
 * Registers all motion clips for one loaded species texture set.
 */
export function registeringWildlifeAnimationClips(
  species: DefiningWildlifeSpeciesDefinition,
  textures: DefiningWildlifeSpeciesTextures
): void {
  const motionKinds = Object.keys(
    textures
  ) as DefiningWildlifeLoadedMotionClipKind[];

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

  for (const motionKind of DEFINING_WILDLIFE_EXTENDED_MOTION_CLIP_KINDS) {
    const motionSheet = textures[motionKind];

    if (!motionSheet) {
      continue;
    }

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

  registeringWildlifeSleepAnimationClip(species, textures.die);
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

/**
 * Clears clip-registration tracking for one species so it can reload after
 * texture eviction.
 */
export function clearingWildlifeAnimationClipRegistrationForSpecies(
  speciesId: string
): void {
  registeredWildlifeSpeciesIds.delete(speciesId);
}

/** Lists species ids that currently have registered clips. */
export function listingWildlifeRegisteredAnimationClipSpeciesIds(): readonly string[] {
  return [...registeredWildlifeSpeciesIds];
}

/** Clears registration tracking (tests only). */
export function clearingWildlifeAnimationClipRegistrationForTests(): void {
  registeredWildlifeSpeciesIds.clear();
}
