'use client';

import { checkingWorldPlazaBiomeMusicIsPlaying } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsPlaying';
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
  closingWorldPlazaBiomeMusicAudioContext,
  gettingWorldPlazaBiomeMusicAudioContext,
  resumingWorldPlazaBiomeMusicAudioContext,
} from '@/components/world/domains/managingWorldPlazaBiomeMusicAudioContext';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import {
  schedulingWorldPlazaBiomeMusicGainCrossfade,
  schedulingWorldPlazaBiomeMusicGainFadeIn,
  type SchedulingWorldPlazaBiomeMusicGainRampPlayback,
} from '@/components/world/domains/schedulingWorldPlazaBiomeMusicGainRamp';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';

function waitingWorldPlazaBiomeMusicAudioCanPlay(
  audio: HTMLAudioElement
): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const completingWhenReady = (): void => {
      audio.removeEventListener('loadedmetadata', completingWhenReady);
      audio.removeEventListener('canplay', completingWhenReady);
      resolve();
    };

    audio.addEventListener('loadedmetadata', completingWhenReady);
    audio.addEventListener('canplay', completingWhenReady);
  });
}

type WorldPlazaBiomeMusicAudioSlot = {
  audio: HTMLAudioElement;
  gainNode: GainNode;
  tuneId: DefiningWorldPlazaCozyTuneId | null;
};

function settingWorldPlazaBiomeMusicSlotGain(
  audioContext: AudioContext,
  gainNode: GainNode,
  gain: number
): void {
  const audioNow = audioContext.currentTime;
  gainNode.gain.cancelScheduledValues(audioNow);
  gainNode.gain.setValueAtTime(Math.min(1, Math.max(0, gain)), audioNow);
}

function applyingWorldPlazaMasterVolumeToBiomeMusicSlots(
  audioContext: AudioContext,
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

  if (inactiveSlot.gainNode.gain.value > 0.001 || !inactiveSlot.audio.paused) {
    inactiveSlot.audio.pause();
    inactiveSlot.audio.currentTime = 0;
    settingWorldPlazaBiomeMusicSlotGain(audioContext, inactiveSlot.gainNode, 0);
  }

  if (activeSlot.tuneId === null) {
    return;
  }

  if (nextEffectiveTarget <= 0) {
    settingWorldPlazaBiomeMusicSlotGain(audioContext, activeSlot.gainNode, 0);
    return;
  }

  if (previousEffectiveTarget <= 0 || activeSlot.gainNode.gain.value <= 0.001) {
    settingWorldPlazaBiomeMusicSlotGain(
      audioContext,
      activeSlot.gainNode,
      nextEffectiveTarget
    );
    void activeSlot.audio.play().catch(() => {});
    return;
  }

  settingWorldPlazaBiomeMusicSlotGain(
    audioContext,
    activeSlot.gainNode,
    Math.min(
      1,
      Math.max(
        0,
        activeSlot.gainNode.gain.value *
          (nextEffectiveTarget / previousEffectiveTarget)
      )
    )
  );
}

function creatingWorldPlazaBiomeMusicAudioSlot(
  audioContext: AudioContext
): WorldPlazaBiomeMusicAudioSlot {
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 1;
  audio.preload = 'auto';

  const mediaSource = audioContext.createMediaElementSource(audio);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  mediaSource.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { audio, gainNode, tuneId: null };
}

/**
 * Loops Cozy Tunes background music that follows the player's current biome.
 *
 * @module components/world/hooks/usingWorldPlazaBiomeMusic
 */
export function usingWorldPlazaBiomeMusic(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSlotsRef = useRef<WorldPlazaBiomeMusicAudioSlot[]>([]);
  const activeAudioSlotIndexRef = useRef(0);
  const currentTuneIdRef = useRef<DefiningWorldPlazaCozyTuneId | null>(null);
  const isAudioUnlockedRef = useRef(false);
  const crossfadeRef =
    useRef<SchedulingWorldPlazaBiomeMusicGainRampPlayback | null>(null);
  const fadeInRef =
    useRef<SchedulingWorldPlazaBiomeMusicGainRampPlayback | null>(null);
  const crossfadeGenerationRef = useRef(0);

  useEffect(() => {
    const audioContext = gettingWorldPlazaBiomeMusicAudioContext();
    audioContextRef.current = audioContext;
    audioSlotsRef.current = [
      creatingWorldPlazaBiomeMusicAudioSlot(audioContext),
      creatingWorldPlazaBiomeMusicAudioSlot(audioContext),
    ];

    initializingWorldPlazaMasterVolumeStoreFromStorage();
    let previousMasterVolume = gettingWorldPlazaMasterVolume();

    const promotingLouderAudioSlotToActive = (): void => {
      const slot0 = audioSlotsRef.current[0]!;
      const slot1 = audioSlotsRef.current[1]!;

      if (slot1.gainNode.gain.value > slot0.gainNode.gain.value) {
        activeAudioSlotIndexRef.current = 1;
        slot0.audio.pause();
        slot0.audio.currentTime = 0;
        settingWorldPlazaBiomeMusicSlotGain(audioContext, slot0.gainNode, 0);
        slot0.tuneId = null;
        currentTuneIdRef.current = slot1.tuneId;
        return;
      }

      if (slot0.gainNode.gain.value > 0.001) {
        activeAudioSlotIndexRef.current = 0;
        slot1.audio.pause();
        slot1.audio.currentTime = 0;
        settingWorldPlazaBiomeMusicSlotGain(audioContext, slot1.gainNode, 0);
        slot1.tuneId = null;
        currentTuneIdRef.current = slot0.tuneId;
        return;
      }

      activeAudioSlotIndexRef.current = 0;
      slot1.audio.pause();
      slot1.audio.currentTime = 0;
      settingWorldPlazaBiomeMusicSlotGain(audioContext, slot1.gainNode, 0);
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
        settingWorldPlazaBiomeMusicSlotGain(
          audioContext,
          activeSlot.gainNode,
          0
        );
        activeSlot.tuneId = null;
        activeAudioSlotIndexRef.current = 1 - activeAudioSlotIndexRef.current;
        crossfadeRef.current = null;
        fadeInRef.current = null;
      };

      const beginningIncomingTrack = (): void => {
        inactiveSlot.audio.src = resolvingWorldPlazaBiomeMusicUrl(tuneId);
        inactiveSlot.audio.load();
        inactiveSlot.tuneId = tuneId;
        settingWorldPlazaBiomeMusicSlotGain(
          audioContext,
          inactiveSlot.gainNode,
          0
        );

        if (!isAudioUnlockedRef.current) {
          return;
        }

        const startingCrossfade = (): void => {
          if (crossfadeGeneration !== crossfadeGenerationRef.current) {
            return;
          }

          const outgoingFromGain = activeSlot.audio.paused
            ? 0
            : activeSlot.gainNode.gain.value;
          const hasOutgoingTrack = outgoingFromGain > 0.001;

          if (!hasOutgoingTrack) {
            fadeInRef.current = schedulingWorldPlazaBiomeMusicGainFadeIn(
              audioContext,
              inactiveSlot.gainNode,
              0,
              DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
              finishingCrossfade
            );
            return;
          }

          crossfadeRef.current = schedulingWorldPlazaBiomeMusicGainCrossfade(
            audioContext,
            activeSlot.gainNode,
            inactiveSlot.gainNode,
            outgoingFromGain,
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

    const unlockingAudio = (): void => {
      resumingWorldPlazaBiomeMusicAudioContext();

      const effectiveTargetVolume =
        computingWorldPlazaBiomeMusicEffectiveTargetVolume();
      const shouldRetryPlayback =
        !isAudioUnlockedRef.current ||
        (effectiveTargetVolume > 0 &&
          !checkingWorldPlazaBiomeMusicIsPlaying(audioSlotsRef.current));

      if (!shouldRetryPlayback) {
        return;
      }

      isAudioUnlockedRef.current = true;
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
        audioContext,
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
        settingWorldPlazaBiomeMusicSlotGain(audioContext, slot.gainNode, 0);
      }

      audioSlotsRef.current = [];
      activeAudioSlotIndexRef.current = 0;
      currentTuneIdRef.current = null;
      isAudioUnlockedRef.current = false;
      audioContextRef.current = null;
      closingWorldPlazaBiomeMusicAudioContext();
    };
  }, [playerPositionRef]);
}
