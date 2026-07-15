/**
 * @module components/world/fishing/domains/buildingWorldPlazaFishingStarAudioManifest
 */

import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import type { DefiningWorldPlazaFishingSfxClipId } from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import { resolvingWorldPlazaFishingSfxStarAudioId } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingSfxStarAudioId';
import { resolvingWorldPlazaFishingSfxUrl } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingSfxUrl';

const DEFINING_WORLD_PLAZA_FISHING_SFX_CLIP_IDS = [
  'cast_whoosh',
  'junk_splash',
  'reel_winding',
] as const satisfies readonly DefiningWorldPlazaFishingSfxClipId[];

export function buildingWorldPlazaFishingStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of DEFINING_WORLD_PLAZA_FISHING_SFX_CLIP_IDS) {
    manifest[resolvingWorldPlazaFishingSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaFishingSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
