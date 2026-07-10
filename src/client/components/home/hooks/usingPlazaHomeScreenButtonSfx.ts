'use client';

import { computingPlazaHomeScreenButtonSfxEffectiveVolume } from '@/components/home/domains/computingPlazaHomeScreenButtonSfxEffectiveVolume';
import type { DefiningPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import {
  registeringPlazaHomeScreenButtonSfxPlayback,
  type PlayingPlazaHomeScreenButtonSfxRequest,
} from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import {
  checkingPlazaHomeScreenButtonSfxPreloadReady,
  preloadingPlazaHomeScreenButtonSfx,
} from '@/components/home/domains/preloadingPlazaHomeScreenButtonSfx';
import { resolvingPlazaHomeScreenButtonSfxStarAudioId } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxStarAudioId';
import { trackingPlazaDefaultButtonPressSfx } from '@/components/home/domains/trackingPlazaDefaultButtonPressSfx';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
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
  const isPreloadReadyRef = useRef(
    checkingPlazaHomeScreenButtonSfxPreloadReady()
  );
  const pendingButtonClipIdRef =
    useRef<DefiningPlazaHomeScreenButtonSfxClipId | null>(null);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingButtonClip = (
      clipId: DefiningPlazaHomeScreenButtonSfxClipId
    ): void => {
      const volume = computingPlazaHomeScreenButtonSfxEffectiveVolume();

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingPlazaHomeScreenButtonSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const attemptingPendingButtonClip = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      const pendingClipId = pendingButtonClipIdRef.current;
      if (!pendingClipId || starAudio.state === 'locked') {
        return;
      }

      pendingButtonClipIdRef.current = null;
      playingButtonClip(pendingClipId);
    };

    const playingButtonInteraction = ({
      clipId,
    }: PlayingPlazaHomeScreenButtonSfxRequest): void => {
      if (!isPreloadReadyRef.current) {
        pendingButtonClipIdRef.current = clipId;
        return;
      }

      if (starAudio.state === 'locked') {
        pendingButtonClipIdRef.current = clipId;
        void starAudio.unlock();
        return;
      }

      playingButtonClip(clipId);
    };

    const unlockingAndRetryingButtonSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
      attemptingPendingButtonClip();
    };

    const handlingStarAudioUnlocked = (): void => {
      attemptingPendingButtonClip();
    };

    applyingSfxVolume();
    void preloadingPlazaHomeScreenButtonSfx().then(() => {
      isPreloadReadyRef.current = true;
      attemptingPendingButtonClip();
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

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioUnlocked);

    return () => {
      unregisterDefaultButtonPressTracking();
      unregisterPlaybackBridge();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioUnlocked);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      pendingButtonClipIdRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
