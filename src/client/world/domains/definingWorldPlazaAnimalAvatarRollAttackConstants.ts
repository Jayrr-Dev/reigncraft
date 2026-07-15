/**
 * Shared tunables for playable-animal roll / leap attacks (R).
 *
 * GirlSample keeps the dodge-only roll. Animal skins deal contact damage with
 * thematic distance, stamina cost, and speed per archetype.
 *
 * @module components/world/domains/definingWorldPlazaAnimalAvatarRollAttackConstants
 */

import type { DefiningWildlifeSpeciesOnHitEffect } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';

/** Roll / leap feel buckets for playable animals. */
export type DefiningWorldPlazaAnimalAvatarRollAttackArchetypeId =
  | 'prey'
  | 'pouncer'
  | 'canine'
  | 'bruiser'
  | 'charger'
  | 'slider'
  | 'tank'
  | 'frostCaster';

/**
 * Resolved roll-attack profile for one animal skin.
 * Contact damage uses flat wildlife-style hits at attackPower × damageMultiplier.
 */
export type DefiningWorldPlazaAnimalAvatarRollAttackProfile = {
  readonly archetypeId: DefiningWorldPlazaAnimalAvatarRollAttackArchetypeId;
  /** When false, roll is locomotion / projectile only (e.g. Cyroborn ice bolt). */
  readonly dealsContactDamage: boolean;
  /** Multiplier on character attackPower for contact roll hits. */
  readonly damageMultiplier: number;
  /** Multiplier on base roll stamina cost (jump × 1.5). */
  readonly staminaCostMultiplier: number;
  /** Forward travel distance in grid units. */
  readonly forwardGridDistance: number;
  /**
   * Scales strip-derived roll duration. Below 1 = faster travel; above 1 = slower.
   */
  readonly durationScale: number;
  /**
   * Extra on-hit procs for species that omit the shared wildlife on-hit table
   * (prey / livestock). Predators already proc via transform melee side effects.
   */
  readonly extraOnHitEffects: readonly DefiningWildlifeSpeciesOnHitEffect[];
};

/** Baseline animal roll when no archetype override applies. */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_DEFAULT_PROFILE: DefiningWorldPlazaAnimalAvatarRollAttackProfile =
  {
    archetypeId: 'prey',
    dealsContactDamage: true,
    // Slightly stronger than a normal bite so the leap feels like a commit.
    damageMultiplier: 1.5,
    // ~12.7% stamina (base roll is 9.375%) — usable but not free spam.
    staminaCostMultiplier: 1.35,
    forwardGridDistance: 2.75,
    durationScale: 1,
    extraOnHitEffects: [],
  };
