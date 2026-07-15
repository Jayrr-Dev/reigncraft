/**
 * Declarative blacksmith craftable plate-armor tiers (CaseIRL RPG pack columns).
 *
 * Ladder: leather → copper → iron → steel → gold. Weaker than unique sets.
 *
 * @module components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorTierRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type {
  DefiningWorldPlazaArmorSetDamageRollCrumb,
  DefiningWorldPlazaArmorSetThresholdBonus,
} from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS = [
  'casque',
  'gauntlets',
  'breastplate',
  'greaves',
  'sabatons',
] as const;

export type DefiningWorldPlazaCraftablePlateArmorPieceKey =
  (typeof DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS)[number];

export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_SLOT_BY_PIECE_KEY: Readonly<
  Record<
    DefiningWorldPlazaCraftablePlateArmorPieceKey,
    DefiningWorldPlazaArmorSlotId
  >
> = {
  casque: 'helm',
  gauntlets: 'arm',
  breastplate: 'body',
  greaves: 'leg',
  sabatons: 'foot',
};

export type DefiningWorldPlazaCraftablePlateArmorTierId =
  | 'leather-plate'
  | 'copper-plate'
  | 'iron-plate'
  | 'steel-plate'
  | 'gold-plate';

export type DefiningWorldPlazaCraftablePlateArmorTierDefinition = {
  readonly setId: DefiningWorldPlazaCraftablePlateArmorTierId;
  readonly materialLabel: string;
  readonly setLabel: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly spriteSheetUrl: string;
  /** Pack column in case-rpg-armour 8-wide sheets (0-based). */
  readonly packColumnIndex: number;
  readonly primaryIngredientItemTypeId: string;
  readonly complexityByPiece: Readonly<
    Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
  >;
  readonly primaryCostByPiece: Readonly<
    Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
  >;
  /** Extra wildlife hide straps (0 for leather tier). */
  readonly strapLeatherCostByPiece: Readonly<
    Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
  >;
  readonly pieceDisplayNameByKey: Readonly<
    Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, string>
  >;
  readonly pieceModifiersByKey: Readonly<
    Record<
      DefiningWorldPlazaCraftablePlateArmorPieceKey,
      readonly DefiningWorldPlazaArmorSetDamageRollCrumb[]
    >
  >;
  readonly setThresholds: readonly DefiningWorldPlazaArmorSetThresholdBonus[];
};

const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_STRAP_LEATHER: Readonly<
  Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
> = {
  casque: 0,
  gauntlets: 1,
  breastplate: 1,
  greaves: 0,
  sabatons: 1,
};

const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_COMPLEXITY: Readonly<
  Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
> = {
  casque: 3,
  gauntlets: 3,
  breastplate: 4,
  greaves: 3,
  sabatons: 3,
};

const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_PRIMARY_COST: Readonly<
  Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, number>
> = {
  casque: 3,
  gauntlets: 2,
  breastplate: 5,
  greaves: 3,
  sabatons: 2,
};

function creatingWorldPlazaCraftablePlateArmorMetalPieceNames(
  materialLabel: string
): Readonly<Record<DefiningWorldPlazaCraftablePlateArmorPieceKey, string>> {
  return {
    casque: `${materialLabel} Casque`,
    gauntlets: `${materialLabel} Gauntlets`,
    breastplate: `${materialLabel} Breastplate`,
    greaves: `${materialLabel} Greaves`,
    sabatons: `${materialLabel} Sabatons`,
  };
}

function creatingWorldPlazaCraftablePlateArmorPieceModifiers(input: {
  readonly helmExpected: number;
  readonly armStability: number;
  readonly bodyExpected: number;
  readonly legStability: number;
  readonly footExpected: number;
}): Readonly<
  Record<
    DefiningWorldPlazaCraftablePlateArmorPieceKey,
    readonly DefiningWorldPlazaArmorSetDamageRollCrumb[]
  >
> {
  return {
    casque: [{ kind: 'expected', value: input.helmExpected }],
    gauntlets: [{ kind: 'stability', value: input.armStability }],
    breastplate: [{ kind: 'expected', value: input.bodyExpected }],
    greaves: [{ kind: 'stability', value: input.legStability }],
    sabatons: [{ kind: 'expected', value: input.footExpected }],
  };
}

function creatingWorldPlazaCraftablePlateArmorSetThresholds(input: {
  readonly setLabel: string;
  readonly twoPieceStability: number;
  readonly threePieceExpected: number;
  readonly fourPieceExpected: number;
}): readonly DefiningWorldPlazaArmorSetThresholdBonus[] {
  return [
    {
      minPieces: 2,
      label: `${input.setLabel} 2-piece`,
      modifiers: [{ kind: 'stability', value: input.twoPieceStability }],
    },
    {
      minPieces: 3,
      label: `${input.setLabel} 3-piece`,
      modifiers: [{ kind: 'expected', value: input.threePieceExpected }],
    },
    {
      minPieces: 4,
      label: `${input.setLabel} full set`,
      modifiers: [{ kind: 'expected', value: input.fourPieceExpected }],
      grantsFullSetMarker: true,
    },
  ];
}

export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY: readonly DefiningWorldPlazaCraftablePlateArmorTierDefinition[] =
  [
    {
      setId: 'leather-plate',
      materialLabel: 'Leather',
      setLabel: 'Leather Plate',
      rarity: 'basic',
      spriteSheetUrl:
        '/inventory/sprites/inventory-leather-plate-armor-sprites.webp',
      packColumnIndex: 0,
      primaryIngredientItemTypeId: 'world-plaza-wildlife-hide',
      complexityByPiece: {
        casque: 2,
        gauntlets: 2,
        breastplate: 3,
        greaves: 2,
        sabatons: 2,
      },
      primaryCostByPiece: {
        casque: 2,
        gauntlets: 2,
        breastplate: 4,
        greaves: 3,
        sabatons: 2,
      },
      strapLeatherCostByPiece: {
        casque: 0,
        gauntlets: 0,
        breastplate: 0,
        greaves: 0,
        sabatons: 0,
      },
      pieceDisplayNameByKey: {
        casque: 'Leather Cap',
        gauntlets: 'Leather Mitts',
        breastplate: 'Leather Vest',
        greaves: 'Leather Greaves',
        sabatons: 'Leather Boots',
      },
      pieceModifiersByKey: creatingWorldPlazaCraftablePlateArmorPieceModifiers({
        helmExpected: 0.995,
        armStability: 0.99,
        bodyExpected: 0.99,
        legStability: 0.99,
        footExpected: 0.995,
      }),
      setThresholds: creatingWorldPlazaCraftablePlateArmorSetThresholds({
        setLabel: 'Leather Plate',
        twoPieceStability: 0.98,
        threePieceExpected: 0.98,
        fourPieceExpected: 0.97,
      }),
    },
    {
      setId: 'copper-plate',
      materialLabel: 'Copper',
      setLabel: 'Copper Plate',
      rarity: 'common',
      spriteSheetUrl:
        '/inventory/sprites/inventory-copper-plate-armor-sprites.webp',
      packColumnIndex: 1,
      primaryIngredientItemTypeId:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_COPPER,
      complexityByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_COMPLEXITY,
      primaryCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_PRIMARY_COST,
      strapLeatherCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_STRAP_LEATHER,
      pieceDisplayNameByKey:
        creatingWorldPlazaCraftablePlateArmorMetalPieceNames('Copper'),
      pieceModifiersByKey: creatingWorldPlazaCraftablePlateArmorPieceModifiers({
        helmExpected: 0.992,
        armStability: 0.985,
        bodyExpected: 0.985,
        legStability: 0.985,
        footExpected: 0.992,
      }),
      setThresholds: creatingWorldPlazaCraftablePlateArmorSetThresholds({
        setLabel: 'Copper Plate',
        twoPieceStability: 0.97,
        threePieceExpected: 0.97,
        fourPieceExpected: 0.95,
      }),
    },
    {
      setId: 'iron-plate',
      materialLabel: 'Iron',
      setLabel: 'Iron Plate',
      rarity: 'common',
      spriteSheetUrl:
        '/inventory/sprites/inventory-iron-plate-armor-sprites.webp',
      packColumnIndex: 3,
      primaryIngredientItemTypeId:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_IRON,
      complexityByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_COMPLEXITY,
      primaryCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_PRIMARY_COST,
      strapLeatherCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_STRAP_LEATHER,
      pieceDisplayNameByKey:
        creatingWorldPlazaCraftablePlateArmorMetalPieceNames('Iron'),
      pieceModifiersByKey: creatingWorldPlazaCraftablePlateArmorPieceModifiers({
        helmExpected: 0.99,
        armStability: 0.98,
        bodyExpected: 0.98,
        legStability: 0.98,
        footExpected: 0.99,
      }),
      setThresholds: creatingWorldPlazaCraftablePlateArmorSetThresholds({
        setLabel: 'Iron Plate',
        twoPieceStability: 0.95,
        threePieceExpected: 0.95,
        fourPieceExpected: 0.93,
      }),
    },
    {
      setId: 'steel-plate',
      materialLabel: 'Steel',
      setLabel: 'Steel Plate',
      rarity: 'uncommon',
      spriteSheetUrl:
        '/inventory/sprites/inventory-steel-plate-armor-sprites.webp',
      packColumnIndex: 4,
      primaryIngredientItemTypeId:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_STEEL,
      complexityByPiece: {
        casque: 4,
        gauntlets: 4,
        breastplate: 5,
        greaves: 4,
        sabatons: 4,
      },
      primaryCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_PRIMARY_COST,
      strapLeatherCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_STRAP_LEATHER,
      pieceDisplayNameByKey:
        creatingWorldPlazaCraftablePlateArmorMetalPieceNames('Steel'),
      pieceModifiersByKey: creatingWorldPlazaCraftablePlateArmorPieceModifiers({
        helmExpected: 0.985,
        armStability: 0.97,
        bodyExpected: 0.97,
        legStability: 0.97,
        footExpected: 0.985,
      }),
      setThresholds: creatingWorldPlazaCraftablePlateArmorSetThresholds({
        setLabel: 'Steel Plate',
        twoPieceStability: 0.93,
        threePieceExpected: 0.93,
        fourPieceExpected: 0.9,
      }),
    },
    {
      setId: 'gold-plate',
      materialLabel: 'Gold',
      setLabel: 'Gold Plate',
      rarity: 'rare',
      spriteSheetUrl:
        '/inventory/sprites/inventory-gold-plate-armor-sprites.webp',
      packColumnIndex: 5,
      primaryIngredientItemTypeId:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_INGOT_GOLD,
      complexityByPiece: {
        casque: 5,
        gauntlets: 5,
        breastplate: 6,
        greaves: 5,
        sabatons: 5,
      },
      primaryCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_PRIMARY_COST,
      strapLeatherCostByPiece:
        DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_METAL_STRAP_LEATHER,
      pieceDisplayNameByKey:
        creatingWorldPlazaCraftablePlateArmorMetalPieceNames('Gold'),
      pieceModifiersByKey: creatingWorldPlazaCraftablePlateArmorPieceModifiers({
        helmExpected: 0.98,
        armStability: 0.96,
        bodyExpected: 0.96,
        legStability: 0.96,
        footExpected: 0.98,
      }),
      setThresholds: creatingWorldPlazaCraftablePlateArmorSetThresholds({
        setLabel: 'Gold Plate',
        twoPieceStability: 0.9,
        threePieceExpected: 0.9,
        fourPieceExpected: 0.87,
      }),
    },
  ] as const;

export function formattingWorldPlazaCraftablePlateArmorItemTypeId(
  setId: DefiningWorldPlazaCraftablePlateArmorTierId,
  pieceKey: DefiningWorldPlazaCraftablePlateArmorPieceKey
): string {
  return `world-plaza-${setId}-${pieceKey}`;
}

export function formattingWorldPlazaCraftablePlateArmorRecipeId(
  setId: DefiningWorldPlazaCraftablePlateArmorTierId,
  pieceKey: DefiningWorldPlazaCraftablePlateArmorPieceKey
): string {
  return `recipe-${setId}-${pieceKey}`;
}

export function resolvingWorldPlazaCraftablePlateArmorTierDefinition(
  setId: string
): DefiningWorldPlazaCraftablePlateArmorTierDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY.find(
      (tier) => tier.setId === setId
    ) ?? null
  );
}
