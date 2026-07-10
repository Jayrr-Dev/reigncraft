'use client';

import { checkingWorldPlazaBiomeMusicIsAudible } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsAudible';
import { computingWorldPlazaBiomeMusicEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeMusicEffectiveTargetVolume';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';

type FadingWorldPlazaBiomeMusicPlayback = {
  cancel: () => void;
};

function easingWorldPlazaBiomeMusicFadeProgress(
  linearProgress: number
): number {
  const clampedProgress = Math.min(1, Math.max(0, linearProgress));
  return (
    clampedProgress *
    clampedProgress *
    clampedProgress *
    (clampedProgress * (clampedProgress * 6 - 15) + 10)
  );
}

function fadingWorldPlazaBiomeMusicVolume(
  audio: HTMLAudioElement,
  fromVolume: number,
  durationMs: number,
  onComplete?: () => void
): FadingWorldPlazaBiomeMusicPlayback {
  const startedAtMs = performance.now();
  let frameId = 0;

  const steppingVolumeFade = (nowMs: number): void => {
    const linearProgress = Math.min(1, (nowMs - startedAtMs) / durationMs);
    const easedProgress =
      easingWorldPlazaBiomeMusicFadeProgress(linearProgress);
    const targetVolume = computingWorldPlazaBiomeMusicEffectiveTargetVolume();
    audio.volume = Math.min(
      1,
      Math.max(0, fromVolume + (targetVolume - fromVolume) * easedProgress)
    );

    if (linearProgress >= 1) {
      onComplete?.();
      return;
    }

    frameId = window.requestAnimationFrame(steppingVolumeFade);
  };

  frameId = window.requestAnimationFrame(steppingVolumeFade);

  return {
    cancel: () => {
      window.cancelAnimationFrame(frameId);
    },
  };
}

function crossfadingWorldPlazaBiomeMusicVolumes(
  outgoingAudio: HTMLAudioElement,
  incomingAudio: HTMLAudioElement,
  outgoingFromVolume: number,
  durationMs: number,
  onComplete?: () => void
): FadingWorldPlazaBiomeMusicPlayback {
  const startedAtMs = performance.now();
  let frameId = 0;

  const steppingCrossfade = (nowMs: number): void => {
    const linearProgress = Math.min(1, (nowMs - startedAtMs) / durationMs);
    const easedProgress =
      easingWorldPlazaBiomeMusicFadeProgress(linearProgress);
    const fadeOutGain = Math.cos(easedProgress * Math.PI * 0.5);
    const fadeInGain = Math.sin(easedProgress * Math.PI * 0.5);
    const incomingTargetVolume =
      computingWorldPlazaBiomeMusicEffectiveTargetVolume();

    outgoingAudio.volume = Math.min(
      1,
      Math.max(0, outgoingFromVolume * fadeOutGain)
    );
    incomingAudio.volume = Math.min(
      1,
      Math.max(0, incomingTargetVolume * fadeInGain)
    );

    if (linearProgress >= 1) {
      onComplete?.();
      return;
    }

    frameId = window.requestAnimationFrame(steppingCrossfade);
  };

  frameId = window.requestAnimationFrame(steppingCrossfade);

  return {
    cancel: () => {
      window.cancelAnimationFrame(frameId);
    },
  };
}

function waitingWorldPlazaBiomeMusicAudioCanPlay(
  audio: HTMLAudioElement
): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const completingWhenReady = (): void => {
      audio.removeEventListener('canplay', completingWhenReady);
      resolve();
    };

    audio.addEventListener('canplay', completingWhenReady);
  });
}

type WorldPlazaBiomeMusicAudioSlot = {
  audio: HTMLAudioElement;
  tuneId: DefiningWorldPlazaCozyTuneId | null;
};

function applyingWorldPlazaMasterVolumeToBiomeMusicSlots(
  audioSlots: WorldPlazaBiomeMusicAudioSlot[],
  activeAudioSlotIndex: number,
  previousMasterVolume: number,
  nextMasterVolume: number,
  isAudioUnlocked: boolean
): void {
  if (previousMasterVolume === nextMasterVolume) {
    return;
  }

  const previousEffectiveTarget =
    DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME * previousMasterVolume;
  const nextEffectiveTarget =
    DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME * nextMasterVolume;

  if (!isAudioUnlocked) {
    return;
  }

  const activeSlot = audioSlots[activeAudioSlotIndex]!;
  const inactiveSlot = audioSlots[1 - activeAudioSlotIndex]!;

  if (inactiveSlot.audio.volume > 0 || !inactiveSlot.audio.paused) {
    inactiveSlot.audio.pause();
    inactiveSlot.audio.volume = 0;
  }

  if (activeSlot.tuneId === null) {
    return;
  }

  if (nextEffectiveTarget <= 0) {
    activeSlot.audio.volume = 0;
    return;
  }

  if (previousEffectiveTarget <= 0 || activeSlot.audio.volume <= 0) {
    activeSlot.audio.volume = nextEffectiveTarget;
    void activeSlot.audio.play().catch(() => {});
    return;
  }

  activeSlot.audio.volume = Math.min(
    1,
    Math.max(
      0,
      activeSlot.audio.volume * (nextEffectiveTarget / previousEffectiveTarget)
    )
  );
}

function creatingWorldPlazaBiomeMusicAudioSlot(): WorldPlazaBiomeMusicAudioSlot {
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 0;
  audio.preload = 'auto';

  return { audio, tuneId: null };
}

/**
 * Loops Cozy Tunes background music that follows the player's current biome.
 *
 * @module components/world/hooks/usingWorldPlazaBiomeMusic
 */
export function usingWorldPlazaBiomeMusic(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const audioSlotsRef = useRef<WorldPlazaBiomeMusicAudioSlot[]>([
    creatingWorldPlazaBiomeMusicAudioSlot(),
    creatingWorldPlazaBiomeMusicAudioSlot(),
  ]);
  const activeAudioSlotIndexRef = useRef(0);
  const currentTuneIdRef = useRef<DefiningWorldPlazaCozyTuneId | null>(null);
  const isAudioUnlockedRef = useRef(false);
  const crossfadeRef = useRef<FadingWorldPlazaBiomeMusicPlayback | null>(null);
  const fadeInRef = useRef<FadingWorldPlazaBiomeMusicPlayback | null>(null);
  const crossfadeGenerationRef = useRef(0);

  useEffect(() => {
    initializingWorldPlazaMasterVolumeStoreFromStorage();
    let previousMasterVolume = gettingWorldPlazaMasterVolume();

    const promotingLouderAudioSlotToActive = (): void => {
      const slot0 = audioSlotsRef.current[0]!;
      const slot1 = audioSlotsRef.current[1]!;

      if (slot1.audio.volume > slot0.audio.volume) {
        activeAudioSlotIndexRef.current = 1;
        slot0.audio.pause();
        slot0.audio.currentTime = 0;
        slot0.audio.volume = 0;
        slot0.tuneId = null;
        currentTuneIdRef.current = slot1.tuneId;
        return;
      }

      if (slot0.audio.volume > 0) {
        activeAudioSlotIndexRef.current = 0;
        slot1.audio.pause();
        slot1.audio.currentTime = 0;
        slot1.audio.volume = 0;
        slot1.tuneId = null;
        currentTuneIdRef.current = slot0.tuneId;
        return;
      }

      activeAudioSlotIndexRef.current = 0;
      slot1.audio.pause();
      slot1.audio.currentTime = 0;
      slot1.audio.volume = 0;
      slot1.tuneId = null;
    };

    const cancellingActiveCrossfade = (): void => {
      crossfadeRef.current?.cancel();
      fadeInRef.current?.cancel();
      crossfadeRef.current = null;
      fadeInRef.current = null;
      promotingLouderAudioSlotToActive();
      crossfadeGenerationRef.current += 1;
    };

    const resolvingActiveAudioSlot = (): WorldPlazaBiomeMusicAudioSlot => {
      return audioSlotsRef.current[activeAudioSlotIndexRef.current]!;
    };

    const resolvingInactiveAudioSlot = (): WorldPlazaBiomeMusicAudioSlot => {
      return audioSlotsRef.current[1 - activeAudioSlotIndexRef.current]!;
    };

    const switchingToTune = (tuneId: DefiningWorldPlazaCozyTuneId): void => {
      if (tuneId === currentTuneIdRef.current) {
        return;
      }

      currentTuneIdRef.current = tuneId;
      cancellingActiveCrossfade();

      const activeSlot = resolvingActiveAudioSlot();
      const inactiveSlot = resolvingInactiveAudioSlot();
      const crossfadeGeneration = crossfadeGenerationRef.current;

      const finishingCrossfade = (): void => {
        if (crossfadeGeneration !== crossfadeGenerationRef.current) {
          return;
        }

        activeSlot.audio.pause();
        activeSlot.audio.currentTime = 0;
        activeSlot.audio.volume = 0;
        activeSlot.tuneId = null;
        activeAudioSlotIndexRef.current = 1 - activeAudioSlotIndexRef.current;
        crossfadeRef.current = null;
        fadeInRef.current = null;
      };

      const beginningIncomingTrack = (): void => {
        inactiveSlot.audio.src = resolvingWorldPlazaBiomeMusicUrl(tuneId);
        inactiveSlot.audio.load();
        inactiveSlot.tuneId = tuneId;
        inactiveSlot.audio.volume = 0;

        if (!isAudioUnlockedRef.current) {
          return;
        }

        const startingCrossfade = (): void => {
          if (crossfadeGeneration !== crossfadeGenerationRef.current) {
            return;
          }

          const outgoingFromVolume = activeSlot.audio.paused
            ? 0
            : activeSlot.audio.volume;
          const hasOutgoingTrack = outgoingFromVolume > 0;

          if (!hasOutgoingTrack) {
            fadeInRef.current = fadingWorldPlazaBiomeMusicVolume(
              inactiveSlot.audio,
              0,
              DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
              finishingCrossfade
            );
            return;
          }

          crossfadeRef.current = crossfadingWorldPlazaBiomeMusicVolumes(
            activeSlot.audio,
            inactiveSlot.audio,
            outgoingFromVolume,
            DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
            finishingCrossfade
          );
        };

        const recoveringFromRejectedPlayback = (): void => {
          void waitingWorldPlazaBiomeMusicAudioCanPlay(inactiveSlot.audio)
            .then(() => {
              if (crossfadeGeneration !== crossfadeGenerationRef.current) {
                return;
              }

              return inactiveSlot.audio.play();
            })
            .then(() => {
              if (crossfadeGeneration !== crossfadeGenerationRef.current) {
                return;
              }

              startingCrossfade();
            })
            .catch(() => {
              if (crossfadeGeneration !== crossfadeGenerationRef.current) {
                return;
              }

              currentTuneIdRef.current = activeSlot.tuneId;
            });
        };

        // Mobile Safari requires play() on the same turn as the user gesture when possible.
        const immediatePlayPromise = inactiveSlot.audio.play();

        void immediatePlayPromise
          .then(() => {
            if (crossfadeGeneration !== crossfadeGenerationRef.current) {
              return;
            }

            startingCrossfade();
          })
          .catch(() => {
            if (crossfadeGeneration !== crossfadeGenerationRef.current) {
              return;
            }

            recoveringFromRejectedPlayback();
          });
      };

      beginningIncomingTrack();
    };

    const pollingBiomeMusic = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
      const { isDaytime } = computingWorldPlazaDayNightSunState();
      switchingToTune(
        resolvingWorldPlazaBiomeMusicTuneId(biome.kind, isDaytime)
      );
    };

    const primingBiomeMusicAudioSlotsForMobilePlayback = (): void => {
      for (const slot of audioSlotsRef.current) {
        if (!slot.audio.src) {
          continue;
        }

        void slot.audio.play().catch(() => {});
      }
    };

    const unlockingAudio = (): void => {
      const effectiveTargetVolume =
        computingWorldPlazaBiomeMusicEffectiveTargetVolume();
      const shouldRetryPlayback =
        !isAudioUnlockedRef.current ||
        (effectiveTargetVolume > 0 &&
          !checkingWorldPlazaBiomeMusicIsAudible(audioSlotsRef.current));

      if (!shouldRetryPlayback) {
        return;
      }

      isAudioUnlockedRef.current = true;
      primingBiomeMusicAudioSlotsForMobilePlayback();
      currentTuneIdRef.current = null;
      pollingBiomeMusic();
    };

    const handlingMasterVolumeChange = (): void => {
      const nextMasterVolume = gettingWorldPlazaMasterVolume();

      crossfadeRef.current?.cancel();
      fadeInRef.current?.cancel();
      crossfadeRef.current = null;
      fadeInRef.current = null;

      applyingWorldPlazaMasterVolumeToBiomeMusicSlots(
        audioSlotsRef.current,
        activeAudioSlotIndexRef.current,
        previousMasterVolume,
        nextMasterVolume,
        isAudioUnlockedRef.current
      );
      previousMasterVolume = nextMasterVolume;

      if (isAudioUnlockedRef.current) {
        pollingBiomeMusic();
      }
    };

    const unsubscribeMasterVolume = subscribingWorldPlazaMasterVolume(
      handlingMasterVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(unlockingAudio);

    pollingBiomeMusic();
    const intervalId = window.setInterval(
      pollingBiomeMusic,
      DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS
    );

    for (const unlockEvent of DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS) {
      window.addEventListener(unlockEvent, unlockingAudio);
    }

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeMasterVolume();
      window.clearInterval(intervalId);

      for (const unlockEvent of DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS) {
        window.removeEventListener(unlockEvent, unlockingAudio);
      }
      cancellingActiveCrossfade();

      for (const slot of audioSlotsRef.current) {
        slot.audio.pause();
        slot.audio.removeAttribute('src');
        slot.audio.load();
        slot.tuneId = null;
      }

      activeAudioSlotIndexRef.current = 0;
      currentTuneIdRef.current = null;
      isAudioUnlockedRef.current = false;
    };
  }, [playerPositionRef]);
}
