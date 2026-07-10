import {
  DEFINING_WILDLIFE_BEAST_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import {
  DEFINING_WILDLIFE_MIXKIT_WILD_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import {
  DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ASSET_BASE_URL,
  DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG,
} from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';

function encodingWildlifeSpeciesSfxPublicUrl(
  baseUrl: string,
  fileName: string
): string {
  const encodedBaseUrl = baseUrl
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(fileName)}`;
}

/**
 * Builds a browser-safe public URL for one wildlife species vocal clip.
 */
export function resolvingWildlifeSpeciesSfxUrl(
  clipId: DefiningWildlifeSpeciesSfxClipId
): string {
  const farmClip =
    DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG[
      clipId as keyof typeof DEFINING_WILDLIFE_FARM_ANIMAL_SFX_CLIP_CATALOG
    ];

  if (farmClip) {
    return encodingWildlifeSpeciesSfxPublicUrl(
      DEFINING_WILDLIFE_FARM_ANIMAL_SFX_ASSET_BASE_URL,
      farmClip.fileName
    );
  }

  const mixkitClip =
    DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG[
      clipId as keyof typeof DEFINING_WILDLIFE_MIXKIT_WILD_SFX_CLIP_CATALOG
    ];

  if (mixkitClip) {
    return encodingWildlifeSpeciesSfxPublicUrl(
      DEFINING_WILDLIFE_MIXKIT_WILD_SFX_ASSET_BASE_URL,
      mixkitClip.fileName
    );
  }

  const pixabayClip =
    DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG[
      clipId as keyof typeof DEFINING_WILDLIFE_PIXABAY_WILD_SFX_CLIP_CATALOG
    ];

  if (pixabayClip) {
    return encodingWildlifeSpeciesSfxPublicUrl(
      DEFINING_WILDLIFE_PIXABAY_WILD_SFX_ASSET_BASE_URL,
      pixabayClip.fileName
    );
  }

  const beastClip =
    DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG[
      clipId as keyof typeof DEFINING_WILDLIFE_BEAST_SFX_CLIP_CATALOG
    ];

  if (!beastClip) {
    throw new Error(`Unknown wildlife species SFX clip id: ${clipId}`);
  }

  return encodingWildlifeSpeciesSfxPublicUrl(
    DEFINING_WILDLIFE_BEAST_SFX_ASSET_BASE_URL,
    beastClip.fileName
  );
}
