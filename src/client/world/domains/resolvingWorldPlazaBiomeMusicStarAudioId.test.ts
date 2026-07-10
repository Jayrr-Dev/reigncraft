import { describe, expect, it } from 'vitest';

import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_STAR_AUDIO_ID_PREFIX,
  resolvingWorldPlazaBiomeMusicStarAudioId,
} from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';

describe('resolvingWorldPlazaBiomeMusicStarAudioId', () => {
  it('prefixes stable Cozy Tunes ids for star-audio', () => {
    expect(resolvingWorldPlazaBiomeMusicStarAudioId('sheep')).toBe(
      `${DEFINING_WORLD_PLAZA_BIOME_MUSIC_STAR_AUDIO_ID_PREFIX}sheep`
    );
  });
});
