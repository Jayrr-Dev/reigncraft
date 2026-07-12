'use client';

import { buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { checkingWorldPlazaGirlSampleAvatarSkinActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarSkinActive';
import {
  computingWorldPlazaAvatarFootstepEffectiveTargetVolume,
  computingWorldPlazaAvatarJumpLandingEffectiveTargetVolume,
} from '@/components/world/domains/computingWorldPlazaAvatarFootstepEffectiveTargetVolume';
import {
  DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_POLL_INTERVAL_MS,
  type DefiningWorldPlazaAvatarFootstepClipId,
  type DefiningWorldPlazaAvatarFootstepSurfaceKind,
} from '@/components/world/domains/definingWorldPlazaAvatarFootstepSfxConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  type DefiningWorldPlazaAvatarMotionKind,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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
import {
  checkingWorldPlazaAvatarMotionKindPlaysFootsteps,
  computingWorldPlazaAvatarFootstepIntervalMs,
  resolvingWorldPlazaAvatarFootstepNextClipEntry,
  resolvingWorldPlazaAvatarFootstepPlaybackDurationS,
  resolvingWorldPlazaAvatarFootstepPlaybackRate,
  resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint,
  resolvingWorldPlazaAvatarFootstepVolumeMultiplier,
  resolvingWorldPlazaAvatarJumpLandingClipEntry,
} from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepPlayback';
import { resolvingWorldPlazaAvatarFootstepStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepStarAudioId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { resolvingFilmcowFootstepClipEntryId } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepClipEntries';
import { useEffect, useRef } from 'react';
import type { SoundHandle, StarAudio } from 'star-audio';

/**
 * Loops FilmCow footstep one-shots for the girl-sample skin while walking
 * or running, switching surface by biome and playing a landing clip when jumps
 * finish.
 *
 * @module components/world/hooks/usingWorldPlazaAvatarFootsteps
 */
export function usingWorldPlazaAvatarFootsteps(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>,
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>
): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);
  const preloadedSurfaceKeyRef = useRef('');
  const preloadGenerationRef = useRef(0);
  const nextFootstepAtMsRef = useRef<number>(0);
  const clipIndexRef = useRef<number>(0);
  const lastMotionKindRef = useRef<
    DefiningWorldPlazaAvatarMotionState['motionKind'] | null
  >(null);
  const lastSurfaceKindRef =
    useRef<DefiningWorldPlazaAvatarFootstepSurfaceKind | null>(null);
  const lastResolvedSurfaceTileXRef = useRef(Number.NaN);
  const lastResolvedSurfaceTileYRef = useRef(Number.NaN);
  const lastResolvedSurfaceKindRef =
    useRef<DefiningWorldPlazaAvatarFootstepSurfaceKind | null>(null);
  const pendingJumpLandingStartedAtMsRef = useRef<number>(0);
  const lastHandledJumpStartedAtMsRef = useRef<number>(0);
  const activeFootstepHandleRef = useRef<SoundHandle | null>(null);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      settingWorldPlazaStarAudioSfxGroupVolume(1);
    };

    const playingClip = (
      clipId: DefiningWorldPlazaAvatarFootstepClipId,
      volume: number,
      motionKind: DefiningWorldPlazaAvatarMotionKind,
      rate = 1
    ): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      if (starAudio.state === 'locked') {
        return;
      }

      if (volume <= 0) {
        return;
      }

      activeFootstepHandleRef.current?.stop();
      activeFootstepHandleRef.current = null;

      const playbackDurationS =
        resolvingWorldPlazaAvatarFootstepPlaybackDurationS(motionKind);

      const handle = playingWorldPlazaStarAudioSfx(
        resolvingWorldPlazaAvatarFootstepStarAudioId(clipId),
        {
          volume,
          rate,
          ...(playbackDurationS ? { duration: playbackDurationS } : {}),
        }
      );

      activeFootstepHandleRef.current = handle;
    };

    const resettingFootstepLoop = (): void => {
      nextFootstepAtMsRef.current = 0;
      clipIndexRef.current = 0;
      lastMotionKindRef.current = null;
      lastSurfaceKindRef.current = null;
    };

    const resolvingCachedAvatarFootstepSurface =
      (): DefiningWorldPlazaAvatarFootstepSurfaceKind => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(null);
        }

        const tileX = Math.floor(playerPosition.x);
        const tileY = Math.floor(playerPosition.y);
        const cachedSurface = lastResolvedSurfaceKindRef.current;

        if (
          cachedSurface &&
          tileX === lastResolvedSurfaceTileXRef.current &&
          tileY === lastResolvedSurfaceTileYRef.current
        ) {
          return cachedSurface;
        }

        const surfaceKind =
          resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(playerPosition);
        lastResolvedSurfaceTileXRef.current = tileX;
        lastResolvedSurfaceTileYRef.current = tileY;
        lastResolvedSurfaceKindRef.current = surfaceKind;
        return surfaceKind;
      };

    const playingJumpLandingIfNeeded = (
      motionState: DefiningWorldPlazaAvatarMotionState
    ): void => {
      if (!checkingWorldPlazaGirlSampleAvatarSkinActive()) {
        return;
      }

      if (
        motionState.motionKind ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP &&
        motionState.jumpStartedAtMs > 0
      ) {
        pendingJumpLandingStartedAtMsRef.current = motionState.jumpStartedAtMs;
      }

      const pendingJumpStartedAtMs = pendingJumpLandingStartedAtMsRef.current;

      if (
        lastMotionKindRef.current !==
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP ||
        motionState.motionKind ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP ||
        pendingJumpStartedAtMs <= 0 ||
        lastHandledJumpStartedAtMsRef.current === pendingJumpStartedAtMs
      ) {
        return;
      }

      lastHandledJumpStartedAtMsRef.current = pendingJumpStartedAtMs;
      pendingJumpLandingStartedAtMsRef.current = 0;

      const surfaceKind = resolvingCachedAvatarFootstepSurface();
      const landingClipEntry =
        resolvingWorldPlazaAvatarJumpLandingClipEntry(surfaceKind);
      const landingClipId =
        resolvingFilmcowFootstepClipEntryId(landingClipEntry);

      playingClip(
        landingClipId,
        computingWorldPlazaAvatarJumpLandingEffectiveTargetVolume(
          resolvingWorldPlazaAvatarFootstepVolumeMultiplier(
            surfaceKind,
            'landing',
            landingClipEntry
          )
        ),
        motionState.motionKind
      );
    };

    const preloadingFootstepsForSurface = (
      surfaceKind: DefiningWorldPlazaAvatarFootstepSurfaceKind
    ): void => {
      if (
        surfaceKind === preloadedSurfaceKeyRef.current &&
        isPreloadReadyRef.current
      ) {
        return;
      }

      if (surfaceKind === preloadedSurfaceKeyRef.current) {
        return;
      }

      preloadedSurfaceKeyRef.current = surfaceKind;
      preloadGenerationRef.current += 1;
      const preloadGeneration = preloadGenerationRef.current;
      isPreloadReadyRef.current = false;

      void preloadingWorldPlazaStarAudioManifest(
        buildingWorldPlazaAvatarFootstepStarAudioManifestForSurfaces([
          surfaceKind,
        ])
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

    const syncingAvatarFootsteps = (): void => {
      if (!checkingWorldPlazaGirlSampleAvatarSkinActive()) {
        return;
      }

      const motionState = localAvatarMotionStateRef.current;

      if (!motionState) {
        return;
      }

      playingJumpLandingIfNeeded(motionState);

      const motionKind = motionState.motionKind;
      const previousMotionKind = lastMotionKindRef.current;

      if (!checkingWorldPlazaAvatarMotionKindPlaysFootsteps(motionKind)) {
        if (previousMotionKind !== null) {
          lastMotionKindRef.current = motionKind;
          nextFootstepAtMsRef.current = 0;
          clipIndexRef.current = 0;
          lastSurfaceKindRef.current = null;
        }

        return;
      }

      const surfaceKind = resolvingCachedAvatarFootstepSurface();

      preloadingFootstepsForSurface(surfaceKind);

      if (
        previousMotionKind !== motionKind ||
        lastSurfaceKindRef.current !== surfaceKind
      ) {
        nextFootstepAtMsRef.current = 0;
        clipIndexRef.current = 0;
        lastSurfaceKindRef.current = surfaceKind;
      }

      lastMotionKindRef.current = motionKind;

      const intervalMs =
        computingWorldPlazaAvatarFootstepIntervalMs(motionKind);

      if (!intervalMs) {
        return;
      }

      const nowMs = performance.now();

      if (nextFootstepAtMsRef.current === 0) {
        nextFootstepAtMsRef.current = nowMs;
      }

      if (nowMs < nextFootstepAtMsRef.current) {
        return;
      }

      const clipEntry = resolvingWorldPlazaAvatarFootstepNextClipEntry(
        surfaceKind,
        motionKind,
        clipIndexRef.current
      );
      const clipId = resolvingFilmcowFootstepClipEntryId(clipEntry);
      const volumeGroupKind =
        motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
          ? 'run'
          : 'walk';
      clipIndexRef.current += 1;

      playingClip(
        clipId,
        computingWorldPlazaAvatarFootstepEffectiveTargetVolume(
          resolvingWorldPlazaAvatarFootstepVolumeMultiplier(
            surfaceKind,
            volumeGroupKind,
            clipEntry
          )
        ),
        motionKind,
        resolvingWorldPlazaAvatarFootstepPlaybackRate(
          motionKind,
          surfaceKind,
          clipId
        )
      );
      nextFootstepAtMsRef.current = nowMs + intervalMs;
    };

    const unlockingAndRetryingFootsteps = (): void => {
      void starAudio.unlock();
      applyingMasterSfxVolume();
      resettingFootstepLoop();
    };

    const handlingSfxVolumeChange = (): void => {
      applyingMasterSfxVolume();
    };

    const handlingStarAudioUnlocked = (): void => {
      applyingMasterSfxVolume();
      resettingFootstepLoop();
    };

    const handlingStarAudioResumed = (): void => {
      resettingFootstepLoop();
    };

    applyingMasterSfxVolume();
    preloadingFootstepsForSurface(resolvingCachedAvatarFootstepSurface());

    const unsubscribeSfxVolume = subscribingWorldPlazaSfxVolume(
      handlingSfxVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingFootsteps
      );

    starAudio.on('unlocked', handlingStarAudioUnlocked);
    starAudio.on('resumed', handlingStarAudioResumed);

    const intervalId = window.setInterval(
      syncingAvatarFootsteps,
      DEFINING_WORLD_PLAZA_AVATAR_FOOTSTEP_POLL_INTERVAL_MS
    );

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeSfxVolume();
      window.clearInterval(intervalId);
      starAudio.off('unlocked', handlingStarAudioUnlocked);
      starAudio.off('resumed', handlingStarAudioResumed);
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      activeFootstepHandleRef.current?.stop();
      activeFootstepHandleRef.current = null;
      isPreloadReadyRef.current = false;
      preloadedSurfaceKeyRef.current = '';
      preloadGenerationRef.current = 0;
      pendingJumpLandingStartedAtMsRef.current = 0;
      lastHandledJumpStartedAtMsRef.current = 0;
      lastResolvedSurfaceTileXRef.current = Number.NaN;
      lastResolvedSurfaceTileYRef.current = Number.NaN;
      lastResolvedSurfaceKindRef.current = null;
      resettingFootstepLoop();
    };
  }, [localAvatarMotionStateRef, playerPositionRef]);
}
