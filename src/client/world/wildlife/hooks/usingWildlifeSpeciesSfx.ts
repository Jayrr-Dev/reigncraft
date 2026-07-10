'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeFarmAnimalStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeFarmAnimalStarAudioManifest';
import { computingWildlifeSpeciesSfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeSpeciesSfxEffectiveVolume';
import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import { checkingWildlifeSpeciesSfxEventEnabled } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import {
  advancingWildlifeSpeciesSfxRotationIndex,
  gettingWildlifeSpeciesSfxRotationIndex,
  resettingWildlifeSpeciesSfxRotationIndices,
} from '@/components/world/wildlife/domains/managingWildlifeSpeciesSfxRotationStore';
import {
  registeringWildlifeSpeciesSfxEventListener,
  type NotifyingWildlifeSpeciesSfxEventPayload,
} from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent';
import {
  resolvingWildlifeSpeciesSfxClipId,
  resolvingWildlifeSpeciesSfxClipPoolLength,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads farm animal clips and plays them for wildlife simulation events.
 *
 * @module components/world/wildlife/hooks/usingWildlifeSpeciesSfx
 */
export function usingWildlifeSpeciesSfx(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      starAudio.setSfxVolume(1);
    };

    const playingClip = (
      clipId: DefiningWildlifeSpeciesSfxClipId,
      volume: number
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingWildlifeSpeciesSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });
    };

    const handlingSpeciesSfxEvent = ({
      speciesId,
      eventKind,
      worldPoint,
    }: NotifyingWildlifeSpeciesSfxEventPayload): void => {
      if (!checkingWildlifeSpeciesSfxEventEnabled(speciesId, eventKind)) {
        return;
      }

      const listenerPoint = playerPositionRef.current;
      const volume = computingWildlifeSpeciesSfxEffectiveVolume(
        speciesId,
        eventKind,
        worldPoint,
        listenerPoint
      );

      if (volume <= 0) {
        return;
      }

      const poolLength = resolvingWildlifeSpeciesSfxClipPoolLength(
        speciesId,
        eventKind
      );

      if (poolLength <= 0) {
        return;
      }

      const rotationIndex = gettingWildlifeSpeciesSfxRotationIndex(
        speciesId,
        eventKind
      );
      const clipId = resolvingWildlifeSpeciesSfxClipId(
        speciesId,
        eventKind,
        rotationIndex
      );

      if (clipId === null) {
        return;
      }

      playingClip(clipId, volume);
      advancingWildlifeSpeciesSfxRotationIndex(
        speciesId,
        eventKind,
        poolLength
      );
    };

    const unlockingAndRetryingSpeciesSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWildlifeFarmAnimalStarAudioManifest()
    )
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingSpeciesSfx
      );
    const unregisterEventListener = registeringWildlifeSpeciesSfxEventListener(
      handlingSpeciesSfxEvent
    );

    return () => {
      unregisterEventListener();
      unregisterUserGestureUnlock();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      resettingWildlifeSpeciesSfxRotationIndices();
    };
  }, [playerPositionRef]);
}
