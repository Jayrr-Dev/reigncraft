import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import type { DefiningWildlifeStudySfxClipId } from '@/components/world/wildlife/domains/definingWildlifeStudySfxConstants';
import { resolvingWildlifeStudySfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxStarAudioId';
import { resolvingWildlifeStudySfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxUrl';

const DEFINING_WILDLIFE_STUDY_SFX_CLIP_IDS = [
  'study_learn',
  'chest_open',
] as const satisfies readonly DefiningWildlifeStudySfxClipId[];

/**
 * Builds the star-audio preload manifest for corpse Study completion clips.
 */
export function buildingWildlifeStudyStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of DEFINING_WILDLIFE_STUDY_SFX_CLIP_IDS) {
    manifest[resolvingWildlifeStudySfxStarAudioId(clipId)] = {
      src: resolvingWildlifeStudySfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
