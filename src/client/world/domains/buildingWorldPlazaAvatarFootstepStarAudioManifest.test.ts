import {
  buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
  buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces,
} from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces', () => {
  it('uses avatar short run clips instead of long FilmCow run composites', () => {
    const clipIds = resolvingWorldPlazaAvatarFootstepClipIdsForSurfaces([
      'grass',
    ]);

    expect(clipIds).toEqual([
      'grass_light_01',
      'grass_light_02',
      'land_grass_02',
    ]);
    expect(clipIds).not.toContain('grass_run');
    expect(clipIds).not.toContain('grass_walk_01');
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

  it('boots only avatar grass/forest clips, not shared FilmCow walk/run packs', () => {
    const bootManifest =
      buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest();
    const bootKeys = Object.keys(bootManifest);

    expect(bootKeys).toContain('filmcow-footstep.grass_light_01');
    expect(bootKeys).toContain('filmcow-footstep.grass_light_02');
    expect(bootKeys).not.toContain('filmcow-footstep.grass_run');
    expect(bootKeys).not.toContain('filmcow-footstep.grass_walk_01');
  });
});
