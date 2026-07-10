import { DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS } from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import type { Manifest } from 'star-audio';

/**
 * Builds the merged star-audio preload manifest for every shipped plaza sound.
 */
export function buildingWorldPlazaWorldBootStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const buildManifest of DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS) {
    Object.assign(manifest, buildManifest());
  }

  return manifest;
}
