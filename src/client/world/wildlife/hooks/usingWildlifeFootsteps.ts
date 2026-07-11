'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  playingWorldPlazaStarAudioSfx,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
  settingWorldPlazaStarAudioSfxGroupVolume,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingFilmcowFootstepBootPriorityStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import { buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces } from '@/components/world/footsteps/domains/buildingFilmcowFootstepWildlifeStarAudioManifest';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_PLAYBACK_RATE,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  resolvingFilmcowFootstepPlaybackDurationS,
  resolvingFilmcowFootstepWildlifeNextClipId,
  resolvingFilmcowFootstepWildlifePlaybackRate,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';
import { resolvingFilmcowFootstepSurfaceAtWorldPoint } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';
import { resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback';
import { checkingWildlifeInstancePlaysFootsteps } from '@/components/world/wildlife/domains/checkingWildlifeInstancePlaysFootsteps';
import { computingWildlifeFootstepEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeFootstepEffectiveVolume';
import { computingWildlifeFootstepIntervalMs } from '@/components/world/wildlife/domains/computingWildlifeFootstepIntervalMs';
import {
  DEFINING_WILDLIFE_FOOTSTEP_MAX_STEPS_PER_TICK,
  DEFINING_WILDLIFE_FOOTSTEP_MIN_MOVEMENT_SPEED_GRID_PER_SECOND,
  DEFINING_WILDLIFE_FOOTSTEP_POLL_INTERVAL_MS,
  DEFINING_WILDLIFE_FOOTSTEP_SFX_ENABLED,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepSizeTier';
import { resolvingWildlifeFootstepStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepStarAudioId';
import {
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeSizeScaleMultiplierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

type DefiningWildlifeFootstepLoopState = {
  nextFootstepAtMs: number;
  clipIndex: number;
};

type DefiningWildlifeFootstepCandidate = {
  instance: DefiningWildlifeInstance;
  distanceGrid: number;
  volume: number;
  intervalMs: number;
  sizeTier: ReturnType<
    typeof resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier
  >;
  motionClip: 'walk' | 'run';
};

function computingWildlifeFootstepDistanceGrid(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  sourcePoint: DefiningWorldPlazaWorldPoint
): number {
  if (!listenerPoint) {
    return 0;
  }

  return Math.hypot(
    listenerPoint.x - sourcePoint.x,
    listenerPoint.y - sourcePoint.y
  );
}

/**
 * Plays FilmCow footstep one-shots for nearby moving wildlife instances.
 *
 * @module components/world/wildlife/hooks/usingWildlifeFootsteps
 */
export function usingWildlifeFootsteps(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>,
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const preloadedSurfaceKeyRef = useRef('');
  const preloadGenerationRef = useRef(0);
  const loopStateByInstanceIdRef = useRef<
    Map<string, DefiningWildlifeFootstepLoopState>
  >(new Map());

  useEffect(() => {
    if (!DEFINING_WILDLIFE_FOOTSTEP_SFX_ENABLED) {
      return;
    }

    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingClip = (
      clipId: DefiningFilmcowFootstepClipId,
      volume: number,
      motionKind: 'walk' | 'run',
      rate = 1
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      playingWorldPlazaStarAudioSfx(
        resolvingWildlifeFootstepStarAudioId(clipId),
        {
          volume,
          rate,
          duration: resolvingFilmcowFootstepPlaybackDurationS(motionKind),
        }
      );
    };

    const pruningStaleFootstepLoops = (
      liveInstanceIds: ReadonlySet<string>
    ): void => {
      for (const instanceId of loopStateByInstanceIdRef.current.keys()) {
        if (!liveInstanceIds.has(instanceId)) {
          loopStateByInstanceIdRef.current.delete(instanceId);
        }
      }
    };

    const preloadingWildlifeFootstepsForSurfaces = (
      surfaceKinds: readonly ReturnType<
        typeof resolvingFilmcowFootstepSurfaceAtWorldPoint
      >[]
    ): void => {
      const surfaceKey = [...surfaceKinds].sort().join('|');

      if (surfaceKey === preloadedSurfaceKeyRef.current) {
        return;
      }

      preloadedSurfaceKeyRef.current = surfaceKey;
      preloadGenerationRef.current += 1;
      const preloadGeneration = preloadGenerationRef.current;
      isPreloadReadyRef.current = false;

      void preloadingWorldPlazaStarAudioManifest(
        buildingFilmcowFootstepWildlifeStarAudioManifestForSurfaces(
          surfaceKinds
        )
      )
        .then(() => {
          if (preloadGeneration !== preloadGenerationRef.current) {
            return;
          }

          isPreloadReadyRef.current = true;
        })
        .catch(() => {
          if (preloadGeneration !== preloadGenerationRef.current) {
            return;
          }

          isPreloadReadyRef.current = false;
        });
    };

    const resolvingWildlifeFootstepCandidate = (
      instance: DefiningWildlifeInstance,
      listenerPoint: DefiningWorldPlazaWorldPoint | null,
      nowMs: number
    ): DefiningWildlifeFootstepCandidate | null => {
      if (!checkingWildlifeInstancePlaysFootsteps(instance)) {
        return null;
      }

      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species) {
        return null;
      }

      const visualSizeMultiplier =
        resolvingWildlifeSizeScaleMultiplierFromSample(
          instance.sizeScaleSample,
          species
        );
      const sizeTier =
        resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(
          visualSizeMultiplier
        );
      const motionClip = instance.aiState.motionClip;

      if (motionClip !== 'walk' && motionClip !== 'run') {
        return null;
      }

      const movementSpeedGridPerSecond =
        motionClip === 'run'
          ? resolvingWildlifeInstanceRunSpeedGridPerSecond(species, instance)
          : resolvingWildlifeInstanceWalkSpeedGridPerSecond(species, instance);

      if (
        movementSpeedGridPerSecond <
        DEFINING_WILDLIFE_FOOTSTEP_MIN_MOVEMENT_SPEED_GRID_PER_SECOND
      ) {
        return null;
      }

      const intervalMs = computingWildlifeFootstepIntervalMs(
        motionClip,
        visualSizeMultiplier,
        movementSpeedGridPerSecond
      );

      if (!intervalMs) {
        return null;
      }

      const volume = computingWildlifeFootstepEffectiveVolume(
        sizeTier,
        instance.position,
        listenerPoint
      );

      if (volume <= 0) {
        return null;
      }

      const loopState = loopStateByInstanceIdRef.current.get(
        instance.instanceId
      );

      if (loopState && nowMs < loopState.nextFootstepAtMs) {
        return null;
      }

      return {
        instance,
        distanceGrid: computingWildlifeFootstepDistanceGrid(
          listenerPoint,
          instance.position
        ),
        volume,
        intervalMs,
        sizeTier,
        motionClip,
      };
    };

    const syncingWildlifeFootsteps = (): void => {
      const store = wildlifeStoreRef.current;
      const listenerPoint = playerPositionRef.current;

      if (!store) {
        return;
      }

      const instances = listingWildlifeInstances(store);
      const surfaceKinds =
        resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback(
          listenerPoint,
          instances
        );

      preloadingWildlifeFootstepsForSurfaces(surfaceKinds);

      const liveInstanceIds = new Set<string>();
      const nowMs = performance.now();
      const candidates: DefiningWildlifeFootstepCandidate[] = [];

      for (const instance of instances) {
        liveInstanceIds.add(instance.instanceId);

        const candidate = resolvingWildlifeFootstepCandidate(
          instance,
          listenerPoint,
          nowMs
        );

        if (candidate) {
          candidates.push(candidate);
        }
      }

      candidates.sort((left, right) => left.distanceGrid - right.distanceGrid);

      let stepsPlayedThisTick = 0;

      for (const candidate of candidates) {
        if (
          stepsPlayedThisTick >= DEFINING_WILDLIFE_FOOTSTEP_MAX_STEPS_PER_TICK
        ) {
          break;
        }

        const { instance, intervalMs, sizeTier, motionClip, volume } =
          candidate;
        let loopState = loopStateByInstanceIdRef.current.get(
          instance.instanceId
        );

        if (!loopState) {
          loopState = {
            nextFootstepAtMs: nowMs,
            clipIndex: 0,
          };
          loopStateByInstanceIdRef.current.set(instance.instanceId, loopState);
        }

        const surfaceKind = resolvingFilmcowFootstepSurfaceAtWorldPoint(
          instance.position
        );
        const footstepMotionKind = motionClip === 'run' ? 'run' : 'walk';
        const clipId = resolvingFilmcowFootstepWildlifeNextClipId(
          surfaceKind,
          footstepMotionKind,
          loopState.clipIndex,
          sizeTier
        );
        const playbackRate = resolvingFilmcowFootstepWildlifePlaybackRate(
          surfaceKind,
          footstepMotionKind,
          clipId,
          DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_PLAYBACK_RATE[sizeTier]
        );

        playingClip(clipId, volume, footstepMotionKind, playbackRate);
        loopState.clipIndex += 1;
        loopState.nextFootstepAtMs = nowMs + intervalMs;
        stepsPlayedThisTick += 1;
      }

      pruningStaleFootstepLoops(liveInstanceIds);
    };

    const unlockingAndRetryingFootsteps = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      loopStateByInstanceIdRef.current.clear();
    };

    applyingMasterSfxVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingFilmcowFootstepBootPriorityStarAudioManifest()
    ).then(() => {
      if (preloadedSurfaceKeyRef.current === '') {
        isPreloadReadyRef.current = true;
      }
    });

    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingFootsteps
      );

    const handlingStarAudioResumed = (): void => {
      loopStateByInstanceIdRef.current.clear();
    };

    starAudio.on('unlocked', unlockingAndRetryingFootsteps);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingWildlifeFootsteps,
      DEFINING_WILDLIFE_FOOTSTEP_POLL_INTERVAL_MS
    );

    return () => {
      unregisterUserGestureUnlock();
      window.clearInterval(intervalId);
      starAudio.off('unlocked', unlockingAndRetryingFootsteps);
      starAudio.off('resumed', handlingStarAudioResumed);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      preloadedSurfaceKeyRef.current = '';
      preloadGenerationRef.current = 0;
      loopStateByInstanceIdRef.current.clear();
    };
  }, [playerPositionRef, wildlifeStoreRef]);
}
