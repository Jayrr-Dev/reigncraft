'use client';

import { buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
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
  crossfadingWorldPlazaMusicBusTo,
  gettingWorldPlazaMusicBusActiveStarAudioId,
  settingWorldPlazaMusicBusTargetVolume,
  stoppingWorldPlazaMusicBus,
} from '@/components/world/domains/managingWorldPlazaMusicBus';
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
 * the same track without restarting when it mounts. If the bus already has a
 * track (title or plaza), this hook only refreshes volume and does not steal.
 *
 * After music is ready, warms girl (avatar) spawn-surface footsteps in the
 * background so they overlap sprite loading and hit cache on the boot audio step.
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
      settingWorldPlazaMusicBusTargetVolume(
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
        stoppingWorldPlazaMusicBus(
          DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000
        );
        return;
      }

      applyingMasterMusicVolume();

      // Title / plaza may already own the bus; do not restart or fight them.
      if (gettingWorldPlazaMusicBusActiveStarAudioId() !== null) {
        return;
      }

      const { isDaytime } = computingWorldPlazaDayNightSunState();
      const tuneId = resolvingWorldPlazaBiomeMusicTuneId(
        bootBiomeKind,
        isDaytime
      );

      crossfadingWorldPlazaMusicBusTo(
        starAudio,
        resolvingWorldPlazaBiomeMusicStarAudioId(tuneId),
        {
          durationSec: DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS / 1000,
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

      // Music first; then girl footsteps while textures still load.
      void preloadingWorldPlazaStarAudioManifest(
        buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest()
      ).catch(() => {
        // Boot audio step / runtime footstep hook retry on mount.
      });
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
