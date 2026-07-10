'use client';

import { buildingWorldPlazaBiomeAmbienceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeAmbienceStarAudioManifest';
import { computingWorldPlazaBiomeAmbiencePlayback } from '@/components/world/domains/computingWorldPlazaBiomeAmbiencePlayback';
import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_POLL_INTERVAL_MS,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaAmbienceVolumeStoreFromStorage,
  subscribingWorldPlazaAmbienceVolume,
} from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaBiomeAmbienceStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceStarAudioId';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from 'star-audio';

/**
 * Loops biome and flowing-water ambience beds that follow the player.
 *
 * @module components/world/hooks/usingWorldPlazaBiomeAmbience
 */
export function usingWorldPlazaBiomeAmbience(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const desiredClipIdRef = useRef<DefiningWorldPlazaBiomeAmbienceClipId | null>(
    null
  );
  const activeClipIdRef = useRef<DefiningWorldPlazaBiomeAmbienceClipId | null>(
    null
  );
  const activeLoopHandleRef = useRef<SoundHandle | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaAmbienceVolumeStoreFromStorage();

    const stoppingActiveAmbienceLoop = (): void => {
      activeLoopHandleRef.current?.stop();
      activeLoopHandleRef.current = null;
      activeClipIdRef.current = null;
    };

    const resolvingCurrentAmbiencePlayback = () => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return null;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);

      return computingWorldPlazaBiomeAmbiencePlayback(
        biome.kind,
        playerPosition
      );
    };

    const startingDesiredAmbienceLoop = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      const playback = resolvingCurrentAmbiencePlayback();
      const clipId = playback?.clipId ?? null;
      const volume = playback?.volume ?? 0;

      desiredClipIdRef.current = clipId;

      if (!clipId || volume <= 0) {
        stoppingActiveAmbienceLoop();
        return;
      }

      if (starAudio.state === 'locked') {
        return;
      }

      if (activeClipIdRef.current === clipId && activeLoopHandleRef.current) {
        activeLoopHandleRef.current.setVolume(volume);
        return;
      }

      stoppingActiveAmbienceLoop();

      const handle = starAudio.play(
        resolvingWorldPlazaBiomeAmbienceStarAudioId(clipId),
        {
          group: 'sfx',
          loop: true,
          volume,
        }
      );

      if (!handle) {
        return;
      }

      activeLoopHandleRef.current = handle;
      activeClipIdRef.current = clipId;
    };

    const syncingDesiredBiomeAmbience = (): void => {
      startingDesiredAmbienceLoop();
    };

    const unlockingAndRetryingBiomeAmbience = (): void => {
      void starAudio.unlock();
      startingDesiredAmbienceLoop();
    };

    const handlingAmbienceVolumeChange = (): void => {
      syncingDesiredBiomeAmbience();
    };

    const handlingStarAudioUnlocked = (): void => {
      startingDesiredAmbienceLoop();
    };

    const handlingStarAudioResumed = (): void => {
      startingDesiredAmbienceLoop();
    };

    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaBiomeAmbienceStarAudioManifest()
    ).then(() => {
      isPreloadReadyRef.current = true;
      syncingDesiredBiomeAmbience();
    });

    const unsubscribeAmbienceVolume = subscribingWorldPlazaAmbienceVolume(
      handlingAmbienceVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingBiomeAmbience
      );

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingDesiredBiomeAmbience,
      DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_POLL_INTERVAL_MS
    );

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeAmbienceVolume();
      window.clearInterval(intervalId);
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      stoppingActiveAmbienceLoop();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      desiredClipIdRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [playerPositionRef]);
}
