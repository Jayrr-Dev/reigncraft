import { resolvingWorldPlazaApostleClayArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaApostleClayArmorSetRegistry';
import { resolvingWorldPlazaInventoryApostleClayArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryApostleClayArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_APOSTLE_CLAY_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryApostleClayArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_APOSTLE_CLAY_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaApostleClayArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing Apostle Clay armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryApostleClayArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing Apostle Clay armor sprite: ${typeId}`);
      }

      return {
        typeId,
        name: piece.displayName,
        rarity: 'epic' as const,
        iconSpriteSheet: spriteSheetIcon,
        tooltip: piece.tooltip,
        maxStack: 1,
        isDroppable: true,
        isStackable: false,
        tags: ['unique'] as const,
        armor: {
          slotId: piece.slotId,
        },
      };
    }
  );
}
