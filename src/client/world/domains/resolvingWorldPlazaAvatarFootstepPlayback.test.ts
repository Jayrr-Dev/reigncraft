import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import {
  computingWorldPlazaAvatarFootstepIntervalMs,
  resolvingWorldPlazaAvatarFootstepNextClipId,
  resolvingWorldPlazaAvatarFootstepPlaybackRate,
  resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind,
  resolvingWorldPlazaAvatarJumpLandingClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepPlayback';
import { resolvingWorldPlazaAvatarFootstepSfxUrl } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepSfxUrl';
import { resolvingWorldPlazaAvatarFootstepStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepStarAudioId';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAvatarFootstepStarAudioId', () => {
  it('prefixes stable avatar footstep ids for star-audio', () => {
    expect(resolvingWorldPlazaAvatarFootstepStarAudioId('grass_walk_01')).toBe(
      'filmcow-footstep.grass_walk_01'
    );
  });
});

describe('resolvingWorldPlazaAvatarFootstepSfxUrl', () => {
  it('builds a browser-safe public URL for FilmCow avatar footstep clips', () => {
    expect(resolvingWorldPlazaAvatarFootstepSfxUrl('grass_walk_01')).toBe(
      '/sfx/filmcow-footsteps/grass-walk-01.wav'
    );
  });

  it('builds a browser-safe public URL for NOX avatar footstep clips', () => {
    expect(resolvingWorldPlazaAvatarFootstepSfxUrl('nox_sand_walk_01')).toBe(
      '/sfx/nox-footsteps/sand-walk-01.wav'
    );
  });
});

describe('resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind', () => {
  it('maps desert to sand and snowy plains to snow', () => {
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('desert')).toBe(
      'sand'
    );
    expect(
      resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('snowy_plains')
    ).toBe('snow');
  });

  it('maps rocky to concrete, forest to forest, and swamp to mud', () => {
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('rocky')).toBe(
      'concrete'
    );
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('forest')).toBe(
      'forest'
    );
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('swamp')).toBe(
      'mud'
    );
  });
});

describe('computingWorldPlazaAvatarFootstepIntervalMs', () => {
  it('derives walk cadence from GirlSample animation timing', () => {
    expect(computingWorldPlazaAvatarFootstepIntervalMs('walk')).toBe(750);
  });

  it('derives a faster run cadence from GirlSample animation timing', () => {
    expect(computingWorldPlazaAvatarFootstepIntervalMs('run')).toBe(
      277.77777777777777
    );
  });

  it('returns null when the avatar is idle', () => {
    expect(
      computingWorldPlazaAvatarFootstepIntervalMs(
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
      )
    ).toBeNull();
  });
});

describe('resolvingWorldPlazaAvatarFootstepNextClipId', () => {
  it('uses short grass run clips instead of the long FilmCow run export', () => {
    expect(resolvingWorldPlazaAvatarFootstepNextClipId('grass', 'run', 0)).toBe(
      'grass_light_01'
    );
    expect(resolvingWorldPlazaAvatarFootstepNextClipId('grass', 'run', 1)).toBe(
      'grass_light_02'
    );
  });

  it('rotates forest walk clips from the short avatar pool', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepNextClipId('forest', 'walk', 0)
    ).toBe('forest_walk_01');
    expect(
      resolvingWorldPlazaAvatarFootstepNextClipId('forest', 'walk', 1)
    ).toBe('forest_walk_02');
  });
});

describe('resolvingWorldPlazaAvatarJumpLandingClipId', () => {
  it('picks a surface landing clip from the NOX pack where needed', () => {
    expect(resolvingWorldPlazaAvatarJumpLandingClipId('sand')).toBe(
      'nox_sand_land_02'
    );
    expect(resolvingWorldPlazaAvatarJumpLandingClipId('concrete')).toBe(
      'nox_rock_land_02'
    );
    expect(resolvingWorldPlazaAvatarJumpLandingClipId('grass')).toBe(
      'land_grass_02'
    );
  });
});

describe('resolvingWorldPlazaAvatarFootstepPlaybackRate', () => {
  it('keeps native rate for dedicated sand run clips', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepPlaybackRate(
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
        'sand',
        'nox_sand_run_01'
      )
    ).toBe(1);
  });

  it('boosts short FilmCow clips used as grass run steps', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepPlaybackRate(
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
        'grass',
        'grass_light_01'
      )
    ).toBe(1.22);
  });
});
