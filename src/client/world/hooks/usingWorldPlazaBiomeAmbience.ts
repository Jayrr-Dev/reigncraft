'use client';

import { buildingWorldPlazaBiomeAmbienceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeAmbienceStarAudioManifest';
import { computingWorldPlazaBiomeAmbienceEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeAmbienceEffectiveTargetVolume';
import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_POLL_INTERVAL_MS,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { resolvingWorldPlazaBiomeAmbienceClipId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceClipId';
import { resolvingWorldPlazaBiomeAmbienceStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceStarAudioId';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import { createStarAudio, type SoundHandle, type StarAudio } from 'star-audio';

/**
 * Loops FilmCow ambience beds that follow the player's current biome.
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
    const starAudio = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const stoppingActiveAmbienceLoop = (): void => {
      activeLoopHandleRef.current?.stop();
      activeLoopHandleRef.current = null;
      activeClipIdRef.current = null;
    };

    const applyingMasterSfxVolume = (): void => {
      const volume = computingWorldPlazaBiomeAmbienceEffectiveTargetVolume();

      if (volume <= 0) {
        stoppingActiveAmbienceLoop();
        return;
      }

      activeLoopHandleRef.current?.setVolume(volume);
    };

    const resolvingCurrentBiomeAmbienceClipId =
      (): DefiningWorldPlazaBiomeAmbienceClipId | null => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return null;
        }

        const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);

        return resolvingWorldPlazaBiomeAmbienceClipId(biome.kind);
      };

    const startingDesiredAmbienceLoop = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      const clipId = desiredClipIdRef.current;
      const volume = computingWorldPlazaBiomeAmbienceEffectiveTargetVolume();

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
      desiredClipIdRef.current = resolvingCurrentBiomeAmbienceClipId();
      startingDesiredAmbienceLoop();
    };

    const unlockingAndRetryingBiomeAmbience = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      startingDesiredAmbienceLoop();
    };

    const handlingSfxVolumeChange = (): void => {
      applyingMasterSfxVolume();
      syncingDesiredBiomeAmbience();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterSfxVolume();
      startingDesiredAmbienceLoop();
    };

    const handlingStarAudioResumed = (): void => {
      startingDesiredAmbienceLoop();
    };

    applyingMasterSfxVolume();
    void starAudio
      .preload(buildingWorldPlazaBiomeAmbienceStarAudioManifest())
      .then(() => {
        isPreloadReadyRef.current = true;
        syncingDesiredBiomeAmbience();
      });

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      handlingSfxVolumeChange
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
      unsubscribeSfxVolume();
      window.clearInterval(intervalId);
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      stoppingActiveAmbienceLoop();
      starAudio.destroy();
      starAudioRef.current = null;
      desiredClipIdRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [playerPositionRef]);
}
