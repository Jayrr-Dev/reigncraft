import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG,
  type DefiningWildlifeFarmAnimalSfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';
import { resolvingWildlifeSpeciesSfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for every shipped farm animal clip.
 */
export function buildingWildlifeFarmAnimalStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG
  ) as DefiningWildlifeFarmAnimalSfxClipId[]) {
    manifest[resolvingWildlifeSpeciesSfxStarAudioId(clipId)] = {
      src: resolvingWildlifeSpeciesSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
