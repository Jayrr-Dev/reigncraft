/**
 * Maps local playable-animal actions to wildlife species vocal event kinds.
 *
 * Wildlife packs have no dedicated jump/roll clips, so locomotion reuses burst
 * vocals (flee_start, chase_call, …). Attack prefers combat vocals with soft
 * fallbacks for farm pets that only ship bark/meow pools.
 *
 * @module components/world/domains/definingWorldPlazaAnimalAvatarSpeciesSfxActionMapping
 */

import type { DefiningWorldPlazaAvatarMotionSfxEventKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionSfxConstants';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** Local avatar actions that can trigger a species vocal. */
export type DefiningWorldPlazaAnimalAvatarSpeciesSfxAction =
  | DefiningWorldPlazaAvatarMotionSfxEventKind
  | 'melee_attack';

/**
 * Preferred wildlife event kinds per local avatar action (first match wins).
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_SPECIES_SFX_EVENT_FALLBACKS: Record<
  DefiningWorldPlazaAnimalAvatarSpeciesSfxAction,
  readonly DefiningWildlifeSpeciesSfxEventKind[]
> = {
  jump_takeoff: ['flee_start', 'wake', 'chase_call', 'friendly', 'warn'],
  roll_dodge: ['flee_start', 'flee_mid', 'chase_call', 'friendly', 'warn'],
  melee_attack: ['attack', 'warn', 'chase_call', 'flee_start', 'friendly'],
};
