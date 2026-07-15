import type { DefiningWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodHealConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/** Food metadata describing hunger and health restore when eaten. */
export type DefiningWorldPlazaInventoryFoodDefinition = {
  readonly itemTypeId: string;
  readonly hungerRestoreRatio: number;
  readonly healthHeal: DefiningWorldPlazaInventoryFoodHealDeclaration;
  readonly meatKind?: 'raw' | 'cooked';
  readonly wildlifeSpeciesId?: string;
  readonly flowerSpeciesId?: string;
  readonly rawPoisonFlatEv?: number;
  readonly rawPoisonDurationMs?: number;
  readonly rawSicknessChance?: number;
  readonly rawDiseaseId?: string;
  readonly rawDiseaseChance?: number;
  readonly rawSymptomIntensity?: number;
  readonly rawDurationIntensity?: number;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedBuffIds?: readonly string[];
  readonly cookedWellFedChance?: number;
  readonly cookedResidualDiseaseId?: string;
  readonly cookedResidualDiseaseChance?: number;
  readonly returnItemTypeId?: string;
};

/**
 * Resolves the food definition for an item type id, if it is edible.
 */
export function resolvingWorldPlazaInventoryFoodDefinition(
  itemTypeId: string
): DefiningWorldPlazaInventoryFoodDefinition | null {
  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);

  if (!definition?.food) {
    return null;
  }

  return {
    itemTypeId: definition.typeId,
    hungerRestoreRatio: definition.food.hungerRestoreRatio,
    healthHeal: definition.food.healthHeal,
    meatKind: definition.food.meatKind,
    wildlifeSpeciesId: definition.food.wildlifeSpeciesId,
    flowerSpeciesId: definition.food.flowerSpeciesId,
    rawPoisonFlatEv: definition.food.rawPoisonFlatEv,
    rawPoisonDurationMs: definition.food.rawPoisonDurationMs,
    rawSicknessChance: definition.food.rawSicknessChance,
    rawDiseaseId: definition.food.rawDiseaseId,
    rawDiseaseChance: definition.food.rawDiseaseChance,
    rawSymptomIntensity: definition.food.rawSymptomIntensity,
    rawDurationIntensity: definition.food.rawDurationIntensity,
    cookedWellFedBuffId: definition.food.cookedWellFedBuffId,
    cookedWellFedBuffIds: definition.food.cookedWellFedBuffIds,
    cookedWellFedChance: definition.food.cookedWellFedChance,
    cookedResidualDiseaseId: definition.food.cookedResidualDiseaseId,
    cookedResidualDiseaseChance: definition.food.cookedResidualDiseaseChance,
    returnItemTypeId: definition.food.returnItemTypeId,
  };
}

/**
 * Whether an item type id is edible food.
 */
export function checkingWorldPlazaInventoryItemIsFood(
  itemTypeId: string
): boolean {
  return resolvingWorldPlazaInventoryFoodDefinition(itemTypeId) !== null;
}
