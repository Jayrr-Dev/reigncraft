'use client';

import { checkingWorldPlazaBiomeMusicIsPlaying } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsPlaying';
import { computingWorldPlazaBiomeMusicSlotTargetGain } from '@/components/world/domains/computingWorldPlazaBiomeMusicSlotTargetGain';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_PLAYBACK_WATCHDOG_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  clearingWorldPlazaBiomeMusicBufferCache,
  loadingWorldPlazaBiomeMusicAudioBuffer,
  prefetchingWorldPlazaBiomeMusicAudioBuffer,
} from '@/components/world/domains/loadingWorldPlazaBiomeMusicAudioBuffer';
import {
  closingWorldPlazaBiomeMusicAudioContext,
  gettingWorldPlazaBiomeMusicAudioContext,
  gettingWorldPlazaBiomeMusicMasterGainNode,
  resumingWorldPlazaBiomeMusicAudioContext,
} from '@/components/world/domains/managingWorldPlazaBiomeMusicAudioContext';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import {
  applyingWorldPlazaBiomeMusicMasterGain,
  schedulingWorldPlazaBiomeMusicGainCrossfade,
  schedulingWorldPlazaBiomeMusicGainFadeIn,
  type SchedulingWorldPlazaBiomeMusicGainRampPlayback,
} from '@/components/world/domains/schedulingWorldPlazaBiomeMusicGainRamp';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { useEffect, useRef } from 'react';

type WorldPlazaBiomeMusicAudioSlot = {
  gainNode: GainNode;
  source: AudioBufferSourceNode | null;
  tuneId: DefiningWorldPlazaCozyTuneId | null;
  isPlaying: boolean;
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

function stoppingWorldPlazaBiomeMusicSlotSource(
  slot: WorldPlazaBiomeMusicAudioSlot
): void {
  if (!slot.source) {
    slot.isPlaying = false;
    return;
  }

  const source = slot.source;
  slot.source = null;
  slot.isPlaying = false;

  try {
    source.stop();
  } catch {
    // Already stopped.
  }

  source.disconnect();
}

function startingWorldPlazaBiomeMusicSlotSource(
  audioContext: AudioContext,
  slot: WorldPlazaBiomeMusicAudioSlot,
  audioBuffer: AudioBuffer
): void {
  stoppingWorldPlazaBiomeMusicSlotSource(slot);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true;
  source.connect(slot.gainNode);
  source.onended = () => {
    if (slot.source === source) {
      slot.source = null;
      slot.isPlaying = false;
    }
  };
  source.start(0);

  slot.source = source;
  slot.isPlaying = true;
}

function creatingWorldPlazaBiomeMusicAudioSlot(
  audioContext: AudioContext,
  masterGainNode: GainNode
): WorldPlazaBiomeMusicAudioSlot {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  gainNode.connect(masterGainNode);

  return {
    gainNode,
    source: null,
    tuneId: null,
    isPlaying: false,
  };
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
  const masterGainNodeRef = useRef<GainNode | null>(null);
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
    const masterGainNode =
      gettingWorldPlazaBiomeMusicMasterGainNode(audioContext);
    audioContextRef.current = audioContext;
    masterGainNodeRef.current = masterGainNode;
    audioSlotsRef.current = [
      creatingWorldPlazaBiomeMusicAudioSlot(audioContext, masterGainNode),
      creatingWorldPlazaBiomeMusicAudioSlot(audioContext, masterGainNode),
    ];

    initializingWorldPlazaMasterVolumeStoreFromStorage();
    applyingWorldPlazaBiomeMusicMasterGain(audioContext, masterGainNode);

    const promotingPreferredAudioSlotToActive = (): void => {
      const slot0 = audioSlotsRef.current[0]!;
      const slot1 = audioSlotsRef.current[1]!;

      const pausingSlot = (slot: WorldPlazaBiomeMusicAudioSlot): void => {
        stoppingWorldPlazaBiomeMusicSlotSource(slot);
        settingWorldPlazaBiomeMusicSlotGain(audioContext, slot.gainNode, 0);
        slot.tuneId = null;
      };

      if (slot0.isPlaying && !slot1.isPlaying) {
        activeAudioSlotIndexRef.current = 0;
        pausingSlot(slot1);
        currentTuneIdRef.current = slot0.tuneId;
        return;
      }

      if (slot1.isPlaying && !slot0.isPlaying) {
        activeAudioSlotIndexRef.current = 1;
        pausingSlot(slot0);
        currentTuneIdRef.current = slot1.tuneId;
        return;
      }

      if (slot1.gainNode.gain.value > slot0.gainNode.gain.value) {
        activeAudioSlotIndexRef.current = 1;
        pausingSlot(slot0);
        currentTuneIdRef.current = slot1.tuneId;
        return;
      }

      if (slot0.gainNode.gain.value > 0.001) {
        activeAudioSlotIndexRef.current = 0;
        pausingSlot(slot1);
        currentTuneIdRef.current = slot0.tuneId;
        return;
      }

      activeAudioSlotIndexRef.current = 0;
      pausingSlot(slot1);
    };

    const cancellingActiveCrossfade = (): void => {
      crossfadeRef.current?.cancel();
      fadeInRef.current?.cancel();
      crossfadeRef.current = null;
      fadeInRef.current = null;
      promotingPreferredAudioSlotToActive();
      crossfadeGenerationRef.current += 1;
    };

    const resolvingActiveAudioSlot = (): WorldPlazaBiomeMusicAudioSlot => {
      return audioSlotsRef.current[activeAudioSlotIndexRef.current]!;
    };

    const resolvingInactiveAudioSlot = (): WorldPlazaBiomeMusicAudioSlot => {
      return audioSlotsRef.current[1 - activeAudioSlotIndexRef.current]!;
    };

    const resumingActiveSlotPlaybackIfNeeded = (): void => {
      if (!isAudioUnlockedRef.current || gettingWorldPlazaMasterVolume() <= 0) {
        return;
      }

      const activeSlot = resolvingActiveAudioSlot();

      if (
        activeSlot.tuneId === null ||
        activeSlot.isPlaying ||
        activeSlot.tuneId !== currentTuneIdRef.current
      ) {
        return;
      }

      void loadingWorldPlazaBiomeMusicAudioBuffer(
        audioContext,
        activeSlot.tuneId
      )
        .then((audioBuffer) => {
          if (activeSlot.tuneId !== currentTuneIdRef.current) {
            return;
          }

          startingWorldPlazaBiomeMusicSlotSource(
            audioContext,
            activeSlot,
            audioBuffer
          );
          settingWorldPlazaBiomeMusicSlotGain(
            audioContext,
            activeSlot.gainNode,
            computingWorldPlazaBiomeMusicSlotTargetGain()
          );
        })
        .catch(() => {});
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

        stoppingWorldPlazaBiomeMusicSlotSource(activeSlot);
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
        inactiveSlot.tuneId = tuneId;
        settingWorldPlazaBiomeMusicSlotGain(
          audioContext,
          inactiveSlot.gainNode,
          0
        );

        if (!isAudioUnlockedRef.current) {
          prefetchingWorldPlazaBiomeMusicAudioBuffer(audioContext, tuneId);
          return;
        }

        const startingCrossfade = (): void => {
          if (crossfadeGeneration !== crossfadeGenerationRef.current) {
            return;
          }

          const outgoingFromGain = activeSlot.isPlaying
            ? activeSlot.gainNode.gain.value
            : 0;
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

        void loadingWorldPlazaBiomeMusicAudioBuffer(audioContext, tuneId)
          .then((audioBuffer) => {
            if (crossfadeGeneration !== crossfadeGenerationRef.current) {
              return;
            }

            if (currentTuneIdRef.current !== tuneId) {
              return;
            }

            startingWorldPlazaBiomeMusicSlotSource(
              audioContext,
              inactiveSlot,
              audioBuffer
            );
            startingCrossfade();
          })
          .catch(() => {
            if (crossfadeGeneration !== crossfadeGenerationRef.current) {
              return;
            }

            currentTuneIdRef.current = activeSlot.tuneId;
          });
      };

      beginningIncomingTrack();
    };

    const resolvingCurrentBiomeTuneId =
      (): DefiningWorldPlazaCozyTuneId | null => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return null;
        }

        const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
        const { isDaytime } = computingWorldPlazaDayNightSunState();

        return resolvingWorldPlazaBiomeMusicTuneId(biome.kind, isDaytime);
      };

    const pollingBiomeMusic = (): void => {
      const tuneId = resolvingCurrentBiomeTuneId();

      if (!tuneId) {
        return;
      }

      prefetchingWorldPlazaBiomeMusicAudioBuffer(audioContext, tuneId);
      switchingToTune(tuneId);
    };

    const unlockingAudio = (): void => {
      resumingWorldPlazaBiomeMusicAudioContext();

      const shouldRetryPlayback =
        !isAudioUnlockedRef.current ||
        (gettingWorldPlazaMasterVolume() > 0 &&
          !checkingWorldPlazaBiomeMusicIsPlaying(audioSlotsRef.current));

      if (!shouldRetryPlayback) {
        resumingActiveSlotPlaybackIfNeeded();
        return;
      }

      isAudioUnlockedRef.current = true;
      currentTuneIdRef.current = null;
      pollingBiomeMusic();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingWorldPlazaBiomeMusicMasterGain(audioContext, masterGainNode);

      if (!isAudioUnlockedRef.current) {
        return;
      }

      resumingActiveSlotPlaybackIfNeeded();
      pollingBiomeMusic();
    };

    const handlingVisibilityResume = (): void => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      resumingWorldPlazaBiomeMusicAudioContext();
      applyingWorldPlazaBiomeMusicMasterGain(audioContext, masterGainNode);
      resumingActiveSlotPlaybackIfNeeded();
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
    const watchdogIntervalId = window.setInterval(
      resumingActiveSlotPlaybackIfNeeded,
      DEFINING_WORLD_PLAZA_BIOME_MUSIC_PLAYBACK_WATCHDOG_INTERVAL_MS
    );

    for (const unlockEvent of DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS) {
      window.addEventListener(unlockEvent, unlockingAudio);
    }

    document.addEventListener('visibilitychange', handlingVisibilityResume);

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeMasterVolume();
      window.clearInterval(intervalId);
      window.clearInterval(watchdogIntervalId);
      document.removeEventListener(
        'visibilitychange',
        handlingVisibilityResume
      );

      for (const unlockEvent of DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS) {
        window.removeEventListener(unlockEvent, unlockingAudio);
      }

      cancellingActiveCrossfade();

      for (const slot of audioSlotsRef.current) {
        stoppingWorldPlazaBiomeMusicSlotSource(slot);
        slot.tuneId = null;
        settingWorldPlazaBiomeMusicSlotGain(audioContext, slot.gainNode, 0);
      }

      audioSlotsRef.current = [];
      activeAudioSlotIndexRef.current = 0;
      currentTuneIdRef.current = null;
      isAudioUnlockedRef.current = false;
      audioContextRef.current = null;
      masterGainNodeRef.current = null;
      clearingWorldPlazaBiomeMusicBufferCache();
      closingWorldPlazaBiomeMusicAudioContext();
    };
  }, [playerPositionRef]);
}
