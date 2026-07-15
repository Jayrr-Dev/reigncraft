/**
 * Craft recipe ids for all craftable plate-armor pieces.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftablePlateArmorRecipeIds
 */

import {
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS,
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY,
  formattingWorldPlazaCraftablePlateArmorRecipeId,
} from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorTierRegistry';

function buildingWorldPlazaCraftablePlateArmorRecipeIdEntries(): Record<
  string,
  string
> {
  const entries: Record<string, string> = {};

  for (const tier of DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY) {
    for (const pieceKey of DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS) {
      const constKey = `${tier.setId
        .replaceAll('-', '_')
        .toUpperCase()}_${pieceKey.toUpperCase()}`;
      entries[constKey] = formattingWorldPlazaCraftablePlateArmorRecipeId(
        tier.setId,
        pieceKey
      );
    }
  }

  return entries;
}

/** Spread into {@link DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID}. */
export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_RECIPE_ID =
  buildingWorldPlazaCraftablePlateArmorRecipeIdEntries() as {
    readonly LEATHER_PLATE_CASQUE: 'recipe-leather-plate-casque';
    readonly LEATHER_PLATE_GAUNTLETS: 'recipe-leather-plate-gauntlets';
    readonly LEATHER_PLATE_BREASTPLATE: 'recipe-leather-plate-breastplate';
    readonly LEATHER_PLATE_GREAVES: 'recipe-leather-plate-greaves';
    readonly LEATHER_PLATE_SABATONS: 'recipe-leather-plate-sabatons';
    readonly COPPER_PLATE_CASQUE: 'recipe-copper-plate-casque';
    readonly COPPER_PLATE_GAUNTLETS: 'recipe-copper-plate-gauntlets';
    readonly COPPER_PLATE_BREASTPLATE: 'recipe-copper-plate-breastplate';
    readonly COPPER_PLATE_GREAVES: 'recipe-copper-plate-greaves';
    readonly COPPER_PLATE_SABATONS: 'recipe-copper-plate-sabatons';
    readonly IRON_PLATE_CASQUE: 'recipe-iron-plate-casque';
    readonly IRON_PLATE_GAUNTLETS: 'recipe-iron-plate-gauntlets';
    readonly IRON_PLATE_BREASTPLATE: 'recipe-iron-plate-breastplate';
    readonly IRON_PLATE_GREAVES: 'recipe-iron-plate-greaves';
    readonly IRON_PLATE_SABATONS: 'recipe-iron-plate-sabatons';
    readonly STEEL_PLATE_CASQUE: 'recipe-steel-plate-casque';
    readonly STEEL_PLATE_GAUNTLETS: 'recipe-steel-plate-gauntlets';
    readonly STEEL_PLATE_BREASTPLATE: 'recipe-steel-plate-breastplate';
    readonly STEEL_PLATE_GREAVES: 'recipe-steel-plate-greaves';
    readonly STEEL_PLATE_SABATONS: 'recipe-steel-plate-sabatons';
    readonly GOLD_PLATE_CASQUE: 'recipe-gold-plate-casque';
    readonly GOLD_PLATE_GAUNTLETS: 'recipe-gold-plate-gauntlets';
    readonly GOLD_PLATE_BREASTPLATE: 'recipe-gold-plate-breastplate';
    readonly GOLD_PLATE_GREAVES: 'recipe-gold-plate-greaves';
    readonly GOLD_PLATE_SABATONS: 'recipe-gold-plate-sabatons';
  };
