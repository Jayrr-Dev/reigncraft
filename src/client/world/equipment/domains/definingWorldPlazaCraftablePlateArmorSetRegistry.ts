/**
 * Expanded craftable plate-armor pieces from the tier registry.
 *
 * @module components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorSetRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type { DefiningWorldPlazaArmorSetDamageRollCrumb } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import { formattingWorldPlazaArmorSetCombatModifierId } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS,
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_SLOT_BY_PIECE_KEY,
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY,
  formattingWorldPlazaCraftablePlateArmorItemTypeId,
  type DefiningWorldPlazaCraftablePlateArmorPieceKey,
  type DefiningWorldPlazaCraftablePlateArmorTierDefinition,
  type DefiningWorldPlazaCraftablePlateArmorTierId,
} from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorTierRegistry';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export type DefiningWorldPlazaCraftablePlateArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly setId: DefiningWorldPlazaCraftablePlateArmorTierId;
  readonly pieceKey: DefiningWorldPlazaCraftablePlateArmorPieceKey;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly spriteSheetUrl: string;
  readonly sheetColumnIndex: number;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
  readonly tier: DefiningWorldPlazaCraftablePlateArmorTierDefinition;
};

function formattingWorldPlazaCraftablePlateArmorTooltip(
  tier: DefiningWorldPlazaCraftablePlateArmorTierDefinition,
  pieceKey: DefiningWorldPlazaCraftablePlateArmorPieceKey
): string {
  const name = tier.pieceDisplayNameByKey[pieceKey];
  const material = tier.materialLabel.toLowerCase();
  if (tier.setId === 'leather-plate') {
    return `${name}. Soft trail armour. Stitch at an anvil.`;
  }
  return `${name}. ${material} plate. Hammer at an anvil.`;
}

export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaCraftablePlateArmorPieceDefinition[] =
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_TIER_REGISTRY.flatMap((tier) =>
    DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_KEYS.map(
      (pieceKey, sheetColumnIndex) => ({
        itemTypeId: formattingWorldPlazaCraftablePlateArmorItemTypeId(
          tier.setId,
          pieceKey
        ),
        setId: tier.setId,
        pieceKey,
        slotId:
          DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_SLOT_BY_PIECE_KEY[
            pieceKey
          ],
        displayName: tier.pieceDisplayNameByKey[pieceKey],
        tooltip: formattingWorldPlazaCraftablePlateArmorTooltip(tier, pieceKey),
        rarity: tier.rarity,
        spriteSheetUrl: tier.spriteSheetUrl,
        sheetColumnIndex,
        pieceModifiers: tier.pieceModifiersByKey[pieceKey],
        tier,
      })
    )
  );

export const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  ) as readonly string[];

/** Iron Plate ids kept for callers that still name that tier. */
export const DEFINING_WORLD_PLAZA_INVENTORY_IRON_PLATE_ARMOR_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY.filter(
    (piece) => piece.setId === 'iron-plate'
  ).map((piece) => piece.itemTypeId);

const DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaCraftablePlateArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaCraftablePlateArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_BY_TYPE_ID.get(
      itemTypeId
    ) ?? null
  );
}

export function checkingWorldPlazaInventoryItemIsCraftablePlateArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_PIECE_BY_TYPE_ID.has(
    itemTypeId
  );
}

/** @deprecated Prefer {@link checkingWorldPlazaInventoryItemIsCraftablePlateArmor}. */
export function checkingWorldPlazaInventoryItemIsIronPlateArmor(
  itemTypeId: string
): boolean {
  return (
    resolvingWorldPlazaCraftablePlateArmorPieceDefinition(itemTypeId)?.setId ===
    'iron-plate'
  );
}

export function formattingWorldPlazaCraftablePlateArmorSetCombatModifierId(
  setId: DefiningWorldPlazaCraftablePlateArmorTierId,
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(setId, crumbKey);
}
