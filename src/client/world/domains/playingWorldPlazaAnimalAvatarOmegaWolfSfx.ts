/**
 * Plays a local elite-wolf (omega) vocal from the Werewolf pack.
 *
 * @module components/world/domains/playingWorldPlazaAnimalAvatarOmegaWolfSfx
 */

import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_MAX_PLAYBACK_DURATION_S } from '@/components/world/domains/definingWorldPlazaAnimalAvatarOmegaWolfSfxActionMapping';
import type { DefiningWorldPlazaAnimalAvatarSpeciesSfxAction } from '@/components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import { playingWorldPlazaStarAudioSfx } from '@/components/world/domains/managingWorldPlazaStarAudio';
import { resolvingWorldPlazaAnimalAvatarOmegaWolfSfxEventKind } from '@/components/world/domains/resolvingWorldPlazaAnimalAvatarOmegaWolfSfxEventKind';
import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_TERRITORY_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_TARGET_VOLUME,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_TARGET_VOLUME,
  type DefiningWildlifeOmegaWolfSfxEventKind,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import { resolvingWildlifeOmegaWolfSfxClipId } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxClipId';
import { resolvingWildlifeOmegaWolfSfxStarAudioId } from '@/components/world/wildlife/domains/resolvingWildlifeOmegaWolfSfxStarAudioId';

function resolvingWorldPlazaAnimalAvatarOmegaWolfSfxTargetVolume(
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind
): number {
  if (
    eventKind === 'attack_bite' ||
    eventKind === 'attack_snap' ||
    eventKind === 'attack_lunge'
  ) {
    return DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_TARGET_VOLUME;
  }

  if (eventKind === 'howl') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_TARGET_VOLUME;
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_TARGET_VOLUME;
  }

  return DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_TERRITORY_SFX_TARGET_VOLUME;
}

/**
 * Plays one Werewolf-pack vocal for a local elite-wolf avatar action.
 */
export function playingWorldPlazaAnimalAvatarOmegaWolfSfx(params: {
  readonly action: DefiningWorldPlazaAnimalAvatarSpeciesSfxAction;
  readonly rotationIndex: number;
}): {
  readonly played: boolean;
  readonly nextRotationIndex: number;
} {
  const { action, rotationIndex } = params;
  const eventKind = resolvingWorldPlazaAnimalAvatarOmegaWolfSfxEventKind(
    action,
    rotationIndex
  );
  const clipId = resolvingWildlifeOmegaWolfSfxClipId(eventKind, rotationIndex);

  const volume = computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      resolvingWorldPlazaAnimalAvatarOmegaWolfSfxTargetVolume(eventKind),
    multipliers: [],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });

  if (volume <= 0) {
    return { played: false, nextRotationIndex: rotationIndex + 1 };
  }

  playingWorldPlazaStarAudioSfx(
    resolvingWildlifeOmegaWolfSfxStarAudioId(clipId),
    {
      volume,
      duration:
        DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_MAX_PLAYBACK_DURATION_S,
    }
  );

  return { played: true, nextRotationIndex: rotationIndex + 1 };
}
