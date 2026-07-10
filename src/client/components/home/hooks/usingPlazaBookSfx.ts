'use client';

import { buildingPlazaBookStarAudioManifest } from '@/components/home/domains/buildingPlazaBookStarAudioManifest';
import { computingPlazaBookSfxEffectiveVolume } from '@/components/home/domains/computingPlazaBookSfxEffectiveVolume';
import { DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION } from '@/components/home/domains/definingPlazaBookSfxConstants';
import {
  registeringPlazaBookSfxPlayback,
  type PlayingPlazaBookSfxRequest,
} from '@/components/home/domains/playingPlazaBookSfx';
import { resolvingPlazaBookSfxStarAudioId } from '@/components/home/domains/resolvingPlazaBookSfxStarAudioId';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import { createStarAudio, type StarAudio } from 'star-audio';

/**
 * Preloads tutorial and lore book clips and wires open/close/page-turn playback.
 *
 * @module components/home/hooks/usingPlazaBookSfx
 */
export function usingPlazaBookSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingBookInteraction = ({
      actionId,
    }: PlayingPlazaBookSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingPlazaBookSfxEffectiveVolume(actionId);

      if (volume <= 0) {
        return;
      }

      const clipId = DEFINING_PLAZA_BOOK_SFX_CLIP_ID_BY_ACTION[actionId];

      starAudio.play(resolvingPlazaBookSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const unlockingAndRetryingBookSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void starAudio
      .preload(buildingPlazaBookStarAudioManifest())
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
      starAudio.destroy();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
