'use client';

import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import { buildingWorldPlazaDeathStarAudioManifest } from '@/components/world/audio/lifecycle/buildingWorldPlazaDeathStarAudioManifest';
import { computingWorldPlazaDeathSfxEffectiveVolume } from '@/components/world/audio/lifecycle/computingWorldPlazaDeathSfxEffectiveVolume';
import { registeringWorldPlazaDeathSfxPlayback } from '@/components/world/audio/lifecycle/playingWorldPlazaDeathSfx';
import { resolvingWorldPlazaDeathSfxStarAudioId } from '@/components/world/audio/lifecycle/resolvingWorldPlazaDeathSfxStarAudioId';
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
import { useEffect, useRef } from 'react';

/**
 * Preloads the player-death impact boom and wires lifecycle playback.
 *
 * @module components/world/audio/lifecycle/usingWorldPlazaDeathSfx
 */
export function usingWorldPlazaDeathSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingDeathImpact = (): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWorldPlazaDeathSfxEffectiveVolume();

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaDeathSfxStarAudioId('impact_boom'),
        { volume }
      );
    };

    const unlockingAndRetryingDeathSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaDeathStarAudioManifest()
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
        unlockingAndRetryingDeathSfx
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaDeathSfxPlayback(playingDeathImpact);

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
