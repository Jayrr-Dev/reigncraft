'use client';

import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWorldPlazaFishingStarAudioManifest } from '@/components/world/fishing/domains/buildingWorldPlazaFishingStarAudioManifest';
import {
  playingWorldPlazaFishingSfxFromRequest,
  registeringWorldPlazaFishingSfxPlayback,
  type PlayingWorldPlazaFishingSfxRequest,
} from '@/components/world/fishing/domains/playingWorldPlazaFishingSfx';
import { useEffect, useRef } from 'react';

/**
 * Preloads fishing cast / catch clips and wires playback requests.
 *
 * @module components/world/fishing/hooks/usingWorldPlazaFishingSfx
 */
export function usingWorldPlazaFishingSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingFishingSfx = (request: PlayingWorldPlazaFishingSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      playingWorldPlazaFishingSfxFromRequest(request);
    };

    const unlockingAndRetryingFishingSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaFishingStarAudioManifest()
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
        unlockingAndRetryingFishingSfx
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaFishingSfxPlayback(playingFishingSfx);

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
