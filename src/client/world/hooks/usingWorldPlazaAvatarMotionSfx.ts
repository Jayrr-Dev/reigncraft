'use client';

import { resolvingWorldPlazaSfxClipEntryVolume } from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import { buildingWorldPlazaAvatarMotionSfxStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMotionSfxStarAudioManifest';
import { checkingWorldPlazaGirlSampleAvatarSkinActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarSkinActive';
import { computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume';
import type { DefiningWorldPlazaAvatarMotionSfxEventKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
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
import {
  registeringWorldPlazaAvatarMotionSfxEventListener,
  type NotifyingWorldPlazaAvatarMotionSfxEventPayload,
} from '@/components/world/domains/notifyingWorldPlazaAvatarMotionSfxEvent';
import {
  resolvingWorldPlazaAvatarMotionSfxClipEntry,
  resolvingWorldPlazaAvatarMotionSfxClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarMotionSfxClipId';
import {
  resolvingWorldPlazaAvatarMotionSfxPlaybackDurationS,
  resolvingWorldPlazaAvatarMotionSfxPlaybackRate,
} from '@/components/world/domains/resolvingWorldPlazaAvatarMotionSfxPlayback';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { resolvingFilmcowFootstepSfxStarAudioId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxStarAudioId';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads jump takeoff and roll dodge clips for the girl-sample avatar skin.
 *
 * @module components/world/hooks/usingWorldPlazaAvatarMotionSfx
 */
export function usingWorldPlazaAvatarMotionSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const clipIndexByEventKindRef = useRef<
    Record<DefiningWorldPlazaAvatarMotionSfxEventKind, number>
  >({
    jump_takeoff: 0,
    roll_dodge: 0,
  });

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingMotionSfx = (
      eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
    ): void => {
      if (!checkingWorldPlazaGirlSampleAvatarSkinActive()) {
        return;
      }

      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const clipIndex = clipIndexByEventKindRef.current[eventKind];
      const clipEntry = resolvingWorldPlazaAvatarMotionSfxClipEntry(
        eventKind,
        clipIndex
      );
      const clipId = resolvingWorldPlazaAvatarMotionSfxClipId(
        eventKind,
        clipIndex
      );
      clipIndexByEventKindRef.current[eventKind] = clipIndex + 1;

      const volume = computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume(
        eventKind,
        resolvingWorldPlazaSfxClipEntryVolume(clipEntry)
      );

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingFilmcowFootstepSfxStarAudioId(clipId),
        {
          volume,
          rate: resolvingWorldPlazaAvatarMotionSfxPlaybackRate(eventKind),
          duration:
            resolvingWorldPlazaAvatarMotionSfxPlaybackDurationS(eventKind),
        }
      );
    };

    const handlingMotionSfxEvent = ({
      eventKind,
    }: NotifyingWorldPlazaAvatarMotionSfxEventPayload): void => {
      playingMotionSfx(eventKind);
    };

    const unlockingAndRetryingMotionSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaAvatarMotionSfxStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      applyingMasterSfxVolume
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingMotionSfx
      );
    const unregisterMotionSfxListener =
      registeringWorldPlazaAvatarMotionSfxEventListener(handlingMotionSfxEvent);

    return () => {
      unregisterMotionSfxListener();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      clipIndexByEventKindRef.current = {
        jump_takeoff: 0,
        roll_dodge: 0,
      };
    };
  }, []);
}
