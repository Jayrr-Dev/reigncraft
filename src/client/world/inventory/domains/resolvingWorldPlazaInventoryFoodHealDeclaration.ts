/**
 * Builds declarative per-item food heal numbers from hunger value and cook state.
 *
 * Registration stamps the result onto each food def so eat/UI read data, not
 * re-derive rarity from hunger at runtime.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_BASE_FLAT,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_RAW_MULTIPLIER,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
  type DefiningWorldPlazaInventoryFoodHealDeclaration,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodHealConstants';

export type ResolvingWorldPlazaInventoryFoodHealDeclarationParams = {
  readonly hungerRestoreRatio: number;
  readonly meatKind?: 'raw' | 'cooked';
};

/**
 * Species hunger / reference scales rarity; raw meat bakes in the 50% cook cut.
 */
export function resolvingWorldPlazaInventoryFoodHealDeclaration({
  hungerRestoreRatio,
  meatKind,
}: ResolvingWorldPlazaInventoryFoodHealDeclarationParams): DefiningWorldPlazaInventoryFoodHealDeclaration {
  if (hungerRestoreRatio <= 0) {
    return { baseFlat: 0, percentOfMax: 0 };
  }

  const speciesValueScale =
    hungerRestoreRatio /
    DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO;
  const cookMultiplier =
    meatKind === 'raw'
      ? DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_RAW_MULTIPLIER
      : 1;
  const scale = speciesValueScale * cookMultiplier;

  return {
    baseFlat: DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_BASE_FLAT * scale,
    percentOfMax:
      DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX * scale,
  };
}
