'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
  updatingWorldPlazaStarAudioActiveSfxPlayVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeOmegaWolfStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeOmegaWolfStarAudioManifest';
import { computingWildlifeOmegaWolfSfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeOmegaWolfSfxEffectiveVolume';
import {
  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_SPATIAL_POLL_INTERVAL_MS,
  type DefiningWildlifeOmegaWolfSfxClipId,
  type DefiningWildlifeOmegaWolfSfxEventKind,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import { DEFINING_WILDLIFE_OMEGA_WOLF_SFX_EVENT_PRIORITY } from '@/components/world/wildlife/domains/definingWildlifeVocalSfxConcurrency';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  advancingWildlifeOmegaWolfSfxRotationIndex,
  gettingWildlifeOmegaWolfSfxRotationIndex,
  resettingWildlifeOmegaWolfSfxRotationIndices,
} from '@/components/world/wildlife/domains/managingWildlifeOmegaWolfSfxRotationStore';
import { registeringWildlifeInstanceVocalSfxSilenceListener } from '@/components/world/wildlife/domains/notifyingWildlifeInstanceVocalSfxSilence';
import {
  registeringWildlifeOmegaWolfSfxEventListener,
  type NotifyingWildlifeOmegaWolfSfxEventPayload,
} from '@/components/world/wildlife/domains/notifyingWildlifeOmegaWolfSfxEvent';
import {
  resolvingWildlifeOmegaWolfSfxClipId,
  resolvingWildlifeOmegaWolfSfxClipPoolLength,
} from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxClipId';
import { resolvingWildlifeOmegaWolfSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxStarAudioId';
import { resolvingWildlifeVocalSfxConcurrencyAction } from '@/components/world/wildlife/domains/resolvingWildlifeVocalSfxConcurrencyAction';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from 'star-audio';

type DefiningWildlifeOmegaWolfSfxRotationEventKind = Extract<
  NotifyingWildlifeOmegaWolfSfxEventPayload['eventKind'],
  'howl' | 'chase_call' | 'territory_warn' | 'hit_taken'
>;

type ManagingWildlifeOmegaWolfSfxActivePlay = {
  handle: SoundHandle;
  instanceId: string;
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind;
  sourcePoint: DefiningWorldPlazaWorldPoint;
};

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
 * Active plays recompute distance falloff on a short poll so long howls fade
 * when the wolf or player moves away mid-clip.
 *
 * @module components/world/wildlife/hooks/usingWildlifeOmegaWolfSfx
 */
export function usingWildlifeOmegaWolfSfx(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>,
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const activePlaysRef = useRef<ManagingWildlifeOmegaWolfSfxActivePlay[]>([]);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const pruningFinishedOmegaWolfSfxPlays = (): void => {
      activePlaysRef.current = activePlaysRef.current.filter(
        (activePlay) => activePlay.handle.playing
      );
    };

    const resolvingActivePlaySourcePoint = (
      activePlay: ManagingWildlifeOmegaWolfSfxActivePlay
    ): DefiningWorldPlazaWorldPoint | 'stop' => {
      const store = wildlifeStoreRef.current;

      if (!store) {
        return activePlay.sourcePoint;
      }

      const instance = gettingWildlifeInstance(store, activePlay.instanceId);

      if (!instance || instance.isDead) {
        return 'stop';
      }

      activePlay.sourcePoint = {
        x: instance.position.x,
        y: instance.position.y,
        ...(instance.position.layer !== undefined
          ? { layer: instance.position.layer }
          : {}),
      };

      return activePlay.sourcePoint;
    };

    const silencingOmegaWolfSfxForInstance = (instanceId: string): void => {
      for (const activePlay of activePlaysRef.current) {
        if (activePlay.instanceId === instanceId) {
          activePlay.handle.stop();
        }
      }

      activePlaysRef.current = activePlaysRef.current.filter(
        (activePlay) => activePlay.instanceId !== instanceId
      );
    };

    const syncingActiveOmegaWolfSfxVolumes = (): void => {
      pruningFinishedOmegaWolfSfxPlays();

      const listenerPoint = playerPositionRef.current;

      for (const activePlay of activePlaysRef.current) {
        const sourcePoint = resolvingActivePlaySourcePoint(activePlay);

        if (sourcePoint === 'stop') {
          activePlay.handle.stop();
          continue;
        }

        const volume = computingWildlifeOmegaWolfSfxEffectiveVolume(
          activePlay.eventKind,
          sourcePoint,
          listenerPoint
        );

        if (volume <= 0) {
          activePlay.handle.stop();
          continue;
        }

        updatingWorldPlazaStarAudioActiveSfxPlayVolume(
          activePlay.handle,
          volume
        );
      }

      pruningFinishedOmegaWolfSfxPlays();
    };

    const playingClip = (
      clipId: DefiningWildlifeOmegaWolfSfxClipId,
      volume: number
    ): SoundHandle | null => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return null;
      }

      if (volume <= 0) {
        return null;
      }

      return playingWorldPlazaStarAudioSfx(
        resolvingWildlifeOmegaWolfSfxStarAudioId(clipId),
        { volume }
      );
    };

    const handlingOmegaWolfSfxEvent = ({
      instanceId,
      eventKind,
      worldPoint,
    }: NotifyingWildlifeOmegaWolfSfxEventPayload): void => {
      pruningFinishedOmegaWolfSfxPlays();
      const activeInstancePlays = activePlaysRef.current.filter(
        (activePlay) => activePlay.instanceId === instanceId
      );
      const activePriority =
        activeInstancePlays.length > 0
          ? Math.max(
              ...activeInstancePlays.map(
                (activePlay) =>
                  DEFINING_WILDLIFE_OMEGA_WOLF_SFX_EVENT_PRIORITY[
                    activePlay.eventKind
                  ]
              )
            )
          : null;
      const concurrencyAction = resolvingWildlifeVocalSfxConcurrencyAction(
        activePriority,
        DEFINING_WILDLIFE_OMEGA_WOLF_SFX_EVENT_PRIORITY[eventKind]
      );

      if (concurrencyAction === 'skip') {
        return;
      }

      const listenerPoint = playerPositionRef.current;
      const sourcePoint = {
        x: worldPoint.x,
        y: worldPoint.y,
        ...(worldPoint.layer !== undefined ? { layer: worldPoint.layer } : {}),
      };
      const volume = computingWildlifeOmegaWolfSfxEffectiveVolume(
        eventKind,
        sourcePoint,
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

      const handle = playingClip(clipId, volume);

      if (!handle) {
        return;
      }

      if (concurrencyAction === 'interrupt') {
        for (const activePlay of activeInstancePlays) {
          activePlay.handle.stop();
        }

        activePlaysRef.current = activePlaysRef.current.filter(
          (activePlay) => activePlay.instanceId !== instanceId
        );
      }

      activePlaysRef.current.push({
        handle,
        instanceId,
        eventKind,
        sourcePoint,
      });

      if (checkingWildlifeOmegaWolfSfxEventUsesRotationPool(eventKind)) {
        advancingWildlifeOmegaWolfSfxRotationIndex(eventKind, poolLength);
      }
    };

    const unlockingAndRetryingOmegaWolfSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      syncingActiveOmegaWolfSfxVolumes();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWildlifeOmegaWolfStarAudioManifest()
    )
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
    const unregisterSilenceListener =
      registeringWildlifeInstanceVocalSfxSilenceListener(({ instanceId }) => {
        silencingOmegaWolfSfxForInstance(instanceId);
      });
    const spatialPollIntervalId = window.setInterval(
      syncingActiveOmegaWolfSfxVolumes,
      DEFINING_WILDLIFE_OMEGA_WOLF_SFX_SPATIAL_POLL_INTERVAL_MS
    );

    return () => {
      window.clearInterval(spatialPollIntervalId);
      unregisterEventListener();
      unregisterSilenceListener();
      unregisterUserGestureUnlock();

      for (const activePlay of activePlaysRef.current) {
        activePlay.handle.stop();
      }

      activePlaysRef.current = [];
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      resettingWildlifeOmegaWolfSfxRotationIndices();
    };
  }, [playerPositionRef, wildlifeStoreRef]);
}
