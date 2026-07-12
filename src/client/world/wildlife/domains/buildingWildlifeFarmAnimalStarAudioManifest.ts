import type { DefiningWildlifeBeastSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import { DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG,
  type DefiningWildlifeFarmAnimalSfxClipId,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeMixkitWildSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import { DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import type { DefiningWildlifePixabayWildSfxClipId } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import { DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';
import { resolvingWildlifeSpeciesSfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

function registeringWildlifeSpeciesSfxClipInManifest(
  manifest: Manifest,
  clipId: DefiningWildlifeSpeciesSfxClipId
): void {
  manifest[resolvingWildlifeSpeciesSfxStarAudioId(clipId)] = {
    src: resolvingWildlifeSpeciesSfxUrl(clipId),
    group: 'sfx',
  };
}

/**
 * Builds a star-audio preload manifest for an explicit clip id list.
 */
export function buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds(
  clipIds: readonly DefiningWildlifeSpeciesSfxClipId[]
): Manifest {
  const manifest: Manifest = {};

  for (const clipId of clipIds) {
    registeringWildlifeSpeciesSfxClipInManifest(manifest, clipId);
  }

  return manifest;
}

/**
 * Builds the star-audio preload manifest for every shipped species vocal clip.
 */
export function buildingWildlifeFarmAnimalStarAudioManifest(): Manifest {
  return buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds([
    ...(Object.keys(
      DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG
    ) as DefiningWildlifeFarmAnimalSfxClipId[]),
    ...(Object.keys(
      DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG
    ) as DefiningWildlifeBeastSfxClipId[]),
    ...(Object.keys(
      DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG
    ) as DefiningWildlifeMixkitWildSfxClipId[]),
    ...(Object.keys(
      DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG
    ) as DefiningWildlifePixabayWildSfxClipId[]),
  ]);
}
