'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { initializingWorldPlazaSfxVolumeStoreFromStorage } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { buildingFilmcowFootstepStarAudioManifest } from '@/components/world/footsteps/domains/buildingFilmcowFootstepStarAudioManifest';
import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_PLAYBACK_RATE,
  type DefiningFilmcowFootstepClipId,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import {
  resolvingFilmcowFootstepNextClipId,
  resolvingFilmcowFootstepRunPlaybackRate,
} from '@/components/world/footsteps/domains/resolvingFilmcowFootstepPlayback';
import { resolvingFilmcowFootstepSurfaceAtWorldPoint } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';
import { checkingWildlifeInstancePlaysFootsteps } from '@/components/world/wildlife/domains/checkingWildlifeInstancePlaysFootsteps';
import { computingWildlifeFootstepEffectiveVolume } from '@/components/world/wildlife/domains/computingWildlifeFootstepEffectiveVolume';
import { computingWildlifeFootstepIntervalMs } from '@/components/world/wildlife/domains/computingWildlifeFootstepIntervalMs';
import {
  DEFINING_WILDLIFE_FOOTSTEP_MAX_STEPS_PER_TICK,
  DEFINING_WILDLIFE_FOOTSTEP_MIN_MOVEMENT_SPEED_GRID_PER_SECOND,
  DEFINING_WILDLIFE_FOOTSTEP_POLL_INTERVAL_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFootstepSfxConstants';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepSizeTier';
import { resolvingWildlifeFootstepStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepStarAudioId';
import { resolvingWildlifeSizeScaleMultiplierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeSizeScaleMultiplierFromSample';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { useEffect, useRef } from 'react';
import { createStarAudio, type StarAudio } from 'star-audio';

type DefiningWildlifeFootstepLoopState = {
  nextFootstepAtMs: number;
  clipIndex: number;
};

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
  const loopStateByInstanceIdRef = useRef<
    Map<string, DefiningWildlifeFootstepLoopState>
  >(new Map());

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
      clipId: DefiningFilmcowFootstepClipId,
      volume: number,
      rate = 1
    ): void => {
      if (!isPreloadReadyRef.current || starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      starAudio.play(resolvingWildlifeFootstepStarAudioId(clipId), {
        group: 'sfx',
        volume,
        rate,
      });
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

    const syncingWildlifeFootsteps = (): void => {
      const store = wildlifeStoreRef.current;
      const listenerPoint = playerPositionRef.current;

      if (!store) {
        return;
      }

      const instances = listingWildlifeInstances(store);
      const liveInstanceIds = new Set<string>();
      let stepsPlayedThisTick = 0;
      const nowMs = performance.now();

      for (const instance of instances) {
        liveInstanceIds.add(instance.instanceId);

        if (!checkingWildlifeInstancePlaysFootsteps(instance)) {
          continue;
        }

        if (stepsPlayedThisTick >= DEFINING_WILDLIFE_FOOTSTEP_MAX_STEPS_PER_TICK) {
          break;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
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
        const movementSpeedGridPerSecond =
          motionClip === 'run'
            ? resolvingWildlifeInstanceRunSpeedGridPerSecond(species, instance)
            : resolvingWildlifeInstanceWalkSpeedGridPerSecond(
                species,
                instance
              );

        if (
          movementSpeedGridPerSecond <
          DEFINING_WILDLIFE_FOOTSTEP_MIN_MOVEMENT_SPEED_GRID_PER_SECOND
        ) {
          continue;
        }

        const intervalMs = computingWildlifeFootstepIntervalMs(
          motionClip,
          visualSizeMultiplier,
          movementSpeedGridPerSecond
        );

        if (!intervalMs) {
          continue;
        }

        const volume = computingWildlifeFootstepEffectiveVolume(
          sizeTier,
          instance.position,
          listenerPoint
        );

        if (volume <= 0) {
          continue;
        }

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

        if (nowMs < loopState.nextFootstepAtMs) {
          continue;
        }

        const surfaceKind = resolvingFilmcowFootstepSurfaceAtWorldPoint(
          instance.position
        );
        const footstepMotionKind = motionClip === 'run' ? 'run' : 'walk';
        const clipId = resolvingFilmcowFootstepNextClipId(
          surfaceKind,
          footstepMotionKind,
          loopState.clipIndex,
          sizeTier
        );
        const playbackRate =
          DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_PLAYBACK_RATE[sizeTier] *
          (footstepMotionKind === 'run'
            ? resolvingFilmcowFootstepRunPlaybackRate(surfaceKind)
            : 1);

        playingClip(clipId, volume, playbackRate);
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
    void starAudio
      .preload(buildingFilmcowFootstepStarAudioManifest())
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
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
      starAudio.destroy();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      loopStateByInstanceIdRef.current.clear();
    };
  }, [playerPositionRef, wildlifeStoreRef]);
}
