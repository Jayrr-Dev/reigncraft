/**
 * Maps local playable wolf actions to short Werewolf-pack event kinds.
 *
 * Avoids chase/howl beds that read as long wolf howls on punch/jump/roll.
 *
 * @module components/world/domains/definingWorldPlazaAnimalAvatarOmegaWolfSfxActionMapping
 */

import type { DefiningWorldPlazaAnimalAvatarSpeciesSfxAction } from '@/components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping';
import type { DefiningWildlifeOmegaWolfSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

/**
 * Preferred Werewolf event kinds per local avatar action.
 * Melee / jump / roll all rotate short snarls and attacks — never chase beds.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_EVENT_FALLBACKS: Record<
  DefiningWorldPlazaAnimalAvatarSpeciesSfxAction,
  readonly DefiningWildlifeOmegaWolfSfxEventKind[]
> = {
  jump_takeoff: ['territory_warn', 'hit_taken', 'attack_bite'],
  roll_dodge: ['hit_taken', 'territory_warn', 'attack_snap'],
  melee_attack: ['attack_bite', 'attack_snap', 'attack_lunge'],
};

/**
 * Hard stop for any Werewolf source that still runs longer than a one-shot.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_OMEGA_WOLF_SFX_MAX_PLAYBACK_DURATION_S = 1.55;
