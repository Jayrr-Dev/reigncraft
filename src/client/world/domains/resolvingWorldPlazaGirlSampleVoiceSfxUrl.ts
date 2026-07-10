import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_CLIP_CATALOG,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaGirlSampleVoiceClipId,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

/**
 * Builds a browser-safe public URL for one girl voice clip.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxUrl(
  clipId: DefiningWorldPlazaGirlSampleVoiceClipId
): string {
  const clip = DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_CLIP_CATALOG[clipId];
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(clip.fileName)}`;
}
