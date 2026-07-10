'use client';

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
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWorldPlazaCampfireAmbienceStarAudioManifest } from '@/components/world/fire/domains/buildingWorldPlazaCampfireAmbienceStarAudioManifest';
import { computingWorldPlazaCampfireAmbienceEffectiveVolume } from '@/components/world/fire/domains/computingWorldPlazaCampfireAmbienceEffectiveVolume';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_POLL_INTERVAL_MS } from '@/components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants';
import { resolvingWorldPlazaCampfireAmbienceStarAudioId } from '@/components/world/fire/domains/resolvingWorldPlazaCampfireAmbienceStarAudioId';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from 'star-audio';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_CLIP_ID = 'bonfire' as const;

/**
 * Loops bonfire crackle ambience near lit campfires with distance falloff.
 *
 * @module components/world/fire/hooks/usingWorldPlazaCampfireAmbience
 */
export function usingWorldPlazaCampfireAmbience(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>,
  fireCellsRef: React.RefObject<readonly WorldFireDevvitCell[]>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const loopHandleRef = useRef<SoundHandle | null>(null);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaAmbienceVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const stoppingCampfireAmbienceLoop = (): void => {
      loopHandleRef.current?.stop();
      loopHandleRef.current = null;
    };

    const syncingCampfireAmbienceLoop = (): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWorldPlazaCampfireAmbienceEffectiveVolume(
        playerPositionRef.current,
        fireCellsRef.current ?? []
      );

      if (volume <= 0) {
        stoppingCampfireAmbienceLoop();
        return;
      }

      const loopHandle = loopHandleRef.current;

      if (!loopHandle) {
        loopHandleRef.current = starAudio.play(
          resolvingWorldPlazaCampfireAmbienceStarAudioId(
            DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_CLIP_ID
          ),
          {
            group: 'sfx',
            loop: true,
            volume,
          }
        );
        return;
      }

      loopHandle.setVolume(volume);
    };

    const unlockingAndRetryingCampfireAmbience = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      syncingCampfireAmbienceLoop();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterSfxVolume();
      syncingCampfireAmbienceLoop();
    };

    const handlingStarAudioResumed = (): void => {
      syncingCampfireAmbienceLoop();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaCampfireAmbienceStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
        syncingCampfireAmbienceLoop();
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unsubscribeAmbienceVolume = subscribingWorldPlazaAmbienceVolume(
      syncingCampfireAmbienceLoop
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingCampfireAmbience
      );

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingCampfireAmbienceLoop,
      DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
      unregisterUserGestureUnlock();
      unsubscribeAmbienceVolume();
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      stoppingCampfireAmbienceLoop();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [fireCellsRef, playerPositionRef]);
}
