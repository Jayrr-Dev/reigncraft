'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeOmegaWolfStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeOmegaWolfStarAudioManifest';
import { computingWildlifeOmegaWolfSfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeOmegaWolfSfxEffectiveVolume';
import type { DefiningWildlifeOmegaWolfSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import {
  advancingWildlifeOmegaWolfSfxRotationIndex,
  gettingWildlifeOmegaWolfSfxRotationIndex,
  resettingWildlifeOmegaWolfSfxRotationIndices,
} from '@/components/world/wildlife/domains/managingWildlifeOmegaWolfSfxRotationStore';
import {
  registeringWildlifeOmegaWolfSfxEventListener,
  type NotifyingWildlifeOmegaWolfSfxEventPayload,
} from '@/components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent';
import {
  resolvingWildlifeOmegaWolfSfxClipId,
  resolvingWildlifeOmegaWolfSfxClipPoolLength,
} from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxClipId';
import { resolvingWildlifeOmegaWolfSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxStarAudioId';
import { useEffect, useRef } from 'react';
import { createStarAudio, type StarAudio } from 'star-audio';

type DefiningWildlifeOmegaWolfSfxRotationEventKind = Extract<
  NotifyingWildlifeOmegaWolfSfxEventPayload['eventKind'],
  'howl' | 'chase_call' | 'territory_warn' | 'hit_taken'
>;

function checkingWildlifeOmegaWolfSfxEventUsesRotationPool(
  eventKind: NotifyingWildlifeOmegaWolfSfxEventPayload['eventKind']
): eventKind is DefiningWildlifeOmegaWolfSfxRotationEventKind {
  return (
    eventKind === 'howl' ||
    eventKind === 'chase_call' ||
    eventKind === 'territory_warn' ||
    eventKind === 'hit_taken'
  );
}

/**
 * Preloads Omega Wolf clips and plays them for wildlife simulation events.
 *
 * @module components/world/wildlife/hooks/usingWildlifeOmegaWolfSfx
 */
export function usingWildlifeOmegaWolfSfx(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingClip = (
      clipId: DefiningWildlifeOmegaWolfSfxClipId,
      volume: number
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingWildlifeOmegaWolfSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const handlingOmegaWolfSfxEvent = ({
      eventKind,
      worldPoint,
    }: NotifyingWildlifeOmegaWolfSfxEventPayload): void => {
      const listenerPoint = playerPositionRef.current;
      const volume = computingWildlifeOmegaWolfSfxEffectiveVolume(
        eventKind,
        worldPoint,
        listenerPoint
      );

      if (volume <= 0) {
        return;
      }

      const poolLength = resolvingWildlifeOmegaWolfSfxClipPoolLength(eventKind);
      const rotationIndex = checkingWildlifeOmegaWolfSfxEventUsesRotationPool(
        eventKind
      )
        ? gettingWildlifeOmegaWolfSfxRotationIndex(eventKind)
        : 0;
      const clipId = resolvingWildlifeOmegaWolfSfxClipId(
        eventKind,
        rotationIndex
      );

      playingClip(clipId, volume);

      if (checkingWildlifeOmegaWolfSfxEventUsesRotationPool(eventKind)) {
        advancingWildlifeOmegaWolfSfxRotationIndex(eventKind, poolLength);
      }
    };

    const unlockingAndRetryingOmegaWolfSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
    };

    applyingMasterSfxVolume();
    void starAudio
      .preload(buildingWildlifeOmegaWolfStarAudioManifest())
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingOmegaWolfSfx
      );
    const unregisterEventListener =
      registeringWildlifeOmegaWolfSfxEventListener(handlingOmegaWolfSfxEvent);

    return () => {
      unregisterEventListener();
      unregisterUserGestureUnlock();
      starAudio.destroy();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      resettingWildlifeOmegaWolfSfxRotationIndices();
    };
  }, [playerPositionRef]);
}
