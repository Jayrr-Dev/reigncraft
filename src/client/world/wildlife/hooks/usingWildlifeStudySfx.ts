'use client';

import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeStudyStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeStudyStarAudioManifest';
import { computingWildlifeStudySfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeStudySfxEffectiveVolume';
import {
  registeringWildlifeStudySfxPlayback,
  type PlayingWildlifeStudySfxRequest,
} from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { resolvingWildlifeStudySfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxStarAudioId';
import { useEffect, useRef } from 'react';

/**
 * Preloads Fantasy UI study / reward clips and wires sectioned playback.
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

    const playingStudyComplete = ({
      sectionId = 'study',
    }: PlayingWildlifeStudySfxRequest = {}): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWildlifeStudySfxEffectiveVolume(sectionId);

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingWildlifeStudySfxStarAudioId('study_learn'),
        { volume }
      );
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
