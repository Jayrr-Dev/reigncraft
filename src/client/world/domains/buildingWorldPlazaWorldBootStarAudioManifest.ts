import { resolvingWorldPlazaWorldBootStarAudioManifestBuilders } from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Builds the merged star-audio preload manifest for every shipped plaza sound
 * warmed during world boot on the current viewport.
 */
export function buildingWorldPlazaWorldBootStarAudioManifest(): Manifest {
  const manifest: Manifest = {};

  for (const buildManifest of resolvingWorldPlazaWorldBootStarAudioManifestBuilders()) {
    Object.assign(manifest, buildManifest());
  }

  return manifest;
}
