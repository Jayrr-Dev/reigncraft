import { buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces', () => {
  it('uses avatar short run clips instead of long FilmCow run composites', () => {
    const clipIds = resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces([
      'grass',
    ]);

    expect(clipIds).toContain('grass_light_01');
    expect(clipIds).not.toContain('grass_run');
  });
});

describe('buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces', () => {
  it('builds a smaller manifest than the full avatar footstep catalog', () => {
    const grassManifest =
      buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces(['grass']);
    const sandManifest =
      buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces(['sand']);

    expect(Object.keys(grassManifest).length).toBeGreaterThan(0);
    expect(Object.keys(sandManifest).length).toBeGreaterThan(0);

    for (const manifestKey of Object.keys(grassManifest)) {
      expect(sandManifest[manifestKey]).toBeUndefined();
    }
  });
});
