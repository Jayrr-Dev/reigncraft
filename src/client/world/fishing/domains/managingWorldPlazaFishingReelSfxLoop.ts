/**
 * Looping reel-winding SFX while the player holds reel during a cast.
 *
 * @module components/world/fishing/domains/managingWorldPlazaFishingReelSfxLoop
 */

import type { SoundHandle } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import { playingWorldPlazaStarAudioSfx } from '@/components/world/domains/managingWorldPlazaStarAudio';
import { computingWorldPlazaFishingSfxEffectiveVolume } from '@/components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_FISHING_SFX_REEL_PROFILE } from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import { resolvingWorldPlazaFishingSfxStarAudioId } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingSfxStarAudioId';

let managingWorldPlazaFishingReelSfxLoopHandle: SoundHandle | null = null;

export function startingWorldPlazaFishingReelSfxLoop(): void {
  if (managingWorldPlazaFishingReelSfxLoopHandle?.playing) {
    return;
  }

  const peakVolume = computingWorldPlazaFishingSfxEffectiveVolume(
    DEFINING_WORLD_PLAZA_FISHING_SFX_REEL_PROFILE
  );

  if (peakVolume <= 0) {
    return;
  }

  managingWorldPlazaFishingReelSfxLoopHandle = playingWorldPlazaStarAudioSfx(
    resolvingWorldPlazaFishingSfxStarAudioId('reel_winding'),
    {
      volume: peakVolume,
      loop: true,
    }
  );
}

export function stoppingWorldPlazaFishingReelSfxLoop(): void {
  const handle = managingWorldPlazaFishingReelSfxLoopHandle;

  if (!handle) {
    return;
  }

  if (handle.playing) {
    handle.stop();
  }

  managingWorldPlazaFishingReelSfxLoopHandle = null;
}
