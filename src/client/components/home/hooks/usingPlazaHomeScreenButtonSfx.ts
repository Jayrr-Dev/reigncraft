'use client';

import { computingPlazaHomeScreenButtonSfxEffectiveVolume } from '@/components/home/domains/computingPlazaHomeScreenButtonSfxEffectiveVolume';
import type { DefiningPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import {
  registeringPlazaHomeScreenButtonSfxPlayback,
  type PlayingPlazaHomeScreenButtonSfxRequest,
} from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { preloadingPlazaHomeScreenUiSfx } from '@/components/home/domains/preloadingPlazaHomeScreenUiSfx';
import { resolvingPlazaHomeScreenButtonSfxStarAudioId } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxStarAudioId';
import { trackingPlazaDefaultButtonPressSfx } from '@/components/home/domains/trackingPlazaDefaultButtonPressSfx';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useLayoutEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads home screen button clips and wires chest-close click playback.
 *
 * @module components/home/hooks/usingPlazaHomeScreenButtonSfx
 */
export function usingPlazaHomeScreenButtonSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useLayoutEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingButtonClip = (
      clipId: DefiningPlazaHomeScreenButtonSfxClipId
    ): void => {
      const volume = computingPlazaHomeScreenButtonSfxEffectiveVolume();

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingPlazaHomeScreenButtonSfxStarAudioId(clipId),
        { volume }
      );
    };

    const playingButtonInteraction = ({
      clipId,
    }: PlayingPlazaHomeScreenButtonSfxRequest): void => {
      void (async () => {
        if (!isPreloadReadyRef.current) {
          await preloadingPlazaHomeScreenUiSfx();
          isPreloadReadyRef.current = true;
        }

        if (starAudio.state === 'locked') {
          await starAudio.unlock();
        }

        playingButtonClip(clipId);
      })();
    };

    const unlockingAndRetryingButtonSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingPlazaHomeScreenUiSfx().then(() => {
      isPreloadReadyRef.current = true;
    });

    const unsubscribeSfxVolume =
      subscribingWorldPlazaSfxVolume(applyingSfxVolume);
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingButtonSfx
      );
    const unregisterPlaybackBridge =
      registeringPlazaHomeScreenButtonSfxPlayback(playingButtonInteraction);
    const unregisterDefaultButtonPressTracking =
      trackingPlazaDefaultButtonPressSfx();

    return () => {
      unregisterDefaultButtonPressTracking();
      unregisterPlaybackBridge();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
