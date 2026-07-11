'use client';

import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeStudyStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeStudyStarAudioManifest';
import { computingWildlifeStudySfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeStudySfxEffectiveVolume';
import { registeringWildlifeStudySfxPlayback } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { resolvingWildlifeStudySfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxStarAudioId';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads corpse Study completion clips and wires playback.
 *
 * @module components/world/wildlife/hooks/usingWildlifeStudySfx
 */
export function usingWildlifeStudySfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingStudyComplete = (): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWildlifeStudySfxEffectiveVolume();

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingWildlifeStudySfxStarAudioId('study_learn'), {
        group: 'sfx',
        volume,
      });
    };

    const unlockingAndRetryingStudySfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWildlifeStudyStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unsubscribeSfxVolume =
      subscribingWorldPlazaSfxVolume(applyingSfxVolume);
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingStudySfx
      );
    const unregisterPlaybackBridge =
      registeringWildlifeStudySfxPlayback(playingStudyComplete);

    return () => {
      unregisterPlaybackBridge();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
