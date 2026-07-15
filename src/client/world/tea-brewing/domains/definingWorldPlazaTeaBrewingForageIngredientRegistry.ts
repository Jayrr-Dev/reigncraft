/**
 * Tea brew traits for extended shrub forage berries and leaves.
 *
 * @module components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingForageIngredientRegistry
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { DefiningWorldPlazaTeaBrewingIngredientDefinition } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

export const DEFINING_WORLD_PLAZA_TEA_BREWING_FORAGE_INGREDIENT_REGISTRY: readonly DefiningWorldPlazaTeaBrewingIngredientDefinition[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_CRANBERRY,
      noun: 'Cranberry',
      traits: [
        {
          traitId: 'cranberry-ward',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Warding',
          basePotency: 1,
          baseDurationMs: 45_000,
          effect: { kind: 'infection_resist', chanceMultiplier: 0.75 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BLACKBERRY,
      noun: 'Bramble',
      traits: [
        {
          traitId: 'blackberry-brace',
          category: 'defence',
          polarity: 'positive',
          adjective: 'Braced',
          basePotency: 1,
          baseDurationMs: 12_000,
          effect: { kind: 'braced' },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RASPBERRY,
      noun: 'Raspberry',
      traits: [
        {
          traitId: 'raspberry-ease',
          category: 'calm',
          polarity: 'positive',
          adjective: 'Steady',
          basePotency: 1,
          baseDurationMs: 50_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_regen',
            baseMultiplierDelta: 0.12,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_BILBERRY,
      noun: 'Bilberry',
      traits: [
        {
          traitId: 'bilberry-alert',
          category: 'speed',
          polarity: 'positive',
          adjective: 'Alert',
          basePotency: 1,
          baseDurationMs: 40_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'speed',
            baseMultiplierDelta: 0.08,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_JUNIPER,
      noun: 'Juniper',
      traits: [
        {
          traitId: 'juniper-cold',
          category: 'cold',
          polarity: 'positive',
          adjective: 'Boreal',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'temperature_tolerance',
            band: 'cold',
            baseCelsius: 12,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_SEA_BUCKTHORN,
      noun: 'Buckthorn',
      traits: [
        {
          traitId: 'buckthorn-heat',
          category: 'heat',
          polarity: 'positive',
          adjective: 'Sunward',
          basePotency: 1,
          baseDurationMs: 45_000,
          effect: {
            kind: 'temperature_resistance',
            band: 'heat',
            baseResistance: 0.3,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_YEW_ARIL,
      noun: 'Aril',
      traits: [
        {
          traitId: 'yew-heal',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Sacred',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'heal_of_max', baseOfMax: 0.12 },
        },
        {
          traitId: 'yew-toxin',
          category: 'toxic',
          polarity: 'negative',
          adjective: 'Bitter',
          basePotency: 1,
          baseDurationMs: 18_000,
          effect: {
            kind: 'poison_of_max',
            baseOfMax: 0.06,
            baseDurationMs: 18_000,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_WOLFBERRY,
      noun: 'Wolfberry',
      traits: [
        {
          traitId: 'wolfberry-stamina',
          category: 'stamina',
          polarity: 'positive',
          adjective: 'Wild',
          basePotency: 1,
          baseDurationMs: 90_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_max',
            baseMultiplierDelta: 0.12,
          },
        },
        {
          traitId: 'wolfberry-speed',
          category: 'speed',
          polarity: 'positive',
          adjective: 'Feral',
          basePotency: 1,
          baseDurationMs: 90_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'speed',
            baseMultiplierDelta: 0.08,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_LOTUS_FRUIT,
      noun: 'Lotus',
      traits: [
        {
          traitId: 'lotus-sleep',
          category: 'sleep',
          polarity: 'positive',
          adjective: 'Dreaming',
          basePotency: 1,
          baseDurationMs: 6_000,
          effect: {
            kind: 'sleep',
            baseDurationMs: 6_000,
            baseHealOfMax: 0.1,
            canWakeFromDamage: true,
            regenMultiplier: 2,
          },
        },
        {
          traitId: 'lotus-soul',
          category: 'defence',
          polarity: 'positive',
          adjective: 'Lethean',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'incoming_damage_multiplier',
            damageKinds: ['soulbreak'],
            baseMultiplier: 0.5,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_NETTLE,
      noun: 'Nettle',
      traits: [
        {
          traitId: 'nettle-calm',
          category: 'calm',
          polarity: 'positive',
          adjective: 'Stinging',
          basePotency: 1,
          baseDurationMs: 60_000,
          effect: {
            kind: 'movement_modifier',
            modifierKind: 'stamina_drain',
            baseMultiplierDelta: -0.15,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_LEMON_BALM,
      noun: 'Balm',
      traits: [
        {
          traitId: 'balm-clear',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Soothing',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'clear_sickness' },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_SAGE,
      noun: 'Sage',
      traits: [
        {
          traitId: 'sage-ward',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Savory',
          basePotency: 1,
          baseDurationMs: 50_000,
          effect: { kind: 'infection_resist', chanceMultiplier: 0.7 },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MUGWORT,
      noun: 'Mugwort',
      traits: [
        {
          traitId: 'mugwort-dream',
          category: 'sleep',
          polarity: 'positive',
          adjective: 'Dreaming',
          basePotency: 1,
          baseDurationMs: 7_000,
          effect: {
            kind: 'sleep',
            baseDurationMs: 7_000,
            baseHealOfMax: 0,
            canWakeFromDamage: true,
            regenMultiplier: 2,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_BAY_LAUREL,
      noun: 'Laurel',
      traits: [
        {
          traitId: 'laurel-brace',
          category: 'defence',
          polarity: 'positive',
          adjective: 'Crowned',
          basePotency: 1,
          baseDurationMs: 18_000,
          effect: { kind: 'braced' },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_HOLLY,
      noun: 'Holly',
      traits: [
        {
          traitId: 'holly-frost',
          category: 'cold',
          polarity: 'positive',
          adjective: 'Winter',
          basePotency: 1,
          baseDurationMs: 50_000,
          effect: {
            kind: 'temperature_resistance',
            band: 'cold',
            baseResistance: 0.28,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MISTLETOE,
      noun: 'Mistletoe',
      traits: [
        {
          traitId: 'mistletoe-heal',
          category: 'heal',
          polarity: 'positive',
          adjective: 'Kissing',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'heal_of_max', baseOfMax: 0.1 },
        },
        {
          traitId: 'mistletoe-toxin',
          category: 'toxic',
          polarity: 'negative',
          adjective: 'Parasitic',
          basePotency: 1,
          baseDurationMs: 15_000,
          effect: {
            kind: 'poison_of_max',
            baseOfMax: 0.05,
            baseDurationMs: 15_000,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_OLIVE,
      noun: 'Olive',
      traits: [
        {
          traitId: 'olive-heat',
          category: 'heat',
          polarity: 'positive',
          adjective: 'Mediterranean',
          basePotency: 1,
          baseDurationMs: 75_000,
          effect: {
            kind: 'temperature_tolerance',
            band: 'heat',
            baseCelsius: 10,
          },
        },
        {
          traitId: 'olive-cold',
          category: 'cold',
          polarity: 'positive',
          adjective: 'Silver',
          basePotency: 1,
          baseDurationMs: 75_000,
          effect: {
            kind: 'temperature_tolerance',
            band: 'cold',
            baseCelsius: 10,
          },
        },
      ],
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_LEAF_MOLY,
      noun: 'Moly',
      traits: [
        {
          traitId: 'moly-clear',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Purging',
          basePotency: 1,
          baseDurationMs: 0,
          effect: { kind: 'clear_sickness' },
        },
        {
          traitId: 'moly-ward',
          category: 'utility',
          polarity: 'positive',
          adjective: 'Hermetic',
          basePotency: 1,
          baseDurationMs: 120_000,
          effect: { kind: 'infection_resist', chanceMultiplier: 0.35 },
        },
        {
          traitId: 'moly-venom',
          category: 'defence',
          polarity: 'positive',
          adjective: 'Antidote',
          basePotency: 1,
          baseDurationMs: 90_000,
          effect: {
            kind: 'incoming_damage_multiplier',
            damageKinds: ['toxic', 'venomous'],
            baseMultiplier: 0.5,
          },
        },
      ],
    },
  ];
