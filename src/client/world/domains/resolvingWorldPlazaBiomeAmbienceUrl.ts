import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG,
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_FILMCOW_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_NOX_FLOWS_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TOMMUSIC_ASSET_BASE_URL,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';

/**
 * Resolves the public URL for one ambience loop.
 */
export function resolvingWorldPlazaBiomeAmbienceUrl(
  clipId: DefiningWorldPlazaBiomeAmbienceClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG[clipId];
  const assetBaseUrl =
    clip.assetPack === 'tommusic'
      ? DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TOMMUSIC_ASSET_BASE_URL
      : clip.assetPack === 'nox'
        ? DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_NOX_FLOWS_ASSET_BASE_URL
        : DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_FILMCOW_ASSET_BASE_URL;

  return `${assetBaseUrl}/${clip.fileName}`;
}
