import { resolvingWorldPlazaAvatarMotionSfxClipId } from '@/components/world/domains/resolvingWorldPlazaAvatarMotionSfxClipId';
import { resolvingWorldPlazaAvatarFootstepSfxUrl } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepSfxUrl';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';
import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for avatar jump and roll motion clips.
 */
export function buildingWorldPlazaAvatarMotionSfxStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const clipIds = new Set<DefiningFilmcowFootstepClipId>();

  for (let clipIndex = 0; clipIndex < 8; clipIndex += 1) {
    clipIds.add(resolvingWorldPlazaAvatarMotionSfxClipId('jump_takeoff', clipIndex));
    clipIds.add(resolvingWorldPlazaAvatarMotionSfxClipId('roll_dodge', clipIndex));
  }

  for (const clipId of clipIds) {
    manifest[resolvingFilmcowFootstepSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaAvatarFootstepSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
