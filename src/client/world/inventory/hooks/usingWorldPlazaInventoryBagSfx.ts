'use client';

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
import { buildingWorldPlazaInventoryBagStarAudioManifest } from '@/components/world/inventory/domains/buildingWorldPlazaInventoryBagStarAudioManifest';
import { computingWorldPlazaInventoryBagSfxEffectiveVolume } from '@/components/world/inventory/domains/computingWorldPlazaInventoryBagSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';
import {
  registeringWorldPlazaInventoryBagSfxPlayback,
  type PlayingWorldPlazaInventoryBagSfxRequest,
} from '@/components/world/inventory/domains/playingWorldPlazaInventoryBagSfx';
import { resolvingWorldPlazaInventoryBagSfxStarAudioId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagSfxStarAudioId';
import { useEffect, useRef } from 'react';
import type { StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Preloads inventory pickup/drop/move clips and wires grant, rearrange, and drop playback.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaInventoryBagSfx
 */
export function usingWorldPlazaInventoryBagSfx(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingBagInteraction = ({
      actionId,
    }: PlayingWorldPlazaInventoryBagSfxRequest): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      const volume =
        computingWorldPlazaInventoryBagSfxEffectiveVolume(actionId);

      if (volume <= 0) {
        return;
      }

      const clipId =
        DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION[actionId];

      playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaInventoryBagSfxStarAudioId(clipId),
        { volume }
      );
    };

    const unlockingAndRetryingBagSfx = (): void => {
      void starAudio.unlock();
      applyingSfxVolume();
    };

    applyingSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaInventoryBagStarAudioManifest()
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
        unlockingAndRetryingBagSfx
      );
    const unregisterPlaybackBridge =
      registeringWorldPlazaInventoryBagSfxPlayback(playingBagInteraction);

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
