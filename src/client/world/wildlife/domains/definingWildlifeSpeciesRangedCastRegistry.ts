/**
 * Declarative ranged-cast profiles for wildlife that spawn plaza projectiles.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesRangedCastRegistry
 */

import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesRangedCastProfile = {
  readonly speciesId: DefiningWildlifeSpeciesId;
  /** Max distance at which chase upgrades to attack / cast. */
  readonly castRangeGrid: number;
  /** Prefer staying near this distance while chasing. */
  readonly preferredRangeGrid: number;
  /**
   * Ordered cast cycle. Each successful cast advances one step and wraps.
   * Archetype ids must exist in the projectile registry.
   */
  readonly castArchetypeIds: readonly string[];
  /** When true, skip melee contact damage on attack ticks. */
  readonly suppressMelee: boolean;
};

const CYROBORN_RANGED_CAST: DefiningWildlifeSpeciesRangedCastProfile = {
  speciesId: DEFINING_WILDLIFE_CYROBORN_SPECIES_ID,
  castRangeGrid: 9.5,
  preferredRangeGrid: 7,
  castArchetypeIds: [
    'cyroborn-ice-bolt',
    'cyroborn-ice-sphere',
    'cyroborn-shatter-orb',
  ],
  suppressMelee: true,
};

export const DEFINING_WILDLIFE_SPECIES_RANGED_CAST_REGISTRY: Readonly<
  Record<string, DefiningWildlifeSpeciesRangedCastProfile>
> = {
  [CYROBORN_RANGED_CAST.speciesId]: CYROBORN_RANGED_CAST,
};

/**
 * Resolves a ranged-cast profile for a species, if any.
 */
export function resolvingWildlifeSpeciesRangedCastProfile(
  speciesId: string
): DefiningWildlifeSpeciesRangedCastProfile | null {
  return DEFINING_WILDLIFE_SPECIES_RANGED_CAST_REGISTRY[speciesId] ?? null;
}

/**
 * Picks the next projectile archetype id for a cast cycle index.
 */
export function resolvingWildlifeRangedCastArchetypeId(
  profile: DefiningWildlifeSpeciesRangedCastProfile,
  castComboIndex: number
): string {
  const count = profile.castArchetypeIds.length;
  if (count <= 0) {
    return '';
  }

  const safeIndex = ((castComboIndex % count) + count) % count;
  return profile.castArchetypeIds[safeIndex] ?? profile.castArchetypeIds[0]!;
}
