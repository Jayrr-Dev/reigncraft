/**
 * Declarative passive traits species may opt into via `passiveTraitIds`.
 *
 * Behavior modules check traits with `checkingWildlifeSpeciesHasPassiveTrait`
 * instead of scattering one-off boolean fields on the species definition.
 *
 * @module components/world/wildlife/domains/definingWildlifePassiveTraitRegistry
 */

export type DefiningWildlifePassiveTraitId =
  | 'adrenaline-rush'
  | 'immortal'
  | 'never-triggers-wildlife-aggro';

export type DefiningWildlifePassiveTraitDefinition = {
  traitId: DefiningWildlifePassiveTraitId;
  displayName: string;
  description: string;
};

/**
 * Catalog of reusable wildlife passives. Add a row here, then list the id on
 * any species `passiveTraitIds` array to opt in.
 */
export const DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY = {
  'adrenaline-rush': {
    traitId: 'adrenaline-rush',
    displayName: 'Adrenaline Rush',
    description:
      'Restores stamina to a full bar the first time this animal enters flee.',
  },
  immortal: {
    traitId: 'immortal',
    displayName: 'Immortal',
    description:
      'Ignores all damage and status harm, never dies, keeps full stamina, and hides health and stamina bars.',
  },
  'never-triggers-wildlife-aggro': {
    traitId: 'never-triggers-wildlife-aggro',
    displayName: 'Unnoticed',
    description:
      'Other wildlife ignore this species for opportunistic hunt and sight aggro. Attacking an animal still builds normal damage aggro, and briefly marks the attacker as fair game.',
  },
} as const satisfies Record<
  DefiningWildlifePassiveTraitId,
  DefiningWildlifePassiveTraitDefinition
>;

/** Lists every registered passive trait id. */
export function listingWildlifePassiveTraitIds(): readonly DefiningWildlifePassiveTraitId[] {
  return Object.keys(
    DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY
  ) as DefiningWildlifePassiveTraitId[];
}

/** Resolves one passive trait definition, or null when unknown. */
export function resolvingWildlifePassiveTraitDefinition(
  traitId: DefiningWildlifePassiveTraitId
): DefiningWildlifePassiveTraitDefinition | null {
  return DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY[traitId] ?? null;
}
