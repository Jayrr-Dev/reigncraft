import { DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID } from '@/components/home/domains/definingPlazaHomeScreenMusicConstants';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for title screen music.
 */
export function buildingPlazaHomeScreenMusicStarAudioManifest(): Manifest {
  const tuneId = DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID;

  return {
    [resolvingWorldPlazaBiomeMusicStarAudioId(tuneId)]: {
      src: resolvingWorldPlazaBiomeMusicUrl(tuneId),
      group: 'music',
    },
  };
}
