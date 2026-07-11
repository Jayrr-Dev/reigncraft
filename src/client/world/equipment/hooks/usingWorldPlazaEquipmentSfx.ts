'use client';

import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWorldPlazaEquipmentStarAudioManifest } from '@/components/world/equipment/domains/buildingWorldPlazaEquipmentStarAudioManifest';
import { computingWorldPlazaEquipmentSfxEffectiveTargetVolume } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentSfxEffectiveTargetVolume';
import {
  advancingWorldPlazaEquipmentSfxRotationIndex,
  gettingWorldPlazaEquipmentSfxRotationIndex,
  resettingWorldPlazaEquipmentSfxRotationIndex,
} from '@/components/world/equipment/domains/managingWorldPlazaEquipmentSfxRotationStore';
import {
  registeringWorldPlazaEquipmentSfxPlayback,
  type PlayingWorldPlazaEquipmentSfxRequest,
} from '@/components/world/equipment/domains/playingWorldPlazaEquipmentSfx';
import { resolvingWorldPlazaEquipmentSfxClipIdForMilestone } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxClipIdForMilestone';
import { resolvingWorldPlazaEquipmentSfxStarAudioId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxStarAudioId';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Preloads FilmCow equipment hit clips and wires harvest milestone playback.
 *
 * @module components/world/equipment/hooks/usingWorldPlazaEquipmentSfx
 */
export function usingWorldPlazaEquipmentSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingEquipmentHit = ({
      toolActionId,
      milestone,
    }: PlayingWorldPlazaEquipmentSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume = computingWorldPlazaEquipmentSfxEffectiveTargetVolume(
        toolActionId,
        milestone
      );

      if (volume <= 0) {
        return;
      }

      const clipId = resolvingWorldPlazaEquipmentSfxClipIdForMilestone(
        toolActionId,
        milestone,
        gettingWorldPlazaEquipmentSfxRotationIndex(toolActionId)
      );

      starAudio.play(resolvingWorldPlazaEquipmentSfxStarAudioId(clipId), {
        group: 'sfx',
        volume,
      });

      if (milestone === 'final') {
        advancingWorldPlazaEquipmentSfxRotationIndex(toolActionId);
      }
    };

    const unlockingAndRetryingEquipmentSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaEquipmentStarAudioManifest()
    )
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
        unlockingAndRetryingEquipmentSfx
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaEquipmentSfxPlayback(playingEquipmentHit);

    return () => {
      unregisterPlaybackBridge();
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      resettingWorldPlazaEquipmentSfxRotationIndex();
    };
  }, []);
}
