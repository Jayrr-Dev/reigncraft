'use client';

import { resolvingWorldPlazaSfxClipEntryVolume } from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import { buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest';
import { buildingWorldPlazaAvatarMotionSfxStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMotionSfxStarAudioManifest';
import { checkingWorldPlazaGirlSampleAvatarSkinActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarSkinActive';
import { computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaAvatarMotionSfxEffectiveTargetVolume';
import type { DefiningWorldPlazaAvatarMotionSfxEventKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  subscribingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
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
import { notifyingWorldPlazaGirlSampleVoiceSfxEvent } from '@/components/world/domains/notifyingWorldPlazaGirlSampleVoiceSfxEvent';
import { playingWorldPlazaAnimalAvatarSpeciesSfx } from '@/components/world/domains/playingWorldPlazaAnimalAvatarSpeciesSfx';
import { resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
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
 * Preloads jump/roll clips and plays girl FilmCow or animal species vocals.
 *
 * @module components/world/hooks/usingWorldPlazaAvatarMotionSfx
 */
export function usingWorldPlazaAvatarMotionSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const filmcowClipIndexByEventKindRef = useRef<
    Record<DefiningWorldPlazaAvatarMotionSfxEventKind, number>
  >({
    jump_takeoff: 0,
    roll_dodge: 0,
  });
  const speciesVocalRotationIndexByActionRef = useRef<
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

    const preloadingMotionAndSpeciesSfx = (skinId: string): void => {
      void preloadingWorldPlazaStarAudioManifest({
        ...buildingWorldPlazaAvatarMotionSfxStarAudioManifest(),
        ...buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest(skinId),
      })
        .then(() => {
          isPreloadReadyRef.current = true;
        })
        .catch(() => {
          isPreloadReadyRef.current = false;
        });
    };

    const playingFilmcowMotionSfx = (
      eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
    ): void => {
      const clipIndex = filmcowClipIndexByEventKindRef.current[eventKind];
      const clipEntry = resolvingWorldPlazaAvatarMotionSfxClipEntry(
        eventKind,
        clipIndex
      );
      const clipId = resolvingWorldPlazaAvatarMotionSfxClipId(
        eventKind,
        clipIndex
      );
      filmcowClipIndexByEventKindRef.current[eventKind] = clipIndex + 1;

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

    const playingMotionSfx = (
      eventKind: DefiningWorldPlazaAvatarMotionSfxEventKind
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const skinId = gettingWorldPlazaSelectedAvatarSkinId();
      const speciesId =
        resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId(skinId);

      if (speciesId) {
        const playback = playingWorldPlazaAnimalAvatarSpeciesSfx({
          speciesId,
          action: eventKind,
          rotationIndex:
            speciesVocalRotationIndexByActionRef.current[eventKind],
        });
        speciesVocalRotationIndexByActionRef.current[eventKind] =
          playback.nextRotationIndex;

        if (playback.played) {
          return;
        }
      }

      if (!checkingWorldPlazaGirlSampleAvatarSkinActive() && !speciesId) {
        return;
      }

      if (checkingWorldPlazaGirlSampleAvatarSkinActive()) {
        notifyingWorldPlazaGirlSampleVoiceSfxEvent({ eventKind });
      }

      playingFilmcowMotionSfx(eventKind);
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
    preloadingMotionAndSpeciesSfx(gettingWorldPlazaSelectedAvatarSkinId());

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      applyingMasterSfxVolume
    );
    const unsubscribeAvatarSkin = subscribingWorldPlazaSelectedAvatarSkin(
      () => {
        preloadingMotionAndSpeciesSfx(gettingWorldPlazaSelectedAvatarSkinId());
      }
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
      unsubscribeAvatarSkin();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      filmcowClipIndexByEventKindRef.current = {
        jump_takeoff: 0,
        roll_dodge: 0,
      };
      speciesVocalRotationIndexByActionRef.current = {
        jump_takeoff: 0,
        roll_dodge: 0,
      };
    };
  }, []);
}
