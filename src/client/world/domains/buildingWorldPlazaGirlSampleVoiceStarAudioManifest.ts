import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_CLIP_CATALOG,
  type DefiningWorldPlazaGirlSampleVoiceClipId,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import { resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId } from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId';
import { resolvingWorldPlazaGirlSampleVoiceSfxUrl } from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Builds the star-audio preload manifest for every shipped girl voice clip.
 */
export function buildingWorldPlazaGirlSampleVoiceStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of Object.keys(
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_CLIP_CATALOG
  ) as DefiningWorldPlazaGirlSampleVoiceClipId[]) {
    manifest[resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaGirlSampleVoiceSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
