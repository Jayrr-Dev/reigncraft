/**
 * Tea brew traits for plain and campfire-roasted coffee beans.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaCoffeeTeaBrewingIngredientRegistry
 */

import {
  DEFINING_WORLD_PLAZA_COFFEE_BEANS_TEA_BREW_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_ROASTED_COFFEE_BEANS_TEA_BREW_DURATION_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaCoffeeProcessingConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ROASTED_COFFEE_BEANS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { DefiningWorldPlazaTeaBrewingIngredientDefinition } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

const DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_SPEED_TRAIT = {
  traitId: 'coffee-buzz',
  category: 'stamina' as const,
  polarity: 'positive' as const,
  adjective: 'Roasted',
  basePotency: 1,
  effect: {
    kind: 'movement_modifier' as const,
    modifierKind: 'speed' as const,
    baseMultiplierDelta: 0.2,
  },
};

const DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_STAMINA_TRAIT = {
  traitId: 'coffee-stamina',
  category: 'stamina' as const,
  polarity: 'positive' as const,
  adjective: 'Wired',
  basePotency: 1,
  effect: {
    kind: 'movement_modifier' as const,
    modifierKind: 'stamina_max' as const,
    baseMultiplierDelta: 0.1,
  },
};

export const DEFINING_WORLD_PLAZA_COFFEE_TEA_BREWING_INGREDIENT_REGISTRY: readonly DefiningWorldPlazaTeaBrewingIngredientDefinition[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      noun: 'Coffee',
      traits: [
        {
          ...DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_SPEED_TRAIT,
          baseDurationMs:
            DEFINING_WORLD_PLAZA_COFFEE_BEANS_TEA_BREW_BASE_DURATION_MS,
        },
        {
          ...DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_STAMINA_TRAIT,
          baseDurationMs:
            DEFINING_WORLD_PLAZA_COFFEE_BEANS_TEA_BREW_BASE_DURATION_MS,
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_ROASTED_COFFEE_BEANS,
      noun: 'Coffee',
      traits: [
        {
          ...DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_SPEED_TRAIT,
          traitId: 'coffee-buzz-dark',
          adjective: 'Dark',
          baseDurationMs:
            DEFINING_WORLD_PLAZA_ROASTED_COFFEE_BEANS_TEA_BREW_DURATION_MS,
        },
        {
          ...DEFINING_WORLD_PLAZA_COFFEE_TEA_BREW_STAMINA_TRAIT,
          traitId: 'coffee-stamina-dark',
          adjective: 'Smoldering',
          baseDurationMs:
            DEFINING_WORLD_PLAZA_ROASTED_COFFEE_BEANS_TEA_BREW_DURATION_MS,
        },
      ],
    },
  ];
