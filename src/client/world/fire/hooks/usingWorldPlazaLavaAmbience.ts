'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaAmbienceVolumeStoreFromStorage,
  subscribingWorldPlazaAmbienceVolume,
} from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
  updatingWorldPlazaStarAudioActiveSfxPlayVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWorldPlazaLavaAmbienceStarAudioManifest } from '@/components/world/fire/domains/buildingWorldPlazaLavaAmbienceStarAudioManifest';
import { computingWorldPlazaLavaAmbienceEffectiveVolume } from '@/components/world/fire/domains/computingWorldPlazaLavaAmbienceEffectiveVolume';
import { DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_POLL_INTERVAL_MS } from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';
import { resolvingWorldPlazaLavaAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceStarAudioId';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_CLIP_ID = 'crackle' as const;

/**
 * Loops fire crackle ambience near procedural and ruin lava tiles.
 *
 * @module components/world/fire/hooks/usingWorldPlazaLavaAmbience
 */
export function usingWorldPlazaLavaAmbience(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const loopHandleRef = useRef<SoundHandle | null>(null);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaAmbienceVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const stoppingLavaAmbienceLoop = (): void => {
      loopHandleRef.current?.stop();
      loopHandleRef.current = null;
    };

    const syncingLavaAmbienceLoop = (): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWorldPlazaLavaAmbienceEffectiveVolume(
        playerPositionRef.current
      );

      if (volume <= 0) {
        stoppingLavaAmbienceLoop();
        return;
      }

      const loopHandle = loopHandleRef.current;

      if (!loopHandle) {
        loopHandleRef.current = playingWorldPlazaStarAudioSfx(
          resolvingWorldPlazaLavaAmbienceStarAudioId(
            DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_CLIP_ID
          ),
          {
            loop: true,
            volume,
          }
        );
        return;
      }

      updatingWorldPlazaStarAudioActiveSfxPlayVolume(loopHandle, volume);
    };

    const unlockingAndRetryingLavaAmbience = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      syncingLavaAmbienceLoop();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterSfxVolume();
      syncingLavaAmbienceLoop();
    };

    const handlingStarAudioResumed = (): void => {
      syncingLavaAmbienceLoop();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaLavaAmbienceStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
        syncingLavaAmbienceLoop();
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unsubscribeAmbienceVolume = subscribingWorldPlazaAmbienceVolume(
      syncingLavaAmbienceLoop
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingLavaAmbience
      );

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingLavaAmbienceLoop,
      DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
      unregisterUserGestureUnlock();
      unsubscribeAmbienceVolume();
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      stoppingLavaAmbienceLoop();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [playerPositionRef]);
}
