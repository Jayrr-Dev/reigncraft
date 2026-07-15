/**
 * Declarative ranged combat profiles for playable avatar skins.
 *
 * When a skin has a profile, normal attack spawns projectiles (no melee contact)
 * and optional rollCastArchetypeId fires on roll start.
 *
 * @module components/world/domains/definingWorldPlazaPlayableAvatarRangedCombatRegistry
 */

import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';

export type DefiningWorldPlazaPlayableAvatarRangedAttackWeight = {
  readonly archetypeId: string;
  /** Relative weight in the attack roll (not required to sum to 1). */
  readonly weight: number;
};

export type DefiningWorldPlazaPlayableAvatarRangedCombatProfile = {
  readonly skinId: string;
  /** Max distance for auto-attack / cast lock (grid). */
  readonly castRangeGrid: number;
  /** Weighted normal-attack projectile pool. */
  readonly normalAttackWeights: readonly DefiningWorldPlazaPlayableAvatarRangedAttackWeight[];
  /** Projectile fired when the player rolls (optional). */
  readonly rollCastArchetypeId?: string;
  /** Skip contact melee damage while this skin is active. */
  readonly suppressMelee: boolean;
};

const CYROBORN_RANGED_COMBAT: DefiningWorldPlazaPlayableAvatarRangedCombatProfile =
  {
    skinId: DEFINING_WILDLIFE_CYROBORN_SPECIES_ID,
    castRangeGrid: 9.5,
    // Normal attack: 70% ice spheres, 30% shatter orbs.
    normalAttackWeights: [
      { archetypeId: 'cyroborn-ice-sphere', weight: 70 },
      { archetypeId: 'cyroborn-shatter-orb', weight: 30 },
    ],
    rollCastArchetypeId: 'cyroborn-ice-bolt',
    suppressMelee: true,
  };

export const DEFINING_WORLD_PLAZA_PLAYABLE_AVATAR_RANGED_COMBAT_REGISTRY: Readonly<
  Record<string, DefiningWorldPlazaPlayableAvatarRangedCombatProfile>
> = {
  [CYROBORN_RANGED_COMBAT.skinId]: CYROBORN_RANGED_COMBAT,
};

/**
 * Resolves a ranged combat profile for a playable skin, if any.
 */
export function resolvingWorldPlazaPlayableAvatarRangedCombatProfile(
  skinId: string
): DefiningWorldPlazaPlayableAvatarRangedCombatProfile | null {
  return (
    DEFINING_WORLD_PLAZA_PLAYABLE_AVATAR_RANGED_COMBAT_REGISTRY[skinId] ?? null
  );
}

/**
 * Picks a normal-attack archetype id from weighted entries.
 */
export function resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId(
  profile: DefiningWorldPlazaPlayableAvatarRangedCombatProfile,
  unitSample: number
): string | null {
  const weights = profile.normalAttackWeights;

  if (weights.length === 0) {
    return null;
  }

  const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);

  if (totalWeight <= 0) {
    return weights[0]?.archetypeId ?? null;
  }

  const clamped = Math.min(0.999999, Math.max(0, unitSample));
  let remaining = clamped * totalWeight;

  for (const entry of weights) {
    if (remaining < entry.weight) {
      return entry.archetypeId;
    }

    remaining -= entry.weight;
  }

  return weights[weights.length - 1]?.archetypeId ?? null;
}
