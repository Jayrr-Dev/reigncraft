import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS,
  DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_SFX_CLIP_IDS,
  DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_CLIP_IDS,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS,
  DEFINING_WILDLIFE_OMEGA_WOLF_TERRITORY_WARN_SFX_CLIP_IDS,
  type DefiningWildlifeOmegaWolfSfxClipId,
  type DefiningWildlifeOmegaWolfSfxEventKind,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/**
 * Resolves the clip id for one Omega Wolf SFX event and rotation index.
 */
export function resolvingWildlifeOmegaWolfSfxClipId(
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind,
  rotationIndex: number
): DefiningWildlifeOmegaWolfSfxClipId {
  if (eventKind === 'howl') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS[
      rotationIndex % DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS.length
    ];
  }

  if (eventKind === 'chase_call') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_SFX_CLIP_IDS[
      rotationIndex % DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_SFX_CLIP_IDS.length
    ];
  }

  if (eventKind === 'territory_warn') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_TERRITORY_WARN_SFX_CLIP_IDS[
      rotationIndex %
        DEFINING_WILDLIFE_OMEGA_WOLF_TERRITORY_WARN_SFX_CLIP_IDS.length
    ];
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_CLIP_IDS[
      rotationIndex % DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_CLIP_IDS.length
    ];
  }

  return DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_SFX_CLIP_IDS[eventKind];
}

/**
 * Returns pool length for events that rotate clips; 1 for fixed attack clips.
 */
export function resolvingWildlifeOmegaWolfSfxClipPoolLength(
  eventKind: DefiningWildlifeOmegaWolfSfxEventKind
): number {
  if (eventKind === 'howl') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_SFX_CLIP_IDS.length;
  }

  if (eventKind === 'chase_call') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_CHASE_SFX_CLIP_IDS.length;
  }

  if (eventKind === 'territory_warn') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_TERRITORY_WARN_SFX_CLIP_IDS.length;
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WILDLIFE_OMEGA_WOLF_HIT_SFX_CLIP_IDS.length;
  }

  return 1;
}
