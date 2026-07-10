import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';

/**
 * Resolves the public URL for one FilmCow ambience loop.
 */
export function resolvingWorldPlazaBiomeAmbienceUrl(
  clipId: DefiningWorldPlazaBiomeAmbienceClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG[clipId];

  return `${DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_ASSET_BASE_URL}/${clip.fileName}`;
}
