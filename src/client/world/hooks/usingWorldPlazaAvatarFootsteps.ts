'use client';

import { buildingWorldPlazaAvatarFootstepStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
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
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  initializingWorldPlazaSfxVolumeStoreFromStorage,
  subscribingWorldPlazaSfxVolume,
} from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  checkingWorldPlazaAvatarMotionKindPlaysFootsteps,
  computingWorldPlazaAvatarFootstepIntervalMs,
  resolvingWorldPlazaAvatarFootstepNextClipId,
  resolvingWorldPlazaAvatarFootstepPlaybackRate,
  resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint,
  resolvingWorldPlazaAvatarJumpLandingClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepPlayback';
import { resolvingWorldPlazaAvatarFootstepStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarFootstepStarAudioId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';
import { createStarAudio, type StarAudio } from 'star-audio';

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
  const nextFootstepAtMsRef = useRef<number>(0);
  const clipIndexRef = useRef<number>(0);
  const lastMotionKindRef = useRef<
    DefiningWorldPlazaAvatarMotionState['motionKind'] | null
  >(null);
  const lastSurfaceKindRef =
    useRef<DefiningWorldPlazaAvatarFootstepSurfaceKind | null>(null);
  const pendingJumpLandingStartedAtMsRef = useRef<number>(0);
  const lastHandledJumpStartedAtMsRef = useRef<number>(0);

  useEffect(() => {
    const starAudio = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    starAudioRef.current = starAudio;

    initializingWorldPlazaSfxVolumeStoreFromStorage();

    const applyingMasterSfxVolume = (): void => {
      starAudio.setSfxVolume(
        computingWorldPlazaAvatarFootstepEffectiveTargetVolume()
      );
    };

    const playingClip = (
      clipId: DefiningWorldPlazaAvatarFootstepClipId,
      volume: number,
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

      starAudio.play(resolvingWorldPlazaAvatarFootstepStarAudioId(clipId), {
        group: 'sfx',
        volume,
        rate,
      });
    };

    const resettingFootstepLoop = (): void => {
      nextFootstepAtMsRef.current = 0;
      clipIndexRef.current = 0;
      lastMotionKindRef.current = null;
      lastSurfaceKindRef.current = null;
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

      const surfaceKind = resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(
        playerPositionRef.current
      );
      const landingClipId =
        resolvingWorldPlazaAvatarJumpLandingClipId(surfaceKind);

      playingClip(
        landingClipId,
        computingWorldPlazaAvatarJumpLandingEffectiveTargetVolume()
      );
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

      const surfaceKind = resolvingWorldPlazaAvatarFootstepSurfaceAtWorldPoint(
        playerPositionRef.current
      );

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

      const clipId = resolvingWorldPlazaAvatarFootstepNextClipId(
        surfaceKind,
        motionKind,
        clipIndexRef.current
      );
      clipIndexRef.current += 1;

      playingClip(
        clipId,
        computingWorldPlazaAvatarFootstepEffectiveTargetVolume(),
        resolvingWorldPlazaAvatarFootstepPlaybackRate(motionKind, surfaceKind)
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
    void starAudio
      .preload(buildingWorldPlazaAvatarFootstepStarAudioManifest())
      .then(() => {
        isPreloadReadyRef.current = true;
      })
      .catch(() => {
        isPreloadReadyRef.current = false;
      });

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
      starAudio.destroy();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
      pendingJumpLandingStartedAtMsRef.current = 0;
      lastHandledJumpStartedAtMsRef.current = 0;
      resettingFootstepLoop();
    };
  }, [localAvatarMotionStateRef, playerPositionRef]);
}
