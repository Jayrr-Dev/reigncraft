'use client';

import { computingPlazaHomeScreenButtonSfxEffectiveVolume } from '@/components/home/domains/computingPlazaHomeScreenButtonSfxEffectiveVolume';
import type { DefiningPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/definingPlazaHomeScreenButtonSfxConstants';
import {
  registeringPlazaHomeScreenButtonSfxPlayback,
  type PlayingPlazaHomeScreenButtonSfxRequest,
} from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { preloadingPlazaHomeScreenUiSfx } from '@/components/home/domains/preloadingPlazaHomeScreenUiSfx';
import { schedulingPlazaHomeScreenIdlePreload } from '@/components/home/domains/schedulingPlazaHomeScreenIdlePreload';
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
import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

export type UsingPlazaHomeScreenButtonSfxOptions = {
  /**
   * When true, capture every button click for the default chest-close clip
   * (or a declared custom / silent kind).
   */
  readonly trackDefaultButtonPresses?: boolean;
  /**
   * Volume scale for tracked default chest-close presses.
   * Home keeps `1`; in-world HUD uses the quieter world UI multiplier.
   */
  readonly defaultButtonPressVolumeMultiplier?: number;
};

/**
 * Preloads home screen button clips and wires chest-close click playback.
 *
 * @module components/home/hooks/usingPlazaHomeScreenButtonSfx
 */
export function usingPlazaHomeScreenButtonSfx(
  options: UsingPlazaHomeScreenButtonSfxOptions = {}
): void {
  const trackDefaultButtonPresses = options.trackDefaultButtonPresses ?? true;
  const defaultButtonPressVolumeMultiplier =
    options.defaultButtonPressVolumeMultiplier ?? 1;
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
      clipId: DefiningPlazaHomeScreenButtonSfxClipId,
      volumeMultiplier = 1
    ): void => {
      const volume =
        computingPlazaHomeScreenButtonSfxEffectiveVolume(volumeMultiplier);

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
      volumeMultiplier = 1,
    }: PlayingPlazaHomeScreenButtonSfxRequest): void => {
      void (async () => {
        if (!isPreloadReadyRef.current) {
          await preloadingPlazaHomeScreenUiSfx();
          isPreloadReadyRef.current = true;
        }

        if (starAudio.state === 'locked') {
          await starAudio.unlock();
        }

        playingButtonClip(clipId, volumeMultiplier);
      })();
    };

    const unlockingAndRetryingButtonSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    // Idle-deferred so clip fetches never compete with home first paint;
    // playingButtonInteraction awaits the same preload on early clicks.
    schedulingPlazaHomeScreenIdlePreload(() => {
      void preloadingPlazaHomeScreenUiSfx().then(() => {
        isPreloadReadyRef.current = true;
      });
    });

    const unsubscribeSfxVolume =
      subscribingWorldPlazaSfxVolume(applyingSfxVolume);
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingButtonSfx
      );
    const unregisterPlaybackBridge =
      registeringPlazaHomeScreenButtonSfxPlayback(playingButtonInteraction);
    const unregisterDefaultButtonPressTracking = trackDefaultButtonPresses
      ? trackingPlazaDefaultButtonPressSfx({
          volumeMultiplier: defaultButtonPressVolumeMultiplier,
        })
      : () => {};

    return () => {
      unregisterDefaultButtonPressTracking();
      unregisterPlaybackBridge();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, [defaultButtonPressVolumeMultiplier, trackDefaultButtonPresses]);
}
