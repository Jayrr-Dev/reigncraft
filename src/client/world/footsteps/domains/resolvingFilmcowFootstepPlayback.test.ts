import { describe, expect, it } from 'vitest';

import { DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  filteringFilmcowFootstepClipIdsToShortOneShots,
  resolvingFilmcowFootstepPlaybackDurationS,
  resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';

describe('filteringFilmcowFootstepClipIdsToShortOneShots', () => {
  it('removes FilmCow composite run loops', () => {
    const filtered = filteringFilmcowFootstepClipIdsToShortOneShots([
      'grass_light_01',
      'grass_run',
      'leaves_run',
      'dirt_run',
      'grass_stomp_02',
    ]);

    expect(filtered).toEqual(['grass_light_01', 'grass_stomp_02']);
    expect(
      filtered.some((clipId) =>
        DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS.includes(
          clipId as (typeof DEFINING_FILMCOW_FOOTSTEP_LONG_COMPOSITE_CLIP_IDS)[number]
        )
      )
    ).toBe(false);
  });
});

describe('resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion', () => {
  it('never returns long composite run clips for large wildlife on grass', () => {
    const runClipIds =
      resolvingFilmcowFootstepWildlifeClipIdsForSurfaceAndMotion(
        'grass',
        'run',
        'large'
      );

    expect(runClipIds.length).toBeGreaterThan(0);
    expect(runClipIds).not.toContain('grass_run');
    expect(runClipIds).not.toContain('dirt_run');
  });
});

describe('resolvingFilmcowFootstepPlaybackDurationS', () => {
  it('caps walk and run one-shots', () => {
    expect(resolvingFilmcowFootstepPlaybackDurationS('walk')).toBe(0.52);
    expect(resolvingFilmcowFootstepPlaybackDurationS('run')).toBe(0.28);
  });
});
