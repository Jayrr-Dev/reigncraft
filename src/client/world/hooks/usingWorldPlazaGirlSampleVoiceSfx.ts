'use client';

import { buildingWorldPlazaGirlSampleVoiceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaGirlSampleVoiceStarAudioManifest';
import { checkingWorldPlazaGirlSampleAvatarSkinActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarSkinActive';
import { computingWorldPlazaGirlSampleVoiceSfxEffectiveVolume } from '@/components/world/domains/computingWorldPlazaGirlSampleVoiceSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_COOLDOWN_MS,
  type DefiningWorldPlazaGirlSampleVoiceClipId,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import {
  advancingWorldPlazaGirlSampleVoiceSfxRotationIndex,
  gettingWorldPlazaGirlSampleVoiceSfxRotationIndex,
  resettingWorldPlazaGirlSampleVoiceSfxRotationIndices,
} from '@/components/world/domains/managingWorldPlazaGirlSampleVoiceSfxRotationStore';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import {
  registeringWorldPlazaGirlSampleVoiceSfxEventListener,
  type NotifyingWorldPlazaGirlSampleVoiceSfxEventPayload,
} from '@/components/world/domains/notifyingWorldPlazaGirlSampleVoiceSfxEvent';
import {
  resolvingWorldPlazaGirlSampleVoiceSfxClipId,
  resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength,
} from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxClipId';
import { resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId } from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads girl voice clips and plays them for girl-sample avatar events.
 *
 * @module components/world/hooks/usingWorldPlazaGirlSampleVoiceSfx
 */
export function usingWorldPlazaGirlSampleVoiceSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const lastPlayedAtMsRef = useRef<number>(0);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingClip = (
      clipId: DefiningWorldPlazaGirlSampleVoiceClipId,
      volume: number
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaGirlSampleVoiceSfxStarAudioId(clipId),
        { volume }
      );
    };

    const handlingGirlSampleVoiceSfxEvent = ({
      eventKind,
    }: NotifyingWorldPlazaGirlSampleVoiceSfxEventPayload): void => {
      if (!checkingWorldPlazaGirlSampleAvatarSkinActive()) {
        return;
      }

      const nowMs = performance.now();

      if (
        nowMs - lastPlayedAtMsRef.current <
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_COOLDOWN_MS
      ) {
        return;
      }

      const poolLength =
        resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength(eventKind);
      const rotationIndex =
        gettingWorldPlazaGirlSampleVoiceSfxRotationIndex(eventKind);
      const clipId = resolvingWorldPlazaGirlSampleVoiceSfxClipId(
        eventKind,
        rotationIndex
      );
      const volume =
        computingWorldPlazaGirlSampleVoiceSfxEffectiveVolume(eventKind);

      if (volume <= 0) {
        return;
      }

      playingClip(clipId, volume);
      advancingWorldPlazaGirlSampleVoiceSfxRotationIndex(eventKind, poolLength);
      lastPlayedAtMsRef.current = nowMs;
    };

    const unlockingAndRetryingGirlSampleVoiceSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaGirlSampleVoiceStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingGirlSampleVoiceSfx
      );
    const unregisterEventListener =
      registeringWorldPlazaGirlSampleVoiceSfxEventListener(
        handlingGirlSampleVoiceSfxEvent
      );

    return () => {
      unregisterEventListener();
      unregisterUserGestureUnlock();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      lastPlayedAtMsRef.current = 0;
      resettingWorldPlazaGirlSampleVoiceSfxRotationIndices();
    };
  }, []);
}
