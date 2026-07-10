import { buildingFilmcowFootstepBootPriorityStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import { buildingFilmcowFootstepDeferredStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import { buildingFilmcowFootstepStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import { describe, expect, it } from 'vitest';

describe('buildingFilmcowFootstepStarAudioManifest tiers', () => {
  it('loads common surfaces first and defers the NOX-heavy surfaces', () => {
    const fullManifest = buildingFilmcowFootstepStarAudioManifest();
    const priorityManifest = buildingFilmcowFootstepBootPriorityStarAudioManifest();
    const deferredManifest = buildingFilmcowFootstepDeferredStarAudioManifest();

    expect(Object.keys(priorityManifest).length).toBeGreaterThan(0);
    expect(Object.keys(deferredManifest).length).toBeGreaterThan(0);
    expect(Object.keys(priorityManifest).length).toBeLessThan(
      Object.keys(fullManifest).length
    );

    for (const manifestKey of Object.keys(priorityManifest)) {
      expect(fullManifest[manifestKey]).toBeDefined();
      expect(deferredManifest[manifestKey]).toBeUndefined();
    }
  });

  it('still covers every shipped footstep clip across priority and deferred tiers', () => {
    const fullManifest = buildingFilmcowFootstepStarAudioManifest();
    const mergedManifest = {
      ...buildingFilmcowFootstepBootPriorityStarAudioManifest(),
      ...buildingFilmcowFootstepDeferredStarAudioManifest(),
    };

    expect(Object.keys(mergedManifest).sort()).toEqual(
      Object.keys(fullManifest).sort()
    );
  });
});
