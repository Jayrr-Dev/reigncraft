'use client';

import { buildingWorldPlazaBiomeMusicStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import { computingWorldPlazaBiomeMusicEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeMusicEffectiveTargetVolume';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Loops Cozy Tunes background music that follows the player's current biome.
 *
 * @module components/world/hooks/usingWorldPlazaBiomeMusic
 */
export function usingWorldPlazaBiomeMusic(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const desiredTuneIdRef = useRef<DefiningWorldPlazaCozyTuneId | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaMasterVolumeStoreFromStorage();

    const applyingMasterMusicVolume = (): void => {
      starAudio.setMusicVolume(
        computingWorldPlazaBiomeMusicEffectiveTargetVolume()
      );
    };

    const resolvingCurrentBiomeTuneId =
      (): DefiningWorldPlazaCozyTuneId | null => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return null;
        }

        const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
        const { isDaytime } = computingWorldPlazaDayNightSunState();

        return resolvingWorldPlazaBiomeMusicTuneId(biome.kind, isDaytime);
      };

    const crossfadingToDesiredTune = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      const tuneId = desiredTuneIdRef.current;

      if (!tuneId) {
        return;
      }

      if (starAudio.state === 'locked') {
        return;
      }

      if (gettingWorldPlazaMasterVolume() <= 0) {
        starAudio.music.stop(
          DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000
        );
        return;
      }

      void starAudio.music.crossfadeTo(
        resolvingWorldPlazaBiomeMusicStarAudioId(tuneId),
        {
          duration: DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000,
          loop: true,
        }
      );
    };

    const syncingDesiredBiomeMusic = (): void => {
      const tuneId = resolvingCurrentBiomeTuneId();

      if (!tuneId) {
        return;
      }

      desiredTuneIdRef.current = tuneId;
      crossfadingToDesiredTune();
    };

    const unlockingAndRetryingBiomeMusic = (): void => {
      void starAudio.unlock();
      applyingMasterMusicVolume();
      crossfadingToDesiredTune();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingMasterMusicVolume();
      syncingDesiredBiomeMusic();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterMusicVolume();
      crossfadingToDesiredTune();
    };

    const handlingStarAudioResumed = (): void => {
      crossfadingToDesiredTune();
    };

    applyingMasterMusicVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaBiomeMusicStarAudioManifest()
    ).then(() => {
      isPreloadReadyRef.current = true;
      syncingDesiredBiomeMusic();
    });

    const unsubscribeMasterVolume = subscribingWorldPlazaMasterVolume(
      handlingMasterVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingBiomeMusic
      );

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingDesiredBiomeMusic,
      DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS
    );

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeMasterVolume();
      window.clearInterval(intervalId);
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      desiredTuneIdRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [playerPositionRef]);
}
