import {
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_CLIP_CATALOG,
  type DefiningWildlifeOmegaWolfSfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import { resolvingWildlifeOmegaWolfSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxStarAudioId';
import { resolvingWildlifeOmegaWolfSfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped Omega Wolf clip.
 */
export function buildingWildlifeOmegaWolfStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WILDLIFE_OMEGA_WOLF_SFX_CLIP_CATALOG
  ) as DefiningWildlifeOmegaWolfSfxClipId[]) {
    manifest[resolvingWildlifeOmegaWolfSfxStarAudioId(clipId)] = {
      src: resolvingWildlifeOmegaWolfSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
