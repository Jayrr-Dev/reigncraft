import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG,
  type DefiningWorldPlazaAvatarFootstepClipId,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import { resolvingWorldPlazaAvatarFootstepSfxUrl } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepSfxUrl';
import { resolvingWorldPlazaAvatarFootstepStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepStarAudioId';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped avatar footstep clip.
 */
export function buildingWorldPlazaAvatarFootstepStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_CLIP_CATALOG
  ) as DefiningWorldPlazaAvatarFootstepClipId[]) {
    manifest[resolvingWorldPlazaAvatarFootstepStarAudioId(clipId)] = {
      src: resolvingWorldPlazaAvatarFootstepSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
