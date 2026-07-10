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
    expect(resolvingWorldPlazaAvatarFootstepStarAudioId('grass_1')).toBe(
      'avatar-footstep.grass_1'
    );
  });
});

describe('resolvingWorldPlazaAvatarFootstepSfxUrl', () => {
  it('builds a browser-safe public URL for avatar footstep clips', () => {
    expect(resolvingWorldPlazaAvatarFootstepSfxUrl('grass_1')).toBe(
      '/sfx/free-footsteps-pack/grass-1.wav'
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

  it('maps rocky to concrete and forest to forest', () => {
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('rocky')).toBe(
      'concrete'
    );
    expect(resolvingWorldPlazaAvatarFootstepSurfaceForBiomeKind('forest')).toBe(
      'forest'
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
  it('uses dedicated grass run clip while running', () => {
    expect(resolvingWorldPlazaAvatarFootstepNextClipId('grass', 'run', 0)).toBe(
      'grass_running'
    );
  });

  it('rotates forest walk clips', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepNextClipId('forest', 'walk', 0)
    ).toBe('forest_1');
    expect(
      resolvingWorldPlazaAvatarFootstepNextClipId('forest', 'walk', 1)
    ).toBe('forest_2');
  });
});

describe('resolvingWorldPlazaAvatarJumpLandingClipId', () => {
  it('picks a heavier landing clip per surface', () => {
    expect(resolvingWorldPlazaAvatarJumpLandingClipId('sand')).toBe('sand');
    expect(resolvingWorldPlazaAvatarJumpLandingClipId('concrete')).toBe(
      'concrete_2'
    );
  });
});

describe('resolvingWorldPlazaAvatarFootstepPlaybackRate', () => {
  it('speeds up sand runs because the pack has no dedicated run clip', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepPlaybackRate(
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
        'sand'
      )
    ).toBe(1.08);
  });

  it('keeps native rate for grass run clip', () => {
    expect(
      resolvingWorldPlazaAvatarFootstepPlaybackRate(
        DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
        'grass'
      )
    ).toBe(1);
  });
});
