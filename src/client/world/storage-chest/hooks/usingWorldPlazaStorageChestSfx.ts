'use client';

import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';
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
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWorldPlazaStorageChestStarAudioManifest } from '@/components/world/storage-chest/domains/buildingWorldPlazaStorageChestStarAudioManifest';
import { computingWorldPlazaStorageChestSfxEffectiveVolume } from '@/components/world/storage-chest/domains/computingWorldPlazaStorageChestSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_CLIP_ID_BY_ACTION } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';
import {
  registeringWorldPlazaStorageChestSfxPlayback,
  type PlayingWorldPlazaStorageChestSfxRequest,
} from '@/components/world/storage-chest/domains/playingWorldPlazaStorageChestSfx';
import { resolvingWorldPlazaStorageChestSfxStarAudioId } from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestSfxStarAudioId';
import { useEffect, useRef } from 'react';

/**
 * Preloads storage chest lid clips and wires open/close playback.
 *
 * @module components/world/storage-chest/hooks/usingWorldPlazaStorageChestSfx
 */
export function usingWorldPlazaStorageChestSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingChestLid = ({
      actionId,
    }: PlayingWorldPlazaStorageChestSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume =
        computingWorldPlazaStorageChestSfxEffectiveVolume(actionId);

      if (volume <= 0) {
        return;
      }

      const clipId =
        DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_CLIP_ID_BY_ACTION[actionId];

      playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaStorageChestSfxStarAudioId(clipId),
        { volume }
      );
    };

    const unlockingAndRetryingChestSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaStorageChestStarAudioManifest()
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
        unlockingAndRetryingChestSfx
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaStorageChestSfxPlayback(playingChestLid);

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
