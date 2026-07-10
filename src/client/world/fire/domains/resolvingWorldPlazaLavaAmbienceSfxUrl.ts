import {
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_CLIP_CATALOG,
  type DefiningWorldPlazaLavaAmbienceClipId,
} from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';

/**
 * Builds a browser-safe public URL for one lava ambience clip.
 */
export function resolvingWorldPlazaLavaAmbienceSfxUrl(
  clipId: DefiningWorldPlazaLavaAmbienceClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_CLIP_CATALOG[clipId];
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
