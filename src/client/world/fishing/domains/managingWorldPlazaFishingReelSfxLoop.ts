/**
 * Looping reel-winding SFX while the player holds reel during a cast.
 *
 * Starts once per hold; ignores repeat start calls so a short clip / overlay
 * remount cannot restart the sample from the beginning every frame.
 *
 * @module components/world/fishing/domains/managingWorldPlazaFishingReelSfxLoop
 */

import type { SoundHandle } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import { playingWorldPlazaStarAudioSfx } from '@/components/world/domains/managingWorldPlazaStarAudio';
import { computingWorldPlazaFishingSfxEffectiveVolume } from '@/components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_FISHING_SFX_REEL_PROFILE } from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import { resolvingWorldPlazaFishingSfxStarAudioId } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingSfxStarAudioId';

let managingWorldPlazaFishingReelSfxLoopHandle: SoundHandle | null = null;
let managingWorldPlazaFishingReelSfxLoopDesired = false;

export function startingWorldPlazaFishingReelSfxLoop(): void {
  managingWorldPlazaFishingReelSfxLoopDesired = true;

  const existingHandle = managingWorldPlazaFishingReelSfxLoopHandle;

  if (existingHandle?.playing) {
    return;
  }

  // Stale handle after an engine prune — drop and recreate once.
  managingWorldPlazaFishingReelSfxLoopHandle = null;

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
  managingWorldPlazaFishingReelSfxLoopDesired = false;

  const handle = managingWorldPlazaFishingReelSfxLoopHandle;
  managingWorldPlazaFishingReelSfxLoopHandle = null;

  if (!handle) {
    return;
  }

  if (handle.playing) {
    handle.stop();
  }
}

export function checkingWorldPlazaFishingReelSfxLoopDesired(): boolean {
  return managingWorldPlazaFishingReelSfxLoopDesired;
}
