import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import type { DefiningWorldPlazaDeathSfxClipId } from '@/components/world/audio/lifecycle/definingWorldPlazaDeathSfxConstants';
import { resolvingWorldPlazaDeathSfxStarAudioId } from '@/components/world/audio/lifecycle/resolvingWorldPlazaDeathSfxStarAudioId';
import { resolvingWorldPlazaDeathSfxUrl } from '@/components/world/audio/lifecycle/resolvingWorldPlazaDeathSfxUrl';

const DEFINING_WORLD_PLAZA_DEATH_SFX_CLIP_IDS = [
  'impact_boom',
] as const satisfies readonly DefiningWorldPlazaDeathSfxClipId[];

/**
 * Builds the star-audio preload manifest for player-death clips.
 */
export function buildingWorldPlazaDeathStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const clipId of DEFINING_WORLD_PLAZA_DEATH_SFX_CLIP_IDS) {
    manifest[resolvingWorldPlazaDeathSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaDeathSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
