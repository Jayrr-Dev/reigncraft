'use client';

import { buildingPlazaHomeScreenButtonStarAudioManifest } from '@/components/home/domains/buildingPlazaHomeScreenButtonStarAudioManifest';
import { computingPlazaHomeScreenButtonSfxEffectiveVolume } from '@/components/home/domains/computingPlazaHomeScreenButtonSfxEffectiveVolume';
import {
  registeringPlazaHomeScreenButtonSfxPlayback,
  type PlayingPlazaHomeScreenButtonSfxRequest,
} from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { resolvingPlazaHomeScreenButtonSfxStarAudioId } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxStarAudioId';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads home screen button clips and wires chest-close click playback.
 *
 * @module components/home/hooks/usingPlazaHomeScreenButtonSfx
 */
export function usingPlazaHomeScreenButtonSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingButtonInteraction = ({
      clipId,
    }: PlayingPlazaHomeScreenButtonSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingPlazaHomeScreenButtonSfxEffectiveVolume();

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingPlazaHomeScreenButtonSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const unlockingAndRetryingButtonSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingPlazaHomeScreenButtonStarAudioManifest()
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
        unlockingAndRetryingButtonSfx
      );
    const unregisterPlaybackBridge =
      registeringPlazaHomeScreenButtonSfxPlayback(playingButtonInteraction);

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
