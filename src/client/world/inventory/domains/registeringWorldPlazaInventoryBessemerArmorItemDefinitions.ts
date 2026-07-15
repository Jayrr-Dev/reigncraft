import { resolvingWorldPlazaBessemerArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaBessemerArmorSetRegistry';
import { resolvingWorldPlazaInventoryBessemerArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBessemerArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryBessemerArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_BESSEMER_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaBessemerArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing Bessemer armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryBessemerArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing Bessemer armor sprite: ${typeId}`);
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
