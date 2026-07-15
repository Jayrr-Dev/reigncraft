/**
 * @module components/world/fishing/domains/playingWorldPlazaFishingSfx
 */

import {
  computingWorldPlazaFishingCatchRewardSfxEffectiveVolume,
  computingWorldPlazaFishingSfxEffectiveVolume,
} from '@/components/world/fishing/domains/computingWorldPlazaFishingSfxEffectiveVolume';
import type { DefiningWorldPlazaFishingCatchCatalogEntry } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import {
  DEFINING_WORLD_PLAZA_FISHING_SFX_CAST_START_PROFILE,
  DEFINING_WORLD_PLAZA_FISHING_SFX_CREATURE_CATCH_PROFILE,
  DEFINING_WORLD_PLAZA_FISHING_SFX_JUNK_CATCH_PROFILE,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import {
  startingWorldPlazaFishingReelSfxLoop,
  stoppingWorldPlazaFishingReelSfxLoop,
} from '@/components/world/fishing/domains/managingWorldPlazaFishingReelSfxLoop';
import { playingWorldPlazaFishingSfxOneShot } from '@/components/world/fishing/domains/playingWorldPlazaFishingSfxOneShot';
import { resolvingWildlifeStudySfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxStarAudioId';

export type PlayingWorldPlazaFishingSfxRequest =
  | { readonly actionId: 'cast_start' }
  | { readonly actionId: 'reel_hold_start' }
  | { readonly actionId: 'reel_hold_stop' }
  | {
      readonly actionId: 'catch';
      readonly catchEntry: DefiningWorldPlazaFishingCatchCatalogEntry;
    };

type PlayingWorldPlazaFishingSfxHandler = (
  request: PlayingWorldPlazaFishingSfxRequest
) => void;

let playingWorldPlazaFishingSfxHandler: PlayingWorldPlazaFishingSfxHandler | null =
  null;

export function registeringWorldPlazaFishingSfxPlayback(
  handler: PlayingWorldPlazaFishingSfxHandler
): () => void {
  playingWorldPlazaFishingSfxHandler = handler;

  return () => {
    if (playingWorldPlazaFishingSfxHandler === handler) {
      playingWorldPlazaFishingSfxHandler = null;
    }
  };
}

export function playingWorldPlazaFishingSfx(
  request: PlayingWorldPlazaFishingSfxRequest
): void {
  playingWorldPlazaFishingSfxHandler?.(request);
}

export function playingWorldPlazaFishingSfxFromRequest(
  request: PlayingWorldPlazaFishingSfxRequest
): void {
  if (request.actionId === 'cast_start') {
    const peakVolume = computingWorldPlazaFishingSfxEffectiveVolume(
      DEFINING_WORLD_PLAZA_FISHING_SFX_CAST_START_PROFILE
    );

    if (peakVolume <= 0) {
      return;
    }

    playingWorldPlazaFishingSfxOneShot({
      ...DEFINING_WORLD_PLAZA_FISHING_SFX_CAST_START_PROFILE,
      peakVolume,
    });
    return;
  }

  if (request.actionId === 'reel_hold_start') {
    startingWorldPlazaFishingReelSfxLoop();
    return;
  }

  if (request.actionId === 'reel_hold_stop') {
    stoppingWorldPlazaFishingReelSfxLoop();
    return;
  }

  if (request.catchEntry.kind === 'junk') {
    const peakVolume = computingWorldPlazaFishingSfxEffectiveVolume(
      DEFINING_WORLD_PLAZA_FISHING_SFX_JUNK_CATCH_PROFILE
    );

    if (peakVolume <= 0) {
      return;
    }

    playingWorldPlazaFishingSfxOneShot({
      ...DEFINING_WORLD_PLAZA_FISHING_SFX_JUNK_CATCH_PROFILE,
      peakVolume,
    });
    return;
  }

  const peakVolume = computingWorldPlazaFishingCatchRewardSfxEffectiveVolume(
    request.catchEntry.rarity
  );

  if (peakVolume <= 0) {
    return;
  }

  playingWorldPlazaFishingSfxOneShot({
    ...DEFINING_WORLD_PLAZA_FISHING_SFX_CREATURE_CATCH_PROFILE,
    starAudioId: resolvingWildlifeStudySfxStarAudioId('chest_open'),
    peakVolume,
  });
}
