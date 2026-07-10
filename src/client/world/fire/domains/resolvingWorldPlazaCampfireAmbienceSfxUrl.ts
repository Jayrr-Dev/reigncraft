import {
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_CLIP_CATALOG,
  type DefiningWorldPlazaCampfireAmbienceClipId,
} from '@/components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants';

/**
 * Builds a browser-safe public URL for one campfire ambience clip.
 */
export function resolvingWorldPlazaCampfireAmbienceSfxUrl(
  clipId: DefiningWorldPlazaCampfireAmbienceClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_CLIP_CATALOG[clipId];
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
