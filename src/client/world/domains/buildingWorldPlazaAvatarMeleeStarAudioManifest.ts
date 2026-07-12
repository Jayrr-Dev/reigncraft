import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_CLIP_CATALOG,
  type DefiningWorldPlazaAvatarMeleeClipId,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';
import { resolvingWorldPlazaAvatarMeleeSfxUrl } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeSfxUrl';
import { resolvingWorldPlazaAvatarMeleeStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeStarAudioId';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Builds the star-audio preload manifest for every shipped avatar melee clip.
 */
export function buildingWorldPlazaAvatarMeleeStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_AVATAR_MELEE_CLIP_CATALOG
  ) as DefiningWorldPlazaAvatarMeleeClipId[]) {
    manifest[resolvingWorldPlazaAvatarMeleeStarAudioId(clipId)] = {
      src: resolvingWorldPlazaAvatarMeleeSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
