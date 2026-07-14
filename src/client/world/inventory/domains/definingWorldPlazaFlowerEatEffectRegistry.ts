/**
 * Declarative eat effects for picked biome flowers.
 *
 * @module components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry
 */

import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

export type DefiningWorldPlazaFlowerEatEffectKind =
  | 'bleedDowngradeOrHeal'
  | 'healAndMending'
  | 'chamomile'
  | 'clearSicknessDebuffs'
  | 'shortenDiseaseOrInfectionResist'
  | 'timedColdTolerance'
  | 'timedColdResistance'
  | 'timedHeatTolerance'
  | 'braced'
  | 'valerianSleepRegen'
  | 'foxgloveGamble'
  | 'belladonnaPoison';

export type DefiningWorldPlazaFlowerEatEffectEntry = {
  readonly speciesId: WorldFlowerSpeciesId;
  readonly effectKind: DefiningWorldPlazaFlowerEatEffectKind;
};

export const DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_REGISTRY: readonly DefiningWorldPlazaFlowerEatEffectEntry[] =
  [
    { speciesId: 'yarrow', effectKind: 'bleedDowngradeOrHeal' },
    { speciesId: 'calendula', effectKind: 'healAndMending' },
    { speciesId: 'chamomile', effectKind: 'chamomile' },
    { speciesId: 'lavender', effectKind: 'clearSicknessDebuffs' },
    {
      speciesId: 'echinacea',
      effectKind: 'shortenDiseaseOrInfectionResist',
    },
    { speciesId: 'peppermint', effectKind: 'timedColdTolerance' },
    { speciesId: 'rose', effectKind: 'timedColdResistance' },
    { speciesId: 'meadowsweet', effectKind: 'timedHeatTolerance' },
    { speciesId: 'arnica', effectKind: 'braced' },
    { speciesId: 'valerian', effectKind: 'valerianSleepRegen' },
    { speciesId: 'foxglove', effectKind: 'foxgloveGamble' },
    { speciesId: 'belladonna', effectKind: 'belladonnaPoison' },
  ];

const DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_BY_SPECIES = new Map(
  DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_REGISTRY.map((entry) => [
    entry.speciesId,
    entry.effectKind,
  ])
);

/**
 * Resolves the eat effect kind for one flower species.
 */
export function resolvingWorldPlazaFlowerEatEffectKind(
  speciesId: WorldFlowerSpeciesId
): DefiningWorldPlazaFlowerEatEffectKind | null {
  return (
    DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_BY_SPECIES.get(speciesId) ?? null
  );
}

/**
 * True when an inventory item type id is a pickable biome flower herb.
 */
export function checkingWorldPlazaInventoryItemIsFlowerHerb(
  itemTypeId: string
): boolean {
  return itemTypeId.startsWith('world-plaza-flower-');
}

/**
 * Parses species slug from a flower inventory item type id.
 */
export function parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(
  itemTypeId: string
): WorldFlowerSpeciesId | null {
  if (!checkingWorldPlazaInventoryItemIsFlowerHerb(itemTypeId)) {
    return null;
  }

  const speciesId = itemTypeId.replace('world-plaza-flower-', '');

  if (
    DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_BY_SPECIES.has(
      speciesId as WorldFlowerSpeciesId
    )
  ) {
    return speciesId as WorldFlowerSpeciesId;
  }

  return null;
}
