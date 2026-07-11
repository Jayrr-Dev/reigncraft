import type { DefiningWildlifeOmegaWolfSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/**
 * Vocal priority for regular species. One instance may emit one vocal at a
 * time; only a higher-priority event may interrupt its current vocal.
 */
export const DEFINING_WILDLIFE_SPECIES_SFX_EVENT_PRIORITY: Record<
  DefiningWildlifeSpeciesSfxEventKind,
  number
> = {
  idle_ambient: 0,
  idle_eating: 0,
  sleep: 0,
  friendly: 0,
  flee_mid: 1,
  stalk: 1,
  wake: 1,
  flee_start: 2,
  warn: 2,
  howl: 2,
  chase_call: 2,
  attack: 3,
  hit_taken: 3,
  death: 4,
};

/** Vocal priority for the Omega Wolf's dedicated Werewolf sound pack. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SFX_EVENT_PRIORITY: Record<
  DefiningWildlifeOmegaWolfSfxEventKind,
  number
> = {
  howl: 2,
  chase_call: 2,
  territory_warn: 2,
  attack_bite: 3,
  attack_snap: 3,
  attack_lunge: 3,
  hit_taken: 3,
};
