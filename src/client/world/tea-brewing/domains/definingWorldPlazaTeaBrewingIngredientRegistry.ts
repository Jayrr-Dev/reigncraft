/**
 * Declarative latent traits for brewable flowers, berries, tea, and coffee.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingIngredientRegistry
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ARNICA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_BELLADONNA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CALENDULA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CHAMOMILE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ECHINACEA,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_FOXGLOVE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_LAVENDER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_MEADOWSWEET,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_PEPPERMINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_VALERIAN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { DEFINING_WORLD_PLAZA_TEA_BREWING_FORAGE_INGREDIENT_REGISTRY } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingForageIngredientRegistry';
import type { DefiningWorldPlazaTeaBrewingIngredientDefinition } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

export const DEFINING_WORLD_PLAZA_TEA_BREWING_INGREDIENT_REGISTRY: readonly DefiningWorldPlazaTeaBrewingIngredientDefinition[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_YARROW,
      noun: 'Yarrow',
      traits: [
        {
          traitId: 'yarrow-mend',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Staunching',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'heal_of_max', baseOfMax: 0.05 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CALENDULA,
      noun: 'Calendula',
      traits: [
        {
          traitId: 'calendula-mend',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Mending',
          basePotency: 1,
          baseDurationMs: 30_000,
          effect: { kind: 'heal_of_max', baseOfMax: 0.05 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_CHAMOMILE,
      noun: 'Chamomile',
      traits: [
        {
          traitId: 'chamomile-rest',
          category: 'sleep',
          polarity: 'positive',
          adjective: 'Restful',
          basePotency: 1,
          baseDurationMs: 10_000,
          effect: {
            kind: 'sleep',
            baseDurationMs: 10_000,
            baseHealOfMax: 0.01,
            canWakeFromDamage: false,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_LAVENDER,
      noun: 'Lavender',
      traits: [
        {
          traitId: 'lavender-ease',
          category: 'calm',
          polarity: 'positive',
          adjective: 'Settling',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'clear_sickness' },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ECHINACEA,
      noun: 'Echinacea',
      traits: [
        {
          traitId: 'echinacea-ward',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Warding',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: { kind: 'infection_resist', chanceMultiplier: 0.5 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_PEPPERMINT,
      noun: 'Peppermint',
      traits: [
        {
          traitId: 'peppermint-cold',
          category: 'cold',
          polarity: 'positive',
          adjective: 'Cooling',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'temperature_tolerance',
            band: 'cold',
            baseCelsius: 10,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ROSE,
      noun: 'Rose',
      traits: [
        {
          traitId: 'rose-frost',
          category: 'cold',
          polarity: 'positive',
          adjective: 'Frosted',
          basePotency: 1,
          baseDurationMs: 30_000,
          effect: {
            kind: 'temperature_resistance',
            band: 'cold',
            baseResistance: 0.25,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_MEADOWSWEET,
      noun: 'Meadowsweet',
      traits: [
        {
          traitId: 'meadowsweet-heat',
          category: 'heat',
          polarity: 'positive',
          adjective: 'Sunlit',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'temperature_tolerance',
            band: 'heat',
            baseCelsius: 10,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_ARNICA,
      noun: 'Arnica',
      traits: [
        {
          traitId: 'arnica-brace',
          category: 'defence',
          polarity: 'positive',
          adjective: 'Braced',
          basePotency: 1,
          baseDurationMs: 20_000,
          effect: { kind: 'braced' },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_VALERIAN,
      noun: 'Valerian',
      traits: [
        {
          traitId: 'valerian-deep',
          category: 'sleep',
          polarity: 'positive',
          adjective: 'Deep',
          basePotency: 1,
          baseDurationMs: 8_000,
          effect: {
            kind: 'sleep',
            baseDurationMs: 8_000,
            baseHealOfMax: 0,
            canWakeFromDamage: true,
            regenMultiplier: 3,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_FOXGLOVE,
      noun: 'Foxglove',
      traits: [
        {
          traitId: 'foxglove-heal',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Heartstrong',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'heal_of_max', baseOfMax: 0.15 },
        },
        {
          traitId: 'foxglove-toxin',
          category: 'toxic',
          polarity: 'negative',
          adjective: 'Bitter',
          basePotency: 1,
          baseDurationMs: 20_000,
          effect: {
            kind: 'poison_of_max',
            baseOfMax: 0.08,
            baseDurationMs: 20_000,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_FLOWER_BELLADONNA,
      noun: 'Belladonna',
      traits: [
        {
          traitId: 'belladonna-venom',
          category: 'toxic',
          polarity: 'negative',
          adjective: 'Nightshade',
          basePotency: 1,
          baseDurationMs: 30_000,
          effect: {
            kind: 'poison_of_max',
            baseOfMax: 0.2,
            baseDurationMs: 30_000,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TEA_LEAVES,
      noun: 'Leaf',
      traits: [
        {
          traitId: 'tea-calm',
          category: 'calm',
          polarity: 'positive',
          adjective: 'Calm',
          basePotency: 1,
          baseDurationMs: 90_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_drain',
            baseMultiplierDelta: -0.25,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED,
      noun: 'Cherry',
      traits: [
        {
          traitId: 'cherry-buzz',
          category: 'speed',
          polarity: 'positive',
          adjective: 'Buzzing',
          basePotency: 1,
          baseDurationMs: 45_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'speed',
            baseMultiplierDelta: 0.1,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLUE,
      noun: 'Blueberry',
      traits: [
        {
          traitId: 'blueberry-ease',
          category: 'calm',
          polarity: 'positive',
          adjective: 'Soft',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_regen',
            baseMultiplierDelta: 0.15,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_GOLDEN,
      noun: 'Goldberry',
      traits: [
        {
          traitId: 'goldberry-vital',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Golden',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'heal_of_max', baseOfMax: 0.08 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COFFEE_BEANS,
      noun: 'Coffee',
      traits: [
        {
          traitId: 'coffee-buzz',
          category: 'stamina',
          polarity: 'positive',
          adjective: 'Roasted',
          basePotency: 1,
          baseDurationMs: 120_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'speed',
            baseMultiplierDelta: 0.2,
          },
        },
        {
          traitId: 'coffee-stamina',
          category: 'stamina',
          polarity: 'positive',
          adjective: 'Wired',
          basePotency: 1,
          baseDurationMs: 120_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_max',
            baseMultiplierDelta: 0.1,
          },
        },
      ],
    },
    ...DEFINING_WORLD_PLAZA_TEA_BREWING_FORAGE_INGREDIENT_REGISTRY,
  ];

const DEFINING_WORLD_PLAZA_TEA_BREWING_INGREDIENT_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_TEA_BREWING_INGREDIENT_REGISTRY.map((entry) => [
    entry.itemTypeId,
    entry,
  ])
);

export function resolvingWorldPlazaTeaBrewingIngredient(
  itemTypeId: string
): DefiningWorldPlazaTeaBrewingIngredientDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_TEA_BREWING_INGREDIENT_BY_TYPE_ID.get(itemTypeId) ??
    null
  );
}

export function checkingWorldPlazaTeaBrewingIngredientItemTypeId(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_TEA_BREWING_INGREDIENT_BY_TYPE_ID.has(itemTypeId);
}
