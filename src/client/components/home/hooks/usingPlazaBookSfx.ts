'use client';

import { computingPlazaBookSfxEffectiveVolume } from '@/components/home/domains/computingPlazaBookSfxEffectiveVolume';
import { DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION } from '@/components/home/domains/definingPlazaBookSfxConstants';
import {
  registeringPlazaBookSfxPlayback,
  type PlayingPlazaBookSfxRequest,
} from '@/components/home/domains/playingPlazaBookSfx';
import { preloadingPlazaHomeScreenUiSfx } from '@/components/home/domains/preloadingPlazaHomeScreenUiSfx';
import { resolvingPlazaBookSfxStarAudioId } from '@/components/home/domains/resolvingPlazaBookSfxStarAudioId';
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
 * Preloads tutorial and lore book clips and wires open/close/page-turn playback.
 *
 * @module components/home/hooks/usingPlazaBookSfx
 */
export function usingPlazaBookSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useLayoutEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingBookInteraction = ({
      actionId,
    }: PlayingPlazaBookSfxRequest): void => {
      void (async () => {
        if (!isPreloadReadyRef.current) {
          await preloadingPlazaHomeScreenUiSfx();
          isPreloadReadyRef.current = true;
        }

        if (starAudio.state === 'locked') {
          await starAudio.unlock();
        }

        const volume = computingPlazaBookSfxEffectiveVolume(actionId);

        if (volume <= 0) {
          return;
        }

        const clipId = DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION[actionId];

        playingWorldPlazaStarAudioSfx(
          resolvingPlazaBookSfxStarAudioId(clipId),
          {
            volume,
          }
        );
      })();
    };

    const unlockingAndRetryingBookSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingPlazaHomeScreenUiSfx()
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
        unlockingAndRetryingBookSfx
      );
    const unregisterPlaybackBridge = registeringPlazaBookSfxPlayback(
      playingBookInteraction
    );

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
