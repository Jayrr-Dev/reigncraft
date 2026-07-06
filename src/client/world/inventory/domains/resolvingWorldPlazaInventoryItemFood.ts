import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/** Food metadata describing how much hunger one unit restores when eaten. */
export type DefiningWorldPlazaInventoryFoodDefinition = {
  readonly itemTypeId: string;
  readonly hungerRestoreRatio: number;
  readonly meatKind?: 'raw' | 'cooked';
  readonly rawPoisonFlatEv?: number;
  readonly rawPoisonDurationMs?: number;
  readonly rawSicknessChance?: number;
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
    meatKind: definition.food.meatKind,
    rawPoisonFlatEv: definition.food.rawPoisonFlatEv,
    rawPoisonDurationMs: definition.food.rawPoisonDurationMs,
    rawSicknessChance: definition.food.rawSicknessChance,
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
