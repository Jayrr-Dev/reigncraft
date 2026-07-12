/**
 * Plays a local playable-animal species vocal for jump, roll, or melee.
 *
 * Reuses wildlife clip resolvers at full listener volume (no spatial falloff).
 * Elite / grey wolf use the Werewolf pack instead of Mixkit howls.
 *
 * @module components/world/domains/playingWorldPlazaAnimalAvatarSpeciesSfx
 */

import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { checkingWorldPlazaAnimalAvatarUsesWerewolfSfx } from '@/components/world/domains/checkingWorldPlazaAnimalAvatarUsesWerewolfSfx';
import type { DefiningWorldPlazaAnimalAvatarSpeciesSfxAction } from '@/components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { playingWorldPlazaStarAudioSfx } from '@/components/world/domains/managingWorldPlazaStarAudio';
import { playingWorldPlazaAnimalAvatarOmegaWolfSfx } from '@/components/world/domains/playingWorldPlazaAnimalAvatarOmegaWolfSfx';
import { resolvingWorldPlazaAnimalAvatarSpeciesSfxEventKind } from '@/components/world/domains/resolvingWorldPlazaAnimalAvatarSpeciesSfxEventKind';
import { DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import {
  resolvingWildlifeSpeciesSfxClipId,
  resolvingWildlifeSpeciesSfxPoolIdForEvent,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import { resolvingWildlifeSpeciesSfxClipVolumeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipVolumeMultiplier';
import { resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS';
import { resolvingWildlifeSpeciesSfxPoolVolumeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxPoolVolumeMultiplier';
import { resolvingWildlifeSpeciesSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxStarAudioId';

export type PlayingWorldPlazaAnimalAvatarSpeciesSfxResult = {
  readonly played: boolean;
  readonly nextRotationIndex: number;
};

/**
 * Plays one species vocal for a local animal avatar action.
 */
export function playingWorldPlazaAnimalAvatarSpeciesSfx(params: {
  readonly speciesId: string;
  readonly action: DefiningWorldPlazaAnimalAvatarSpeciesSfxAction;
  readonly rotationIndex: number;
}): PlayingWorldPlazaAnimalAvatarSpeciesSfxResult {
  const { speciesId, action, rotationIndex } = params;

  if (checkingWorldPlazaAnimalAvatarUsesWerewolfSfx(speciesId)) {
    return playingWorldPlazaAnimalAvatarOmegaWolfSfx({
      action,
      rotationIndex,
    });
  }

  const eventKind = resolvingWorldPlazaAnimalAvatarSpeciesSfxEventKind(
    speciesId,
    action
  );

  if (!eventKind) {
    return { played: false, nextRotationIndex: rotationIndex };
  }

  const clipId = resolvingWildlifeSpeciesSfxClipId(
    speciesId,
    eventKind,
    rotationIndex
  );

  if (!clipId) {
    return { played: false, nextRotationIndex: rotationIndex };
  }

  const poolId = resolvingWildlifeSpeciesSfxPoolIdForEvent(
    speciesId,
    eventKind,
    rotationIndex
  );

  const volume = computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WILDLIFE_SPECIES_SFX_TARGET_VOLUME_BY_EVENT[eventKind],
    multipliers: [
      poolId ? resolvingWildlifeSpeciesSfxPoolVolumeMultiplier(poolId) : 1,
      resolvingWildlifeSpeciesSfxClipVolumeMultiplier(clipId),
    ],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });

  if (volume <= 0) {
    return { played: false, nextRotationIndex: rotationIndex + 1 };
  }

  const maxPlaybackDurationS = poolId
    ? resolvingWildlifeSpeciesSfxPoolMaxPlaybackDurationS(poolId)
    : null;

  playingWorldPlazaStarAudioSfx(
    resolvingWildlifeSpeciesSfxStarAudioId(clipId),
    {
      volume,
      ...(maxPlaybackDurationS !== null
        ? { duration: maxPlaybackDurationS }
        : {}),
    }
  );

  return { played: true, nextRotationIndex: rotationIndex + 1 };
}
