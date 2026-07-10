'use client';

import { computingPlazaHomeScreenMusicEffectiveTargetVolume } from '@/components/home/domains/computingPlazaHomeScreenMusicEffectiveTargetVolume';
import {
  DEFINING_PLAZA_HOME_SCREEN_MUSIC_CROSSFADE_MS,
  DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS,
  DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID,
} from '@/components/home/domains/definingPlazaHomeScreenMusicConstants';
import { preloadingPlazaHomeScreenMusic } from '@/components/home/domains/preloadingPlazaHomeScreenMusic';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Loops title screen music on the home menu until the player enters a session.
 *
 * @module components/home/hooks/usingPlazaHomeScreenMusic
 */
export function usingPlazaHomeScreenMusic(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const isTitleMusicPlayingRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaMasterVolumeStoreFromStorage();

    const applyingMasterMusicVolume = (): void => {
      starAudio.setMusicVolume(
        computingPlazaHomeScreenMusicEffectiveTargetVolume()
      );
    };

    const startingTitleMusic = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      if (starAudio.state === 'locked') {
        return;
      }

      if (gettingWorldPlazaMasterVolume() <= 0) {
        starAudio.music.stop(
          DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS / 1000
        );
        isTitleMusicPlayingRef.current = false;
        return;
      }

      if (isTitleMusicPlayingRef.current) {
        applyingMasterMusicVolume();
        return;
      }

      void starAudio.music.crossfadeTo(
        resolvingWorldPlazaBiomeMusicStarAudioId(
          DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID
        ),
        {
          duration: DEFINING_PLAZA_HOME_SCREEN_MUSIC_CROSSFADE_MS / 1000,
          loop: true,
        }
      );
      isTitleMusicPlayingRef.current = true;
    };

    const unlockingAndRetryingTitleMusic = (): void => {
      void starAudio.unlock();
      applyingMasterMusicVolume();
      startingTitleMusic();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingMasterMusicVolume();

      if (gettingWorldPlazaMasterVolume() <= 0) {
        starAudio.music.stop(
          DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS / 1000
        );
        isTitleMusicPlayingRef.current = false;
        return;
      }

      if (isTitleMusicPlayingRef.current) {
        return;
      }

      startingTitleMusic();
    };

    applyingMasterMusicVolume();
    void preloadingPlazaHomeScreenMusic().then(() => {
      isPreloadReadyRef.current = true;
      startingTitleMusic();
    });

    const unsubscribeMasterVolume = subscribingWorldPlazaMasterVolume(
      handlingMasterVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingTitleMusic
      );

    starAudio.on('unlocked', startingTitleMusic);
    starAudio.on('resumed', startingTitleMusic);

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeMasterVolume();
      starAudio.off('unlocked', startingTitleMusic);
      starAudio.off('resumed', startingTitleMusic);
      starAudio.music.stop(DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS / 1000);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isTitleMusicPlayingRef.current = false;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
