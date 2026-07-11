'use client';

import { buildingWorldPlazaBiomeMusicBootStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicBootStarAudioManifest';
import { computingWorldPlazaBiomeMusicEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeMusicEffectiveTargetVolume';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import {
  gettingWorldPlazaMasterVolume,
  initializingWorldPlazaMasterVolumeStoreFromStorage,
  subscribingWorldPlazaMasterVolume,
} from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';
import {
  acquiringWorldPlazaStarAudio,
  preloadingWorldPlazaStarAudioManifest,
  releasingWorldPlazaStarAudio,
} from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaBiomeMusicStarAudioId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicStarAudioId';
import { resolvingWorldPlazaBiomeMusicTuneId } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicTuneId';
import { registeringWorldPlazaBiomeMusicUserGestureUnlock } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS } from '@/components/world/wildlife/domains/definingWildlifeBootTexturePreloadConstants';
import { useEffect, useRef } from 'react';
import type { StarAudio } from 'star-audio';

/**
 * Starts spawn-biome music during the world loading screen.
 *
 * Keeps the shared music bus alive from title → boot → plaza so the player
 * does not sit in silence while sprites and SFX warm. Scene biome music adopts
 * the same track without restarting when it mounts.
 *
 * @module components/world/loading/hooks/usingWorldPlazaWorldLoadingBiomeMusic
 */
export function usingWorldPlazaWorldLoadingBiomeMusic(): void {
  const starAudioRef = useRef<StarAudio | null>(null);
  const isPreloadReadyRef = useRef(false);

  useEffect(() => {
    const starAudio = acquiringWorldPlazaStarAudio();
    starAudioRef.current = starAudio;

    initializingWorldPlazaMasterVolumeStoreFromStorage();

    const bootBiomeKind = DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS[0];

    if (!bootBiomeKind) {
      return () => {
        releasingWorldPlazaStarAudio();
        starAudioRef.current = null;
      };
    }

    const applyingMasterMusicVolume = (): void => {
      starAudio.setMusicVolume(
        computingWorldPlazaBiomeMusicEffectiveTargetVolume()
      );
    };

    const startingBootBiomeMusic = (): void => {
      if (!isPreloadReadyRef.current) {
        return;
      }

      if (starAudio.state === 'locked') {
        return;
      }

      if (gettingWorldPlazaMasterVolume() <= 0) {
        starAudio.music.stop(
          DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000
        );
        return;
      }

      const { isDaytime } = computingWorldPlazaDayNightSunState();
      const tuneId = resolvingWorldPlazaBiomeMusicTuneId(
        bootBiomeKind,
        isDaytime
      );

      applyingMasterMusicVolume();
      void starAudio.music.crossfadeTo(
        resolvingWorldPlazaBiomeMusicStarAudioId(tuneId),
        {
          duration: DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000,
          loop: true,
        }
      );
    };

    const unlockingAndRetryingBootBiomeMusic = (): void => {
      void starAudio.unlock();
      applyingMasterMusicVolume();
      startingBootBiomeMusic();
    };

    const handlingMasterVolumeChange = (): void => {
      applyingMasterMusicVolume();
      startingBootBiomeMusic();
    };

    applyingMasterMusicVolume();
    void preloadingWorldPlazaStarAudioManifest(
      buildingWorldPlazaBiomeMusicBootStarAudioManifest()
    ).then(() => {
      isPreloadReadyRef.current = true;
      startingBootBiomeMusic();
    });

    const unsubscribeMasterVolume = subscribingWorldPlazaMasterVolume(
      handlingMasterVolumeChange
    );
    const unregisterUserGestureUnlock =
      registeringWorldPlazaBiomeMusicUserGestureUnlock(
        unlockingAndRetryingBootBiomeMusic
      );

    starAudio.on('unlocked', startingBootBiomeMusic);
    starAudio.on('resumed', startingBootBiomeMusic);

    return () => {
      unregisterUserGestureUnlock();
      unsubscribeMasterVolume();
      starAudio.off('unlocked', startingBootBiomeMusic);
      starAudio.off('resumed', startingBootBiomeMusic);
      // Do not stop music: plaza biome music adopts the shared bus.
      releasingWorldPlazaStarAudio();
      starAudioRef.current = null;
      isPreloadReadyRef.current = false;
    };
  }, []);
}
