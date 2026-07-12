'use client';

import { settingWorldPlazaAudioScope } from '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
  updatingWorldPlazaStarAudioActiveSfxPlayVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds } from '@/components/world/wildlife/domains/buildingWildlifeFarmAnimalStarAudioManifest';
import { checkingWildlifeSpeciesSfxReplayAllowed } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesSfxReplayAllowed';
import { computingWildlifeSpeciesSfxEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeSpeciesSfxEffectiveVolume';
import { DEFINING_WILDLIFE_SPECIES_SFX_SPATIAL_POLL_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type {
  DefiningWildlifeSpeciesSfxClipId,
  DefiningWildlifeSpeciesSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import {
  checkingWildlifeSpeciesSfxEventEnabled,
  resolvingWildlifeSpeciesSfxProfile,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import { DEFINING_WILDLIFE_SPECIES_SFX_EVENT_PRIORITY } from '@/components/world/wildlife/domains/definingWildlifeVocalSfxConcurrency';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  resettingWildlifeSpeciesSfxPlaybackTimestamps,
  stampingWildlifeSpeciesSfxLastPlayedAtMs,
} from '@/components/world/wildlife/domains/managingWildlifeSpeciesSfxPlaybackStore';
import {
  advancingWildlifeSpeciesSfxRotationIndex,
  gettingWildlifeSpeciesSfxRotationIndex,
  resettingWildlifeSpeciesSfxRotationIndices,
} from '@/components/world/wildlife/domains/managingWildlifeSpeciesSfxRotationStore';
import { registeringWildlifeInstanceVocalSfxSilenceListener } from '@/components/world/wildlife/domains/notifyingWildlifeInstanceVocalSfxSilence';
import {
  registeringWildlifeSpeciesSfxEventListener,
  type NotifyingWildlifeSpeciesSfxEventPayload,
} from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent';
import {
  resolvingWildlifeSpeciesSfxClipId,
  resolvingWildlifeSpeciesSfxClipPoolLength,
  resolvingWildlifeSpeciesSfxPoolIdForEvent,
  listingWildlifeSpeciesSfxClipIdsForSpeciesIds,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import { resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';
import { resolvingWildlifeVocalSfxConcurrencyAction } from '@/components/world/wildlife/domains/resolvingWildlifeVocalSfxConcurrencyAction';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from '@/components/world/audio/definingWorldPlazaAudioTypes';

const DEFINING_WILDLIFE_SPECIES_SFX_SCOPE_SYNC_INTERVAL_MS = 500;

type ManagingWildlifeSpeciesSfxActivePlay = {
  handle: SoundHandle;
  instanceId: string;
  speciesId: string;
  eventKind: DefiningWildlifeSpeciesSfxEventKind;
  playbackPoolId: DefiningWildlifeSpeciesSfxPoolId;
  clipId: DefiningWildlifeSpeciesSfxClipId;
  sourcePoint: DefiningWorldPlazaWorldPoint;
};

/**
 * Preloads farm animal clips and plays them for wildlife simulation events.
 *
 * Active plays recompute distance falloff on a short poll so long vocals fade
 * when the animal or player moves away mid-clip.
 *
 * @module components/world/wildlife/hooks/usingWildlifeSpeciesSfx
 */
export function usingWildlifeSpeciesSfx(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>,
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const preloadedSpeciesKeyRef = useRef('');
  const preloadGenerationRef = useRef(0);
  const activePlaysRef = useRef<ManagingWildlifeSpeciesSfxActivePlay[]>([]);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const pruningFinishedSpeciesSfxPlays = (): void => {
      activePlaysRef.current = activePlaysRef.current.filter(
        (activePlay) => activePlay.handle.playing
      );
    };

    const resolvingActivePlaySourcePoint = (
      activePlay: ManagingWildlifeSpeciesSfxActivePlay
    ): DefiningWorldPlazaWorldPoint | 'stop' => {
      const store = wildlifeStoreRef.current;

      if (!store) {
        return activePlay.sourcePoint;
      }

      const instance = gettingWildlifeInstance(store, activePlay.instanceId);

      if (!instance) {
        return 'stop';
      }

      // Corpses keep no live vocals; death cry clips are not shipped yet.
      if (instance.isDead && activePlay.eventKind !== 'death') {
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

    const silencingSpeciesSfxForInstance = (instanceId: string): void => {
      for (const activePlay of activePlaysRef.current) {
        if (activePlay.instanceId === instanceId) {
          activePlay.handle.stop();
        }
      }

      activePlaysRef.current = activePlaysRef.current.filter(
        (activePlay) => activePlay.instanceId !== instanceId
      );
    };

    const syncingActiveSpeciesSfxVolumes = (): void => {
      pruningFinishedSpeciesSfxPlays();

      const listenerPoint = playerPositionRef.current;

      for (const activePlay of activePlaysRef.current) {
        const sourcePoint = resolvingActivePlaySourcePoint(activePlay);

        if (sourcePoint === 'stop') {
          activePlay.handle.stop();
          continue;
        }

        const volume = computingWildlifeSpeciesSfxEffectiveVolume(
          activePlay.speciesId,
          activePlay.eventKind,
          sourcePoint,
          listenerPoint,
          activePlay.playbackPoolId,
          activePlay.clipId
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

      pruningFinishedSpeciesSfxPlays();
    };

    const playingClip = (
      clipId: DefiningWildlifeSpeciesSfxClipId,
      volume: number,
      maxPlaybackDurationS: number | null
    ): SoundHandle | null => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return null;
      }

      if (volume <= 0) {
        return null;
      }

      return playingWorldPlazaStarAudioSfx(
        resolvingWildlifeSpeciesSfxStarAudioId(clipId),
        {
          volume,
          ...(maxPlaybackDurationS !== null
            ? { duration: maxPlaybackDurationS }
            : {}),
        }
      );
    };

    const handlingSpeciesSfxEvent = ({
      instanceId,
      speciesId,
      eventKind,
      worldPoint,
    }: NotifyingWildlifeSpeciesSfxEventPayload): void => {
      if (!checkingWildlifeSpeciesSfxEventEnabled(speciesId, eventKind)) {
        return;
      }

      const nowMs = Date.now();

      if (
        !checkingWildlifeSpeciesSfxReplayAllowed({
          instanceId,
          speciesId,
          nowMs,
        })
      ) {
        return;
      }

      pruningFinishedSpeciesSfxPlays();
      const activeInstancePlays = activePlaysRef.current.filter(
        (activePlay) => activePlay.instanceId === instanceId
      );
      const activePriority =
        activeInstancePlays.length > 0
          ? Math.max(
              ...activeInstancePlays.map(
                (activePlay) =>
                  DEFINING_WILDLIFE_SPECIES_SFX_EVENT_PRIORITY[
                    activePlay.eventKind
                  ]
              )
            )
          : null;
      const concurrencyAction = resolvingWildlifeVocalSfxConcurrencyAction(
        activePriority,
        DEFINING_WILDLIFE_SPECIES_SFX_EVENT_PRIORITY[eventKind]
      );

      if (concurrencyAction === 'skip') {
        return;
      }

      const listenerPoint = playerPositionRef.current;
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
      const playbackPoolId = resolvingWildlifeSpeciesSfxPoolIdForEvent(
        speciesId,
        eventKind,
        rotationIndex
      );
      const clipId = resolvingWildlifeSpeciesSfxClipId(
        speciesId,
        eventKind,
        rotationIndex
      );

      if (clipId === null || playbackPoolId === null) {
        return;
      }

      const sourcePoint = {
        x: worldPoint.x,
        y: worldPoint.y,
        ...(worldPoint.layer !== undefined ? { layer: worldPoint.layer } : {}),
      };
      const volume = computingWildlifeSpeciesSfxEffectiveVolume(
        speciesId,
        eventKind,
        sourcePoint,
        listenerPoint,
        playbackPoolId,
        clipId
      );

      if (volume <= 0) {
        return;
      }

      const maxPlaybackDurationS =
        resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS(playbackPoolId);
      const handle = playingClip(clipId, volume, maxPlaybackDurationS);

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
        speciesId,
        eventKind,
        playbackPoolId,
        clipId,
        sourcePoint,
      });

      const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

      if (profile) {
        stampingWildlifeSpeciesSfxLastPlayedAtMs(
          instanceId,
          profile.poolId,
          nowMs
        );
      }

      advancingWildlifeSpeciesSfxRotationIndex(
        speciesId,
        eventKind,
        poolLength
      );
    };

    const unlockingAndRetryingSpeciesSfx = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      syncingActiveSpeciesSfxVolumes();
    };

    const syncingProximateSpeciesAudioScope = (): void => {
      const speciesIds = [
        ...new Set(
          [...(wildlifeStoreRef.current?.instances.values() ?? [])]
            .filter((instance) => !instance.isDead)
            .map((instance) => instance.speciesId)
        ),
      ].sort();
      const speciesKey = speciesIds.join('|');

      if (speciesKey === preloadedSpeciesKeyRef.current) {
        return;
      }

      preloadedSpeciesKeyRef.current = speciesKey;
      preloadGenerationRef.current += 1;
      const preloadGeneration = preloadGenerationRef.current;
      isPreloadReadyRef.current = false;

      if (speciesIds.length === 0) {
        void settingWorldPlazaAudioScope('world:wildlife-proximate', null);
        return;
      }

      const clipIds =
        listingWildlifeSpeciesSfxClipIdsForSpeciesIds(speciesIds);
      void settingWorldPlazaAudioScope(
        'world:wildlife-proximate',
        buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds(clipIds)
      ).then(() => {
        if (preloadGeneration !== preloadGenerationRef.current) {
          return;
        }

        isPreloadReadyRef.current = true;
      });
    };

    applyingMasterSfxVolume();
    syncingProximateSpeciesAudioScope();

    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingSpeciesSfx
      );
    const unregisterEventListener = registeringWildlifeSpeciesSfxEventListener(
      handlingSpeciesSfxEvent
    );
    const unregisterSilenceListener =
      registeringWildlifeInstanceVocalSfxSilenceListener(({ instanceId }) => {
        silencingSpeciesSfxForInstance(instanceId);
      });
    const spatialPollIntervalId = window.setInterval(
      syncingActiveSpeciesSfxVolumes,
      DEFINING_WILDLIFE_SPECIES_SFX_SPATIAL_POLL_INTERVAL_MS
    );
    const scopeSyncIntervalId = window.setInterval(
      syncingProximateSpeciesAudioScope,
      DEFINING_WILDLIFE_SPECIES_SFX_SCOPE_SYNC_INTERVAL_MS
    );

    return () => {
      window.clearInterval(spatialPollIntervalId);
      window.clearInterval(scopeSyncIntervalId);
      unregisterEventListener();
      unregisterSilenceListener();
      unregisterUserGestureUnlock();

      for (const activePlay of activePlaysRef.current) {
        activePlay.handle.stop();
      }

      activePlaysRef.current = [];
      void settingWorldPlazaAudioScope('world:wildlife-proximate', null);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      preloadedSpeciesKeyRef.current = '';
      preloadGenerationRef.current = 0;
      resettingWildlifeSpeciesSfxRotationIndices();
      resettingWildlifeSpeciesSfxPlaybackTimestamps();
    };
  }, [playerPositionRef, wildlifeStoreRef]);
}
