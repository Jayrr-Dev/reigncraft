'use client';

import {
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaBiomeAtWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';
import { useEffect, useRef } from 'react';

type FadingWorldPlazaBiomeMusicPlayback = {
  cancel: () => void;
};

function fadingWorldPlazaBiomeMusicVolume(
  audio: HTMLAudioElement,
  fromVolume: number,
  toVolume: number,
  durationMs: number,
  onComplete?: () => void
): FadingWorldPlazaBiomeMusicPlayback {
  const startedAtMs = performance.now();
  let frameId = 0;

  const steppingVolumeFade = (nowMs: number): void => {
    const progress = Math.min(1, (nowMs - startedAtMs) / durationMs);
    audio.volume = Math.min(
      1,
      Math.max(0, fromVolume + (toVolume - fromVolume) * progress)
    );

    if (progress >= 1) {
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

/**
 * Loops Cozy Tunes background music that follows the player's current biome.
 *
 * @module components/world/hooks/usingWorldPlazaBiomeMusic
 */
export function usingWorldPlazaBiomeMusic(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTuneIdRef = useRef<DefiningWorldPlazaCozyTuneId | null>(null);
  const isAudioUnlockedRef = useRef(false);
  const fadeRef = useRef<FadingWorldPlazaBiomeMusicPlayback | null>(null);
  const isSwitchingTrackRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    const switchingToTune = (tuneId: DefiningWorldPlazaCozyTuneId): void => {
      if (tuneId === currentTuneIdRef.current || isSwitchingTrackRef.current) {
        return;
      }

      currentTuneIdRef.current = tuneId;
      isSwitchingTrackRef.current = true;
      fadeRef.current?.cancel();

      const beginNextTrack = (): void => {
        audio.src = resolvingWorldPlazaBiomeMusicUrl(tuneId);
        audio.load();

        const playingNextTrack = (): void => {
          fadeRef.current = fadingWorldPlazaBiomeMusicVolume(
            audio,
            audio.volume,
            DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME,
            DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
            () => {
              isSwitchingTrackRef.current = false;
            }
          );
        };

        if (!isAudioUnlockedRef.current) {
          isSwitchingTrackRef.current = false;
          return;
        }

        void audio
          .play()
          .then(playingNextTrack)
          .catch(() => {
            isSwitchingTrackRef.current = false;
          });
      };

      if (audio.paused && audio.currentTime === 0 && audio.volume === 0) {
        beginNextTrack();
        return;
      }

      fadeRef.current = fadingWorldPlazaBiomeMusicVolume(
        audio,
        audio.volume,
        0,
        DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS,
        () => {
          audio.pause();
          beginNextTrack();
        }
      );
    };

    const pollingBiomeMusic = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);
      switchingToTune(DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND[biome.kind]);
    };

    const unlockingAudio = (): void => {
      if (isAudioUnlockedRef.current) {
        return;
      }

      isAudioUnlockedRef.current = true;
      currentTuneIdRef.current = null;
      pollingBiomeMusic();
    };

    pollingBiomeMusic();
    const intervalId = window.setInterval(
      pollingBiomeMusic,
      DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS
    );

    window.addEventListener('pointerdown', unlockingAudio);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('pointerdown', unlockingAudio);
      fadeRef.current?.cancel();
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
      currentTuneIdRef.current = null;
      isAudioUnlockedRef.current = false;
      isSwitchingTrackRef.current = false;
    };
  }, [playerPositionRef]);
}
