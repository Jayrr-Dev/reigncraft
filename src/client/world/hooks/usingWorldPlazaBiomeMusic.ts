'use client';

import { settingWorldPlazaAudioScope } from '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore';
import { buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds } from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import { computingWorldPlazaBiomeMusicEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeMusicEffectiveTargetVolume';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_DAY_NIGHT_STICKY_POLL_COUNT,
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
  crossfadingWorldPlazaMusicBusTo,
  gettingWorldPlazaMusicBusActiveStarAudioId,
  settingWorldPlazaMusicBusTargetVolume,
  stoppingWorldPlazaMusicBus,
} from '@/components/world/domains/managingWorldPlazaMusicBus';
import {
  acquiringWorldPlazaStarAudio,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import { resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

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
  const stickyIsDaytimeRef = useRef<boolean | null>(null);
  const stickyDaytimePollCountRef = useRef(0);
  const isPreloadReadyRef = useRef(false);
  const preloadedTuneKeyRef = useRef('');
  const preloadGenerationRef = useRef(0);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaMasterVolumeStoreFromStorage();

    const applyingMasterMusicVolume = (): void => {
      settingWorldPlazaMusicBusTargetVolume(
        computingWorldPlazaBiomeMusicEffectiveTargetVolume()
      );
    };

    const resolvingStickyIsDaytime = (isDaytime: boolean): boolean => {
      if (stickyIsDaytimeRef.current === null) {
        stickyIsDaytimeRef.current = isDaytime;
        stickyDaytimePollCountRef.current = 0;
        return isDaytime;
      }

      if (stickyIsDaytimeRef.current === isDaytime) {
        stickyDaytimePollCountRef.current = 0;
        return isDaytime;
      }

      stickyDaytimePollCountRef.current += 1;

      if (
        stickyDaytimePollCountRef.current <
        DEFINING_WORLD_PLAZA_BIOME_MUSIC_DAY_NIGHT_STICKY_POLL_COUNT
      ) {
        return stickyIsDaytimeRef.current;
      }

      stickyIsDaytimeRef.current = isDaytime;
      stickyDaytimePollCountRef.current = 0;
      return isDaytime;
    };

    const resolvingCurrentBiomeTuneId =
      (): DefiningWorldPlazaCozyTuneId | null => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return null;
        }

        const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
        const { isDaytime } = computingWorldPlazaDayNightSunState();
        const stickyIsDaytime = resolvingStickyIsDaytime(isDaytime);

        return resolvingWorldPlazaBiomeMusicTuneId(biome.kind, stickyIsDaytime);
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
        stoppingWorldPlazaMusicBus(
          DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000
        );
        return;
      }

      const starAudioId = resolvingWorldPlazaBiomeMusicStarAudioId(tuneId);

      if (gettingWorldPlazaMusicBusActiveStarAudioId() === starAudioId) {
        applyingMasterMusicVolume();
        return;
      }

      applyingMasterMusicVolume();
      crossfadingWorldPlazaMusicBusTo(starAudio, starAudioId, {
        durationSec: DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000,
        loop: true,
      });
    };

    const resolvingTuneIdsForCurrentBiome =
      (): readonly DefiningWorldPlazaCozyTuneId[] => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return [];
        }

        const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);

        return resolvingWorldPlazaBiomeMusicTuneIdsForBiomeKind(biome.kind);
      };

    const preloadingTunesForBiome = (
      tuneIds: readonly DefiningWorldPlazaCozyTuneId[]
    ): void => {
      if (tuneIds.length === 0) {
        return;
      }

      const tuneKey = [...tuneIds].sort().join('|');

      if (
        tuneKey === preloadedTuneKeyRef.current &&
        isPreloadReadyRef.current
      ) {
        crossfadingToDesiredTune();
        return;
      }

      if (tuneKey === preloadedTuneKeyRef.current) {
        return;
      }

      preloadedTuneKeyRef.current = tuneKey;
      preloadGenerationRef.current += 1;
      const preloadGeneration = preloadGenerationRef.current;
      isPreloadReadyRef.current = false;

      void settingWorldPlazaAudioScope(
        'world:biome-music',
        buildingWorldPlazaBiomeMusicStarAudioManifestForTuneIds(tuneIds)
      )
        .then(() => {
          if (preloadGeneration !== preloadGenerationRef.current) {
            return;
          }

          isPreloadReadyRef.current = true;
          crossfadingToDesiredTune();
        })
        .catch(() => {
          if (preloadGeneration !== preloadGenerationRef.current) {
            return;
          }

          isPreloadReadyRef.current = false;
        });
    };

    const syncingDesiredBiomeMusic = (): void => {
      const tuneId = resolvingCurrentBiomeTuneId();

      if (!tuneId) {
        return;
      }

      const starAudioId = resolvingWorldPlazaBiomeMusicStarAudioId(tuneId);

      if (
        desiredTuneIdRef.current === tuneId &&
        gettingWorldPlazaMusicBusActiveStarAudioId() === starAudioId
      ) {
        return;
      }

      desiredTuneIdRef.current = tuneId;
      preloadingTunesForBiome(resolvingTuneIdsForCurrentBiome());
    };

    const unlockingAndRetryingBiomeMusic = (): void => {
      if (starAudio.state === 'locked') {
        void starAudio.unlock();
        return;
      }

      applyingMasterMusicVolume();

      const desiredTuneId = desiredTuneIdRef.current;

      if (
        desiredTuneId &&
        gettingWorldPlazaMusicBusActiveStarAudioId() ===
          resolvingWorldPlazaBiomeMusicStarAudioId(desiredTuneId)
      ) {
        return;
      }

      crossfadingToDesiredTune();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingMasterMusicVolume();

      if (gettingWorldPlazaMasterVolume() <= 0) {
        stoppingWorldPlazaMusicBus(
          DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000
        );
        return;
      }

      if (gettingWorldPlazaMusicBusActiveStarAudioId()) {
        return;
      }

      crossfadingToDesiredTune();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterMusicVolume();
      crossfadingToDesiredTune();
    };

    const handlingStarAudioResumed = (): void => {
      applyingMasterMusicVolume();

      if (gettingWorldPlazaMusicBusActiveStarAudioId()) {
        return;
      }

      crossfadingToDesiredTune();
    };

    applyingMasterMusicVolume();
    syncingDesiredBiomeMusic();

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
      void settingWorldPlazaAudioScope('world:biome-music', null);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      desiredTuneIdRef.current = null;
      stickyIsDaytimeRef.current = null;
      stickyDaytimePollCountRef.current = 0;
      isPreloadReadyRef.current = false;
      preloadedTuneKeyRef.current = '';
      preloadGenerationRef.current = 0;
    };
  }, [playerPositionRef]);
}
