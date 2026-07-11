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
  crossfadingWorldPlazaMusicBusTo,
  gettingWorldPlazaMusicBusActiveStarAudioId,
  settingWorldPlazaMusicBusTargetVolume,
  stoppingWorldPlazaMusicBus,
} from '@/components/world/domains/managingWorldPlazaMusicBus';
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
 * Leaving home does not stop the shared music bus; world boot / biome music
 * adopts the playing track so BGM stays continuous through loading.
 *
 * @module components/home/hooks/usingPlazaHomeScreenMusic
 */
export function usingPlazaHomeScreenMusic(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaMasterVolumeStoreFromStorage();

    const titleStarAudioId = resolvingWorldPlazaBiomeMusicStarAudioId(
      DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID
    );

    const applyingMasterMusicVolume = (): void => {
      settingWorldPlazaMusicBusTargetVolume(
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
        stoppingWorldPlazaMusicBus(
          DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS / 1000
        );
        return;
      }

      applyingMasterMusicVolume();

      if (gettingWorldPlazaMusicBusActiveStarAudioId() === titleStarAudioId) {
        return;
      }

      crossfadingWorldPlazaMusicBusTo(starAudio, titleStarAudioId, {
        durationSec: DEFINING_PLAZA_HOME_SCREEN_MUSIC_CROSSFADE_MS / 1000,
        loop: true,
      });
    };

    const unlockingAndRetryingTitleMusic = (): void => {
      void starAudio.unlock();
      applyingMasterMusicVolume();
      startingTitleMusic();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingMasterMusicVolume();

      if (gettingWorldPlazaMasterVolume() <= 0) {
        stoppingWorldPlazaMusicBus(
          DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS / 1000
        );
        return;
      }

      if (gettingWorldPlazaMusicBusActiveStarAudioId()) {
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
      // Do not stop music on leave: world boot / biome music adopts the shared
      // bus so the player hears BGM through the loading screen.
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
