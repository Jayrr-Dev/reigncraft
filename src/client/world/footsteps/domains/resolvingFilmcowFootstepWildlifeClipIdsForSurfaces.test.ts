import { buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces } from '@/components/world/footsteps/domains/buildingFilmcowFootstepWildlifeStarAudioManifest';
import { resolvingFilmcowFootstepWildlifeClipIdsForSurfaces } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepWildlifeClipIdsForSurfaces';
import { describe, expect, it } from 'vitest';

describe('resolvingFilmcowFootstepWildlifeClipIdsForSurfaces', () => {
  it('includes surface clips and wildlife size-tier overrides', () => {
    const clipIds = resolvingFilmcowFootstepWildlifeClipIdsForSurfaces([
      'grass',
    ]);

    expect(clipIds).toContain('grass_walk_01');
    expect(clipIds).toContain('grass_light_01');
    expect(clipIds).toContain('grass_stomp_01');
    expect(clipIds).not.toContain('grass_run');
    expect(clipIds).not.toContain('dirt_run');
  });

  it('builds a smaller manifest than the full footstep catalog for one biome surface', () => {
    const grassManifest =
      buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces(['grass']);
    const sandManifest =
      buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces(['sand']);

    expect(Object.keys(grassManifest).length).toBeGreaterThan(0);
    expect(Object.keys(sandManifest).length).toBeGreaterThan(0);
    expect(Object.keys(grassManifest).length).toBeLessThan(40);
    expect(Object.keys(sandManifest).length).toBeLessThan(40);
  });
});
